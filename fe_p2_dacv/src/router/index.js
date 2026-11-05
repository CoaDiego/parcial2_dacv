import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    // Redirigimos la ruta base directamente a los eventos
    redirect: '/eventos'
  },
  {
    path: '/eventos',
    name: 'eventos',
    component: () => import('../views/EventosView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router