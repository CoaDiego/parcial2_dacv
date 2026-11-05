# REPORTE_DEFENSA.md - Sistema de Gestión de Eventos Culturales (SIS257)

> **Documento de Arquitectura y Cheat Sheet para Defensa de Examen Práctico**  
> **Stack:** Backend: NestJS + TypeORM + PostgreSQL | Frontend: Vue 3 (Composition API) + Vite + Bootstrap 5  
> **Autor:** Diego Armando Clavijo Vargas (DACV)

---

## 1. Mapa de Archivos Críticos

A continuación se presentan los **6 archivos neurálgicos** del proyecto donde se concentra toda la arquitectura y la lógica de negocio:

```text
parcial2_dacv/
├── be_p2_dacv/src/
│   ├── app.module.ts                                   # [1] Configuración global, TypeORM con PostgreSQL y 'synchronize: true'
│   ├── recintos/entities/recinto.entity.ts             # [2] Entidad padre 'Recinto' (1:N) requerida para la llave foránea y selects
│   └── eventos-culturales/
│       ├── entities/eventos-culturale.entity.ts        # [3] Entidad TypeORM: mapea columnas, relaciones (N:1) y soft deletes en BD
│       ├── dto/create-eventos-culturale.dto.ts         # [4] Reglas de validación (class-validator) y contrato de entrada de la API
│       └── eventos-culturales.service.ts               # [5] Lógica de negocio y consultas CRUD ejecutadas con el Repository TypeORM
└── fe_p2_dacv/src/
    └── views/EventosView.vue                           # [6] Vista SPA completa: tabla reactiva, modal Bootstrap y peticiones Axios
```

### Descripción funcional rápida:
1. **`be_p2_dacv/src/app.module.ts`**: Orquesta la infraestructura del backend; inicializa la conexión con PostgreSQL y activa la auto-sincronización de esquemas (`synchronize: true`).
2. **`be_p2_dacv/src/recintos/entities/recinto.entity.ts`**: Modela el catálogo de recintos y su relación uno a muchos (`@OneToMany`) hacia los eventos culturales.
3. **`be_p2_dacv/src/eventos-culturales/entities/eventos-culturale.entity.ts`**: Modela la tabla `eventos_culturales`, administrando columnas, clave foránea (`id_recinto`) y borrado lógico (`@DeleteDateColumn`).
4. **`be_p2_dacv/src/eventos-culturales/dto/create-eventos-culturale.dto.ts`**: Valida y sanitiza las entradas HTTP (`whitelist: true`); sirve de base para el DTO de actualización (`update-eventos-culturale.dto.ts`).
5. **`be_p2_dacv/src/eventos-culturales/eventos-culturales.service.ts`**: Ejecuta las operaciones de persistencia en PostgreSQL (`save`, `find` con relaciones, `findOne`, `softRemove`).
6. **`fe_p2_dacv/src/views/EventosView.vue`**: Interfaz de usuario completa que gestiona el estado reactivo (`ref`), renderizado de tabla, formulario modal y comunicación REST con Axios.

---

## 2. Guía Rápida de Modificaciones (Cheat Sheet en Vivo)

Usa esta guía si el docente solicita cambios en vivo durante la defensa.

---

### A) Agregar una nueva variable/columna a la base de datos
*Ejemplo solicitado en defensa: Agregar el campo `descripcion` (texto opcional de hasta 255 caracteres).*

#### Paso 1: Actualizar la Entidad Backend
- **Archivo:** `be_p2_dacv/src/eventos-culturales/entities/eventos-culturale.entity.ts`
- **Ubicación:** Agregar alrededor de la **línea 29** (justo antes de `@CreateDateColumn`):
```typescript
  @Column('varchar', { length: 255, nullable: true })
  descripcion: string;
```
> **Tip para el Evaluador:** No se requiere migración manual SQL porque en `app.module.ts` está configurado `synchronize: true`. Al guardar el archivo con `npm run start:dev`, TypeORM ejecuta automáticamente el `ALTER TABLE eventos_culturales ADD COLUMN descripcion ...` en PostgreSQL.

#### Paso 2: Actualizar el DTO de Validación Backend
- **Archivo:** `be_p2_dacv/src/eventos-culturales/dto/create-eventos-culturale.dto.ts`
- **Ubicación:** Agregar al final de la clase (alrededor de la **línea 44**):
```typescript
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  @MaxLength(255, { message: 'La descripción no puede exceder 255 caracteres' })
  readonly descripcion?: string;
```
> **Pregunta trampa del Evaluador:** *¿Por qué es obligatorio agregarlo al DTO si ya está en la Entidad?*  
> **Respuesta:** En `main.ts` tenemos activo `ValidationPipe({ whitelist: true })`. Si un campo enviado en el JSON no está explícitamente decorado en el DTO, NestJS lo descarta silenciosamente por seguridad antes de llegar al servicio.  
> *(Nota: `update-eventos-culturale.dto.ts` lo hereda automáticamente vía `PartialType`, no necesitas modificarlo).*

