import { createStore } from 'vuex'

export default createStore({
  strict: false,
  state: {
    authorization: localStorage.getItem("authorization"),
    userInfo: localStorage.getItem("userInfo"),
    roleList: JSON.parse(localStorage.getItem("roleList")),
    userName: localStorage.getItem("userName")
  },
  mutations: {
    //设置用户信息
    setUserInfo(state,userInfo){
      debugger
      state.userInfo = userInfo
      state.roleList = userInfo.roleList
      state.userName = userInfo.userName
    },
    //重置用户信息
    clearStore(state){
      state.userInfo = localStorage.getItem("authorization")
      state.userInfo = localStorage.getItem("userInfo")
      state.roleList = JSON.parse(localStorage.getItem("roleList"))
      state.userName = localStorage.getItem("userName")
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    //判断当前用户是不是管理员
    isAdmin(state){
      return !!state.roleList.find(e=>e.roleCode === 'SUPER_ADMIN')
    }
  }
})
