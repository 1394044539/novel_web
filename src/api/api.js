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
    addFeedback: (params,loading=false)=>{
        return http.post('/feedback/insert',params,loading)
    },
    getOpenNotice: ()=>{
        return http.get('/sysNotice/openNotice')
    }
}

const novelApi = {
    getSeriesList: (params, loading = false) => {
        return http.post('/series/getSeriesList', params, loading)
    },
    quickUpload: (params,loading=false) =>{
        return http.post('/series/quickUpload',params,loading)
    },
    createSeries: (params,loading=false)=>{
        return http.post('/series/addSeries',params,loading)
    },
    updateSeries: (params,loading=false)=>{
        return http.put('/series/updateSeries',params,loading)
    },
    getSeriesData: (params,loading=false)=> {
        return http.get('/series/getSeriesInfo',params,loading)
    },
    deleteSeries: (params,loading=false)=> {
        return http.Delete('/series/deleteSeries',params,loading)
    },
    batchUploadNovel: (params,loading=false)=> {
        return http.post('/novel/batchUploadNovel',params,loading)
    },
    getNovelInfo: (params,loading=false)=> {
        return http.get('/novel/getNovelInfo',params,loading)
    },
    getNovelList: (params,loading=false)=> {
        return http.get('/novel/getNovelList',params,loading)
    },
    getChapterContent: (params,loading=false)=> {
        return http.get('/novelChapter/getChapterContent',params,loading)
    },
    updateOrder: (params,loading=false)=> {
        return http.put('/novel/updateOrder',params,loading)
    },
    deleteNovel: (params,loading=false)=> {
        return http.Delete('/novel/deleteNovel',params,loading)
    },
    addNovel: (params,loading=false)=> {
        return http.put('/novel/addNovel',params,loading)
    },
    updateNovel: (params,loading=false)=> {
        return http.post('/novel/updateNovel',params,loading)
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
    batchCancelCollection: (params,loading=false)=> {
        return http.Delete('/userCollection/batchCancelCollection',params,loading)
    },
    removeAll:(params,loading=false)=> {
        return http.Delete('/userCollection/removeAll',params,loading)
    },
    getCollectionList: (params,loading=false)=> {
        return http.post('/userCollection/getCollectionList',params,loading)
    },
    getCollectionListPage: (params,loading=false)=> {
        return http.post('/userCollection/list',params,loading)
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
