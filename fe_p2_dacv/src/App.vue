<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
    <div class="container">
      <a class="navbar-brand" href="#">SIS257 - Segundo Parcial</a>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/eventos">Eventos Culturales</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  
  <div class="container">
    <!-- Aquí se inyectarán las vistas (como EventosView) -->
    <router-view></router-view>
  </div>
</template>

<style>
/* Fondo ligeramente gris para que resalten las tarjetas y tablas de Bootstrap */
body { 
  background-color: #f8f9fa; 
}
</style>