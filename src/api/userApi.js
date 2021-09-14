import http from '../utils/http'

const userApi={
    userLogin: (params) => {
        return http.post('/sysUser/login',params)
    },
}

export default userApi