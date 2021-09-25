<template>
    <a-form
            name="custom-validation"
            ref="formRef"
            :model="accountLoginForm"
            @finish="accountLogin"
            :rules="accountRules"
    >
        <a-form-item style="text-align: left" label="账号：" name="accountName">
            <a-input v-model:value="accountLoginForm.accountName" type="input" autocomplete="off" />
        </a-form-item>
        <a-form-item style="text-align: left" label="密码" name="password">
            <a-input v-model:value="accountLoginForm.password" type="password" autocomplete="off" />
        </a-form-item>
        <a-form-item style="margin-top: -20px;">
            <div class="login-other">
                <a-button type="link" @click="callBackLogin(2)"><span style="font-size: 12px;margin-left: 40px">忘记密码</span></a-button>
                <a-button type="link" @click="callBackLogin(1)"><span style="font-size: 12px;">手机号登录</span></a-button>
            </div>
        </a-form-item>
        <a-form-item style="margin-bottom: 0">
            <a-button @click="formRef.resetFields()" >重置</a-button>
            <a-button style="margin-left: 15px" type="primary" html-type="submit" :loading="loading">登录</a-button>
        </a-form-item>
    </a-form>
</template>

<script>
    import { ref,reactive,toRaw} from 'vue'
    import { useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    import api from '@/api/api'
    import './less/login.less'
    import util from '@/utils/util'

    export default {
        name: "AccountLogin",
        setup(props,content){
            //拿到路由和vuex
            const router = useRouter()
            const store = useStore()

            //登录表单
            let formRef = ref()
            let loading = ref(false)
            let accountLoginForm=reactive({
                accountName:'',
                password:'',
            })
            const accountRules = {
                accountName: [
                    {
                        required: true,
                        message: '账号不能为空',
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '密码不能为空'
                    }
                ]
            }
            //表单操作
            const accountLogin = (value) =>{
                const key = 'login'
                loading.value=true
                const hide = util.loading({
                    content: '登录中...',
                    key,
                });
                let param={
                    ...toRaw(value)
                }
                api.userApi.userLogin(param).then(res=>{
                    util.success({
                        content: '登录成功!',
                        duration: 1,
                        key,
                    })
                    loading.value=false
                    localStorage.setItem("authorization",res.token)
                    localStorage.setItem("userName",res.userName)
                    localStorage.setItem("accountName",res.accountName)
                    localStorage.setItem("roleList",JSON.stringify(res.roleList))
                    localStorage.setItem("permissionList",JSON.stringify(res.permissionList))
                    store.commit('setUserInfo',res)
                    router.push({name: 'MyNovel'})
                }).catch(err=>{
                    loading.value=false
                    setTimeout(hide,0)
                })
            }

            const callBackLogin=(value)=>{
                formRef.value.resetFields()
                content.emit('switchType',value)
            }
            return{
                formRef,
                accountLoginForm,
                accountLogin,
                accountRules,
                callBackLogin,
                loading
            }
        }
    }
</script>

<style scoped>

</style>