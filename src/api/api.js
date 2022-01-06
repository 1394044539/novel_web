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
    disableUser: (params,loading=false)=>{
        return http.post('/sysUser/disableUser',params,loading)
    },
    updateUser: (params,loading=false)=>{
        return http.put('/sysUser/updateUser',params,loading)
    },
    getApplyRegisterList: (params,loading=false)=>{
        return http.post('/sysRegister/getApplyRegisterList',params,loading)
    },
    createRegInfo: (params,loading=false)=>{
        return http.post('/sysRegister/createRegInfo',params,loading)
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
    updateNovel: (params,loading=false)=>{
        return http.put('/novel/updateNovel',params,loading)
    },
    getNovelData: (params,loading=false)=> {
        return http.get('/novel/getNovelInfo',params,loading)
    },
    deleteNovel: (params,loading=false)=> {
        return http.Delete('/novel/deleteNovel',params,loading)
    },
    batchUploadVolume: (params,loading=false)=> {
        return http.post('/novelVolume/batchUploadVolume',params,loading)
    },
    getVolumeInfo: (params,loading=false)=> {
        return http.get('/novelVolume/getVolumeInfo',params,loading)
    },
    getVolumeList: (params,loading=false)=> {
        return http.get('/novelVolume/getVolumeList',params,loading)
    },
    getChapterContent: (params,loading=false)=> {
        return http.get('/novelChapter/getChapterContent',params,loading)
    },
    updateOrder: (params,loading=false)=> {
        return http.put('/novelVolume/updateOrder',params,loading)
    },
    deleteVolume: (params,loading=false)=> {
        return http.Delete('/novelVolume/deleteVolume',params,loading)
    },
    addVolume: (params,loading=false)=> {
        return http.put('/novelVolume/addVolume',params,loading)
    },
    updateVolume: (params,loading=false)=> {
        return http.post('/novelVolume/updateVolume',params,loading)
    },
    addCollection: (params,loading=false)=> {
        return http.put('/userCollection/addCollection',params,loading)
    },
    updateCollection: (params,loading=false)=> {
        return http.post('/userCollection/updateCollection',params,loading)
    },
    getCollection: (params,loading=false)=> {
        return http.get('/userCollection/getCollection',params,loading)
    },
    deleteCollection: (params,loading=false)=> {
        return http.Delete('/userCollection/deleteCollection',params,loading)
    },
    getCollectionList: (params,loading=false)=> {
        return http.post('/userCollection/getCollectionList',params,loading)
    },
    getHistoryList: (params,loading=false)=> {
        return http.post('/novelHistory/getHistoryList',params,loading)
    },
    copyOrMove: (params,loading=false)=> {
        return http.post('/userCollection/copyOrMove',params,loading)
    },
    download: (params)=> {
        return http.downloadFile('/userCollection/download',params)
    },
}

export default {userApi, sysApi, novelApi}
