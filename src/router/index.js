import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    redirect:{ path: '/main' }
  },
  {
    path: '/main',
    name: 'Main',
    redirect:{name: 'MyNovel'},
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
          title: '首页',
        },
        component: () => import('@/views/novel/MyNovel.vue')
      },
      {
        path: 'novelManager',
        name: 'NovelManager',
        meta: {
          title: '小说管理'
        },
        component: () => import('@/views/novel/novelManager/NovelManager.vue'),
      },
      {
        path: 'novelInfo',
        name: 'NovelInfo',
        meta: {
          title: '小说详情'
        },
        component: () => import('@/views/novel/novelManager/children/NovelInfo.vue'),
      },
      {
        path: 'uploadRecord',
        name: 'UploadRecord',
        meta: {
          title: '上传记录'
        },
        component: () => import('@/views/novel/UploadRecord.vue')
      },
      {
        path: 'historyRecord',
        name: 'HistoryRecord',
        meta: {
          title: '历史记录'
        },
        component: () => import('@/views/novel/HistoryRecord.vue')
      },
      {
        path: 'markList',
        name: 'MarkList',
        meta: {
          title: '书签记录'
        },
        component: () => import('@/views/novel/MarkList.vue')
      },
      {
        path: 'dynamicInfo',
        name: 'DynamicInfo',
        meta: {
          title: '动态信息'
        },
        component: () => import('@/views/user/DynamicInfo.vue')
      },
      {
        path: 'infoSetting',
        name: 'InfoSetting',
        meta: {
          title: '信息设置'
        },
        component: () => import('@/views/user/InfoSetting.vue')
      },
      {
        path: 'safeSetting',
        name: 'SafeSetting',
        meta: {
          title: '安全设置'
        },
        component: () => import('@/views/user/SafeSetting.vue')
      },
      {
        path: 'adminCenter',
        name: 'AdminCenter',
        meta: {
          title: '管理员中心'
        },
        component: () => import('@/views/system/AdminCenter.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router
