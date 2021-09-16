import http from '../utils/http'

const userApi={
    userLogin: (params,loading=false) => {
        return http.post('/sysUser/login',params,loading)
    },
}

const sysApi={

}

export default { userApi ,sysApi }
