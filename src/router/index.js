import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    redirect:{ path: '/main' }
  },
  {
    path: '/main',
    name: 'Main',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Main.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录页面'
    },
    component: () => import('@/views/user/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router
