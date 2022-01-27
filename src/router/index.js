import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    redirect:{ path: '/mainPage' }
  },
  {
    path: '/main',
    name: 'Main',
    redirect:{name: 'MyNovel'},
    component: () => import('../views/Main.vue'),
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
        path: 'seriesInfo',
        name: 'SeriesInfo',
        meta: {
          title: '系列详情'
        },
        component: () => import('@/views/novel/novelManager/children/SeriesInfo.vue'),
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
        path: 'chapterContent',
        name: 'ChapterContent',
        meta: {
          title: '小说内容'
        },
        component: () => import('@/views/novel/chapter/ChapterContent.vue'),
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
      },
      {
        path: 'dictManager',
        name: 'DictManager',
        meta: {
          title: '字典管理'
        },
        component: () => import('@/views/system/DictManager.vue')
      },
      {
        path: 'userManager',
        name: 'UserManager',
        meta: {
          title: '用户管理'
        },
        component: () => import('@/views/system/UserManager.vue')
      },
      {
        path: 'roleManager',
        name: 'RoleManager',
        meta: {
          title: '角色权限管理'
        },
        component: () => import('@/views/system/RoleManager.vue')
      }
    ]
  },
  {
    path: '/novel/contentPage',
    name: 'ContentPage',
    meta: {
      title: '小说阅读页面'
    },
    component: () => import('@/views/ContentPage.vue')
  },
  {
    path: '/mainPage',
    name: 'MainPage',
    redirect:{path: '/mainPage/listPage'},
    component: () => import('@/views/main/MainPage.vue'),
    children: [
      {
        path: 'listPage',
        name: 'ListPage',
        meta: {
          title: '收藏列表'
        },
        component: () => import('@/views/main/ListPage.vue')
      },
      {
        path: 'novelInfo',
        name: 'NovelInfo2',
        meta: {
          title: '小说详情'
        },
        component: () => import('@/views/novel/novelManager/children/NovelInfo.vue'),
      },
      {
        path: 'seriesInfo',
        name: 'SeriesInfo2',
        meta: {
          title: '系列详情'
        },
        component: () => import('@/views/novel/novelManager/children/SeriesInfo.vue'),
      },
      {
        path: 'chapterContent',
        name: 'ChapterContent2',
        meta: {
          title: '小说内容'
        },
        component: () => import('@/views/novel/chapter/ChapterContent.vue'),
      },
      {
        path: 'noticeList',
        name: 'NoticeList',
        meta: {
          title: '公告列表'
        },
        component: () => import('@/views/system/NoticeList.vue')
      }
    ],
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router
