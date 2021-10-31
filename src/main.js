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
import { createFromIconfontCN } from '@ant-design/icons-vue';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});

const app = createApp(App)
// 注册所有的icon
app.component('IconFont',IconFont);
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
