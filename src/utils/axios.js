import axios from 'axios'
import store from '../store'

const instance =axios.create({})

instance.defaults.baseURL = '/api'
instance.defaults.timeout = 20000

//封装请求头
instance.interceptors.request.use(config =>{
    config.headers.authorization = localStorage.getItem("authorization")
    return config
})

//处理响应
instance.interceptors.response.use(response => {
    const res = response.data;
    if(res.code === -10000){
        //未登录
        return Promise.reject(res.msg);
    }
    if(res.code === 200){
        return res;
    }
    return response;
})

export default { instance }