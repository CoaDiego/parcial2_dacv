<template>
  <div class="mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Gestión de Eventos Culturales</h2>
      <button class="btn btn-primary" @click="abrirModal()">Nuevo Evento</button>
    </div>

    <!-- Tabla de Eventos -->
    <div class="table-responsive">
      <table class="table table-striped table-hover border">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Artista</th>
            <th>Recinto</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="evento in eventos" :key="evento.id">
            <td>{{ evento.id }}</td>
            <td>{{ evento.titulo }}</td>
            <td>{{ evento.artistaPrincipal }}</td>
            <!-- Mostramos el nombre del recinto gracias a la relación de TypeORM -->
            <td>{{ evento.recinto?.nombre }}</td>
            <td>{{ evento.fechaEvento }}</td>
            <td>
              <span class="badge" :class="evento.estado === 'Programado' ? 'bg-success' : 'bg-secondary'">
                {{ evento.estado }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="abrirModal(evento)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="eliminarEvento(evento.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Bootstrap -->
    <div class="modal fade" id="eventoModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">{{ isEditing ? 'Editar Evento' : 'Nuevo Evento' }}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarEvento">
              
              <div class="mb-3">
                <label class="form-label">Título</label>
                <input type="text" class="form-control" v-model="formulario.titulo" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Artista Principal</label>
                <input type="text" class="form-control" v-model="formulario.artistaPrincipal" required>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Duración (min)</label>
                  <input type="number" class="form-control" v-model="formulario.duracionMinutos" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Precio (Bs)</label>
                  <input type="number" step="0.1" class="form-control" v-model="formulario.precioEntrada" required>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Fecha del Evento</label>
                <input type="date" class="form-control" v-model="formulario.fechaEvento" required>
              </div>

              <!-- Select para los Estados -->
              <div class="mb-3">
                <label class="form-label">Estado</label>
                <select class="form-select" v-model="formulario.estado" required>
                  <option value="" disabled>Seleccione un estado</option>
                  <option value="Programado">Programado</option>
                  <option value="En curso">En curso</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <!-- Select Dinámico para los Recintos (Requisito del Ingeniero) -->
              <div class="mb-3">
                <label class="form-label">Recinto</label>
                <select class="form-select" v-model="formulario.idRecinto" required>
                  <option value="" disabled>Seleccione un recinto</option>
                  <option v-for="recinto in recintos" :key="recinto.id" :value="recinto.id">
                    {{ recinto.nombre }} ({{ recinto.ciudad }})
                  </option>
                </select>
              </div>

              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import * as bootstrap from 'bootstrap'

const API_EVENTOS = 'http://localhost:3000/api/v1/eventos-culturales'
const API_RECINTOS = 'http://localhost:3000/api/v1/recintos'

const eventos = ref([])
const recintos = ref([])
const isEditing = ref(false)
let modalInstance = null

const formulario = ref({
  id: null,
  titulo: '',
  artistaPrincipal: '',
  duracionMinutos: '',
  precioEntrada: '',
  fechaEvento: '',
  estado: '',
  idRecinto: ''
})

onMounted(() => {
  obtenerEventos()
  obtenerRecintos()
  // Inicializamos el modal de Bootstrap
  modalInstance = new bootstrap.Modal(document.getElementById('eventoModal'))
})

const obtenerEventos = async () => {
  try {
    const respuesta = await axios.get(API_EVENTOS)
    eventos.value = respuesta.data
  } catch (error) {
    console.error('Error al obtener eventos:', error)
  }
}

const obtenerRecintos = async () => {
  try {
    const respuesta = await axios.get(API_RECINTOS)
    recintos.value = respuesta.data
  } catch (error) {
    console.error('Error al obtener recintos:', error)
  }
}

const abrirModal = (evento = null) => {
  if (evento) {
    isEditing.value = true
    // Clonamos los datos para no afectar la tabla reactiva hasta que se guarde
    formulario.value = { ...evento }
  } else {
    isEditing.value = false
    formulario.value = {
      id: null,
      titulo: '',
      artistaPrincipal: '',
      duracionMinutos: '',
      precioEntrada: '',
      fechaEvento: '',
      estado: '',
      idRecinto: ''
    }
  }
  modalInstance.show()
}

const guardarEvento = async () => {
  // Asegurarnos de que los tipos numéricos se envíen como números para el ValidationPipe
  const payload = {
    ...formulario.value,
    duracionMinutos: Number(formulario.value.duracionMinutos),
    precioEntrada: Number(formulario.value.precioEntrada),
    idRecinto: Number(formulario.value.idRecinto)
  }

  try {
    if (isEditing.value) {
      const { id, ...datosActualizar } = payload
      await axios.patch(`${API_EVENTOS}/${id}`, datosActualizar)
    } else {
      await axios.post(API_EVENTOS, payload)
    }
    
    modalInstance.hide()
    obtenerEventos()
  } catch (error) {
    console.error('Error al guardar:', error)
    alert('Ocurrió un error al guardar. Verifica la consola.')
  }
}

const eliminarEvento = async (id) => {
  if (confirm('¿Estás seguro de eliminar este evento?')) {
    try {
      await axios.delete(`${API_EVENTOS}/${id}`)
      obtenerEventos()
    } catch (error) {
      console.error('Error al eliminar:', error)
    }
  }
}
</script>