---

### B) Agregar un nuevo campo al formulario frontend (Modal)
*Continuando con el campo `descripcion`:*

#### Paso 1: Agregar el input en el `<template>`
- **Archivo:** `fe_p2_dacv/src/views/EventosView.vue`
- **Ubicación:** Dentro del `<form @submit.prevent="guardarEvento">`, entre las **líneas 79 y 82** (después de "Fecha del Evento"):
```html
<div class="mb-3">
  <label class="form-label">Descripción</label>
  <input type="text" class="form-control" v-model="formulario.descripcion">
</div>
```

#### Paso 2: Actualizar el estado reactivo en `<script setup>`
- **Archivo:** `fe_p2_dacv/src/views/EventosView.vue`
- **Ubicación 1 (Declaración del `ref`):** Alrededor de la **línea 139**:
```javascript
const formulario = ref({
  id: null,
  titulo: '',
  artistaPrincipal: '',
  duracionMinutos: '',
  precioEntrada: '',
  fechaEvento: '',
  estado: '',
  idRecinto: '',
  descripcion: '' // <-- Agregar aquí
})
```
- **Ubicación 2 (Limpieza en `abrirModal`):** Alrededor de la **línea 182**:
```javascript
formulario.value = {
  id: null,
  titulo: '',
  artistaPrincipal: '',
  duracionMinutos: '',
  precioEntrada: '',
  fechaEvento: '',
  estado: '',
  idRecinto: '',
  descripcion: '' // <-- Agregar aquí para resetear al pulsar "Nuevo Evento"
}
```
> **Nota de persistencia:** En `guardarEvento()` (línea 189) el payload se propaga con el spread operator `...formulario.value`, por lo que el nuevo campo se enviará automáticamente a la API sin código adicional. Si el campo fuera numérico, se debe envolver con `Number(formulario.value.nuevoCampo)`.

---

### C) Mostrar un nuevo dato en la tabla principal

- **Archivo:** `fe_p2_dacv/src/views/EventosView.vue`

#### Paso 1: Agregar la cabecera `<th>`
- **Ubicación:** Dentro de `<thead class="table-dark"><tr>`, alrededor de la **línea 18** (antes de `<th>Acciones</th>`):
```html
<th>Descripción</th>
```

#### Paso 2: Agregar la celda de datos `<td>`
- **Ubicación:** Dentro de `<tbody><tr v-for="evento in eventos">`, alrededor de la **línea 34** (antes de la columna de botones de acciones):
```html
<td>{{ evento.descripcion || 'Sin descripción' }}</td>
```

---

### D) Agregar una nueva acción/botón a la tabla

- **Archivo:** `fe_p2_dacv/src/views/EventosView.vue`

#### Paso 1: Agregar el botón en el `<template>`
- **Ubicación:** En la columna de acciones (dentro de `<td>`, alrededor de las **líneas 36-38**):
```html
<button class="btn btn-sm btn-info text-white me-2" @click="verDetalle(evento)">
  Detalle
</button>
```

#### Paso 2: Declarar la función en `<script setup>`
- **Ubicación:** Al final del bloque `<script setup>`, justo antes de `</script>` (alrededor de la **línea 221**):
```javascript
const verDetalle = (evento) => {
  console.log('Detalle del evento:', evento)
  alert(`Detalles del Evento:\n- Título: ${evento.titulo}\n- Artista: ${evento.artistaPrincipal}\n- Recinto: ${evento.recinto?.nombre ?? 'No asignado'}`)
}
```

---

## 3. Flujo de Datos Arquitectural (End-to-End)

1. **Frontend (Disparo y Transporte):** Al pulsar "Guardar", `guardarEvento()` en `EventosView.vue` normaliza los tipos (`Number`), emite una petición asíncrona mediante `axios.post` (o `axios.patch`) enviando el JSON a `http://localhost:3000/api/v1/eventos-culturales`.
2. **Backend (Controlador y Validación):** `EventosCulturalesController` recibe el body, el `ValidationPipe` global intercepta y valida la carga útil contra `CreateEventosCulturaleDto` (descartando propiedades fuera de lista blanca) y delega la ejecución al método `create()` de `EventosCulturalesService`.
3. **Persistencia (ORM y Base de Datos):** `EventosCulturalesService` instancia la entidad, mapea las propiedades y ejecuta `this.eventosRepository.save(evento)`, haciendo que TypeORM compile y dispare un comando SQL `INSERT INTO eventos_culturales (...)` hacia PostgreSQL, retornando el registro persistido al cliente para refrescar la tabla reactiva.

