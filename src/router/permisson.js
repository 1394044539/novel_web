import router from "./index";

router.beforeEach(((to, from, next) => {
    // to.meta.requireAuth
    // if(to.matched.some(recode=>recode.meta.requireAuth)){
    if(true){
        let token = localStorage.getItem("authorization")
        if(token){
            next()
        }else {
            //登录
            next()
        }
    }else {
        //权限不足
        next()
    }
}))