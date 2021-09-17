<template>
    <div class="novel-login">
        <a-modal
                :visible=true
                :title="title"
                :closable=false
                width="400px"
                style="text-align: center;">
            <a-form
                    v-if="loginType===0"
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
                        <a-button type="link" @click="loginType=2"><span style="font-size: 12px;margin-left: 40px">忘记密码</span></a-button>
                        <a-button type="link" @click="loginType=1"><span style="font-size: 12px;">手机号登录</span></a-button>
                    </div>
                </a-form-item>
                <a-form-item style="margin-bottom: 0">
                    <a-button @click="resetForm" >重置</a-button>
                    <a-button style="margin-left: 15px" type="primary" html-type="submit">登录</a-button>
                </a-form-item>
            </a-form>
            <a-form
                    v-if="loginType===1"
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
                    <div class="login-other">
                        <a-button type="link" @click="loginType=2"><span style="font-size: 12px;margin-left: 40px">忘记密码</span></a-button>
                        <a-button type="link" @click="loginType=0"><span style="font-size: 12px;">账号登录</span></a-button>
                    </div>
                </a-form-item>
                <a-form-item style="margin-bottom: 0">
                    <a-button @click="resetForm" >重置</a-button>
                    <a-button style="margin-left: 15px" type="primary" html-type="submit">登录</a-button>
                </a-form-item>
            </a-form>
            <a-form
                    v-if="loginType===2"
                    name="custom-validation"
                    ref="formRef"
                    :model="forgetPwdForm"
                    @finish="forgetPwd"
                    :rules="forgetRules"
            >
                <a-form-item style="text-align: left" label="账号：" name="accountName">
                    <a-input v-model:value="forgetPwdForm.accountName" type="input" autocomplete="off" />
                </a-form-item>
                <a-form-item style="text-align: left" label="密码" name="password">
                    <a-input v-model:value="forgetPwdForm.password" type="password" autocomplete="off" />
                </a-form-item>
                <a-form-item style="margin-top: -20px;">
                    <div class="login-other">
                        <a-button type="link" @click="loginType=0"><span style="font-size: 12px;margin-left: 40px">账号登录</span></a-button>
                        <a-button type="link" @click="loginType=1"><span style="font-size: 12px;">手机号登录</span></a-button>
                    </div>
                </a-form-item>
                <a-form-item style="margin-bottom: 0">
                    <a-button @click="resetForm" >重置</a-button>
                    <a-button style="margin-left: 15px" type="primary" html-type="submit">确定</a-button>
                </a-form-item>
            </a-form>
            <template #footer>
                <div class="login-footer">
                    <div>
                        <a style="color: #1890ff;font-size: 12px" @click="registerModelStatus=true">我要注册</a>
                    </div>
                    <div>
                        <QqOutlined />
                        <WechatOutlined style="margin-left: 5px"/>
                    </div>
                </div>
            </template>
        </a-modal>
        <a-modal
            :visible="registerModelStatus"
            title="注册"
            width="300px"
            style="text-align: center"
        >
        <p>暂时供内部使用，注册请联系开发人员</p>
        <template #footer>
            <div style="text-align: center">
                <a-button type="primary" @click="registerModelStatus=false">确定</a-button>
            </div>
        </template>
        </a-modal>
    </div>
</template>

<script>
    import api from '../../api/api'
    import router from "../../router";
    import util from "../../utils/util"
    import { QqOutlined,WechatOutlined } from '@ant-design/icons-vue';
    import { ref, reactive,toRaw } from 'vue'

    export default {
        name: "Login",
        components:{
            QqOutlined,
            WechatOutlined
        },
        setup(){
            //模块标题
            let title=ref("登录模块")
            let loginType=ref(0)
            //footer部分
            let registerModelStatus = ref(false)
            //登录表单
            let formRef = ref()
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
                let param={
                    ...toRaw(value)
                }
                api.userApi.userLogin(param).then(res=>{
                    router.push({name: 'main'})
                })
            }
            const resetForm = () =>{
                formRef.value.resetFields();
            }
            //手机号登录
            let phoneLoginForm= reactive({
                phone:"",
                vcode:"",
            })
            const phoneLogin = (value) =>{
                let param={
                    ...toRaw(value)
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
            const getVcode = () =>{
                if(!phoneLoginForm.phone){
                    util.warning("请输入手机号")
                }else {
                    vcodeBtnStatus.value=true
                    let internal = setInterval(()=>{
                        vcodeBtnMsg.value="重新发送"+timer
                        timer--
                        if(timer===0){
                            clearInterval(internal)
                            vcodeBtnStatus.value=false
                            vcodeBtnMsg.value="获取验证码"
                            timer=60
                        }
                    },1000)
                }
            }

            //忘记密码
            const forgetPwdForm = reactive({

            })

            const forgetPwd = () =>{

            }

            const forgetRules ={

            }


            return{
                title,
                loginType,
                formRef,
                resetForm,
                registerModelStatus,
                accountLoginForm,
                accountLogin,
                accountRules,
                phoneLoginForm,
                phoneLogin,
                phoneRules,
                getVcode,
                vcodeBtnMsg,
                vcodeBtnStatus,
                forgetPwdForm,
                forgetPwd,
                forgetRules
            }
        }
    }
</script>

<style scoped>
    .novel-login{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }

    .login-other{
        display: flex;justify-content:space-between;
    }

    .login-footer{
        display: flex;
        justify-content: space-between;
    }
</style>