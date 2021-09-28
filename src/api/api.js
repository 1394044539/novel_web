import http from '../utils/http'

const userApi = {
    userLogin: (params, loading = false) => {
        return http.post('/sysUser/loginByAccount', params, loading)
    },
    getVcode: (params, loading = false) => {
        return http.get('/sysUser/getVerifyCode', params, loading)
    },
    userLoginByPhone: (params, loading = false) => {
        return http.post('/sysUser/loginByPhone', params, loading)
    },
    checkPhone: (params, loading = false) => {
        return http.post('/sysUser/checkPhone', params, loading)
    },
    updatePassword: (params,loading=false)=>{
        return http.put('/sysUser/updatePassword',params,loading)
    },
    applyRegister: (params,loading=false)=>{
        return http.post('/sysRegister/applyRegister',params,loading)
    },
    logout: (loading=false)=>{
        return http.post('/sysUser/logout')
    }
}

const sysApi = {}

const novelApi = {
    getNovelList: (params, loading = false) => {
        return http.post('/novel/getNovelList', params, loading)
    },
    quickUpload: (params,loading=false) =>{
        return http.post('/novel/quickUpload',params,loading)
    }
}

export default {userApi, sysApi, novelApi}
