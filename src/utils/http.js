import axios from "axios";
import util from '../utils/util'

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
    // if(res.code === -10000){
    //     //未登录
    //     return Promise.reject(res.msg);
    // }
    if(res.code === 200){
        return res.data;
    }
    util.error(res.msg)
    return Promise.reject(res.msg);
    // return response;
},error => {
    const res=error.response
    if(res && res.status === 500){
        util.noticeError("服务器异常！",res.data)
    } else if (res && res.status === 404){
        util.noticeError("404啦！",res.data)
    }else if (error.toString().search('timeout')){
        util.noticeError('请求超时',res.data)
    } else {
        util.noticeError('错误代码：'+res.status+",请联系管理员",res.data)
    }
    return Promise.reject(error)
})

/**
 * post请求
 * @param url
 * @param data
 * @param loading
 * @returns {Promise<unknown>}
 */
const post = function (url,data,loading) {
    return new Promise((resolve,reject)=>{
        instance.post(url,data)
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
    })
}

/**
 * get请求
 * @param url
 * @param params
 * @param loading
 * @returns {Promise<any>}
 */
const get = function (url, params, loading) {
    return new Promise((resolve,reject)=>{
        instance.get(url,{
            params: params
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

/**
 * put请求
 * @param url
 * @param params
 * @param loading
 * @returns {Promise<any>}
 */
const put = function (url, params, loading) {
    return new Promise((resolve,reject)=>{
        instance.put(url,params)
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
    })
}

/**
 * delete请求
 * @param url
 * @param params
 * @param loading
 * @returns {Promise<any>}
 * @constructor
 */
const Delete = function (url, params, loading) {
    return new Promise((resolve,reject)=>{
        instance.delete(url,{
            params: params
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

const downloadFile = function (url,params,fileName) {
    instance.get(instance.defaults.baseURL+url,{
        params:params,
        responseType: 'blob'
    }).then(res=> {
        var eleLink = document.createElement('a');
        eleLink.style.display = 'none';
        eleLink.download = fileName;
        let arr = []
        arr.push(res.data)
        var blob = new Blob(arr);
        eleLink.href = window.URL.createObjectURL(blob);
        // 自动触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    }).catch(er=>{
        console.log(er);
    })
}

export default { post, get, put, Delete, downloadFile }
