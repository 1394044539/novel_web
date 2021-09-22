import http from '../utils/http'

const userApi={
    userLogin: (params,loading=false) => {
        return http.post('/sysUser/loginByAccount',params,loading)
    },
    getVcode: (params,loading=false)=>{
        return http.get('/sysUser/getVerifyCode',params,loading)
    },
    userLoginByPhone:(params,loading=false) => {
        return http.post('/sysUser/loginByPhone',params,loading)
    },
}

const sysApi={

}

export default { userApi ,sysApi }
