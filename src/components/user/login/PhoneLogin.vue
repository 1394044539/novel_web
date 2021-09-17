<template>
    <a-form
            name="custom-validation"
            ref="formRef"
            :model="phoneLoginForm"
            @finish="phoneLogin"
            :rules="phoneRules"
    >
        <a-form-item style="text-align: left" label="手机号：" name="phone">
            <a-input v-model:value="phoneLoginForm.phone" type="input" autocomplete="off" />
        </a-form-item>
        <a-form-item style="text-align: left" label="验证码" name="vcode">
            <div style="display: flex;justify-content: space-between">
                <a-input v-model:value="phoneLoginForm.vcode" type="input" autocomplete="off" />
                <a-button style="margin-left: 10px" :disabled="vcodeBtnStatus" @click="getVcode" >{{vcodeBtnMsg}}</a-button>
            </div>
        </a-form-item>
        <a-form-item style="margin-top: -20px;">
            <div v-if="loginType===1" class="login-other">
                <a-button type="link" @click="callBackLogin(2)"><span style="font-size: 12px;margin-left: 40px">忘记密码</span></a-button>
                <a-button type="link" @click="callBackLogin(0)"><span style="font-size: 12px;">账号登录</span></a-button>
            </div>
            <div v-if="loginType===2" class="login-other">
                <a-button type="link" @click="callBackLogin(1)"><span style="font-size: 12px;margin-left: 40px">手机号登录</span></a-button>
                <a-button type="link" @click="callBackLogin(0)"><span style="font-size: 12px;">账号登录</span></a-button>
            </div>
        </a-form-item>
        <a-form-item style="margin-bottom: 0">
            <a-button @click="formRef.resetFields()" >重置</a-button>
            <a-button style="margin-left: 15px" type="primary" html-type="submit">{{loginType===1?'登录':'确定'}}</a-button>
        </a-form-item>
    </a-form>
</template>

<script>
    import { ref,reactive,toRaw} from 'vue'
    import './less/login.less'

    export default {
        name: "PhoneLogin",
        props:{
            loginType:{
                type: Number,
                default: 1
            }
        },
        setup(props,content){
            //登录表单
            let formRef = ref()
            //手机号登录
            let phoneLoginForm= reactive({
                phone:"",
                vcode:"",
            })
            const phoneLogin = (value) =>{
                let param={
                    ...toRaw(value)
                }
                if(props.loginType===2){
                    callBackLogin(3)
                }
            }
            const phoneRules = {
                phone:[
                    {
                        required: true,
                        message: '请输入手机号'
                    }
                ],
                vcode:[
                    {
                        required: true,
                        message: '验证码不能为空'
                    }
                ]
            }
            let vcodeBtnMsg = ref("获取验证码")
            let vcodeBtnStatus = ref(false)
            let timer=60
            let internal
            const getVcode = () =>{
                if(!phoneLoginForm.phone){
                    util.warning("请输入手机号")
                }else {
                    vcodeBtnStatus.value=true
                    vcodeBtnMsg.value="重新发送"+timer
                    internal = setInterval(()=>{
                        if(timer<=0){
                            recoveryCode()
                        }else {
                            timer--
                            vcodeBtnMsg.value="重新发送"+timer
                        }
                    },1000)
                }
            }
            //恢复验证码
            const recoveryCode = () =>{
                clearInterval(internal)
                vcodeBtnStatus.value=false
                vcodeBtnMsg.value="获取验证码"
                timer=60
            }

            //回调父组件
            const callBackLogin = (value)=>{
                formRef.value.resetFields()
                recoveryCode()
                content.emit('switchType',value)
            }

            return{
                formRef,
                phoneLogin,
                phoneLoginForm,
                phoneRules,
                getVcode,
                vcodeBtnMsg,
                vcodeBtnStatus,
                callBackLogin
            }
        }
    }
</script>

<style scoped>

</style>