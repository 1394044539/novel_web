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
    },
    getUserInfoList: (params,loading=false)=>{
        return http.post('/sysUserInfo/getUserList',params,loading)
    },
    getRoleList: (params,loading=false)=>{
        return http.post('/sysRole/getRoleList',params,loading)
    },
    getAllRoleList: (params,loading=false)=>{
        return http.post('/sysRole/getAllRoleList',params,loading)
    },
    addUser: (params,loading=false)=>{
        return http.post('/sysUser/addUser',params,loading)
    },
    addRole: (params,loading=false)=>{
        return http.post('/sysRole/addRole',params,loading)
    },
    updateRole: (params,loading=false)=>{
        return http.put('/sysRole/updateRole',params,loading)
    },
    geyRoleInfo: (params,loading=false)=>{
        return http.get('/sysRole/getRoleInfo',params,loading)
    },
}

const sysApi = {
    getDictList: (params,loading=false)=>{
        return http.post('/sysDict/getDictList',params,loading)
    },
    addDict: (params,loading=false)=>{
        return http.post('/sysDict/addDict',params,loading)
    },
    getDictInfo: (params,loading=false)=>{
        return http.get('/sysDict/getDictInfo',params,loading)
    },
    updateDict: (params,loading=false)=>{
        return http.put('/sysDict/updateDict',params,loading)
    },
    deleteDict: (params,loading=false)=> {
        return http.Delete('/sysDict/deleteDict',params,loading)
    },
    getDictParamList: (params,loading=false)=>{
        return http.post('/sysDictParam/getDictParamList',params,loading)
    },
}

const novelApi = {
    getNovelList: (params, loading = false) => {
        return http.post('/novel/getNovelList', params, loading)
    },
    quickUpload: (params,loading=false) =>{
        return http.post('/novel/quickUpload',params,loading)
    },
    createNovel: (params,loading=false)=>{
        return http.post('/novel/addNovel',params,loading)
    },
    getNovelData: (params,loading=false)=> {
        return http.get('/novel/getNovelInfo',params,loading)
    },
}

export default {userApi, sysApi, novelApi}
