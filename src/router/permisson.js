import router from "./index";

router.beforeEach(((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    let token = localStorage.getItem("authorization")
    if(!token&&to.path!=='/login'){
        //如果未登录，且当前界面不是登录界面，跳转到登录界面，其他情况放开
        next('/login')
    }else if(token&&to.path==='/login'){
        //已登录的不让他进入登录界面了
        // next('/main')
        next()
    }else {
        //权限不足
        next()
    }
}))