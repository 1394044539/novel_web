import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import less from 'less'
import store from './store'
import Antd from 'ant-design-vue'
import permissiom from './router/permisson'
import 'ant-design-vue/dist/antd.css'
import 'ant-design-vue/dist/antd.less'

createApp(App)
    .use(Antd)
    .use(less)
    .use(store)
    .use(router)
    .mount('#app')
