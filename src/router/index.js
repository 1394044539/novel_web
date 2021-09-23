import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    redirect:{ path: '/main' }
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import(/* webpackChunkName: "about" */ '../views/Main.vue'),
    children:[
      {
        path: '/login',
        name: 'Login',
        meta: {
          title: '登录页面'
        },
        component: () => import('@/views/user/Login.vue')
      },
      {
        path: 'myNovel',
        name: 'MyNovel',
        meta: {
          title: '登录页面'
        },
        component: () => import('@/views/novel/MyNovel.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router
