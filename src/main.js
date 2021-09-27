import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import less from 'less'
import store from './store'
import Antd from 'ant-design-vue'
import permissiom from './router/permisson'
import 'ant-design-vue/dist/antd.css'
import 'ant-design-vue/dist/antd.less'
import * as antIcons from '@ant-design/icons-vue'
import './common/index.less'


const app = createApp(App)
// 注册所有的icon
Object.keys(antIcons).forEach(key => {
    app.component(key, antIcons[key])
})
app.config.globalProperties.$antIcons = antIcons
app
    .use(Antd)
    .use(less)
    .use(store)
    .use(router)
    .mount('#app')
