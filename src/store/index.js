import { createStore } from 'vuex'

export default createStore({
  state: {
    authorization: localStorage.getItem("authorization"),
    userInfo: "",
    userRole: "",
    userName: ""
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
  getters: {

  }
})
