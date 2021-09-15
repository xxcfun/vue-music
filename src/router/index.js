import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
