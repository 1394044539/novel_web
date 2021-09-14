import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './api'

//use是引用插件，prototype是挂载属性或方法

createApp(App)
    .use(store)
    .use(router)
    .use(http)
    .mount('#app')
