import instance from './axios'

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
