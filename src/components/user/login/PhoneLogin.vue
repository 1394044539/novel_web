<template>
    <a-form
            name="custom-validation"
            ref="formRef"
            :model="phoneLoginForm"
            @finish="phoneLogin"
            :rules="phoneRules"
    >
        <a-form-item style="text-align: left" label="手机号：" name="phone">
            <a-input v-model:value="phoneLoginForm.phone" type="input" autocomplete="off"/>
        </a-form-item>
        <a-form-item style="text-align: left" label="验证码" name="verifyCode">
            <div style="display: flex;justify-content: space-between">
                <a-input v-model:value="phoneLoginForm.verifyCode" type="input" autocomplete="off"/>
                <a-button style="margin-left: 10px" :disabled="vcodeBtnStatus" @click="getVcode">{{vcodeBtnMsg}}
                </a-button>
            </div>
        </a-form-item>
        <a-form-item style="margin-top: -20px;">
            <div v-if="loginType===1" class="login-other">
                <a-button type="link" @click="callBackLogin(2)"><span
                        style="font-size: 12px;margin-left: 40px">忘记密码</span></a-button>
                <a-button type="link" @click="callBackLogin(0)"><span style="font-size: 12px;">账号登录</span></a-button>
            </div>
            <div v-if="loginType===2" class="login-other">
                <a-button type="link" @click="callBackLogin(1)"><span
                        style="font-size: 12px;margin-left: 40px">手机号登录</span></a-button>
                <a-button type="link" @click="callBackLogin(0)"><span style="font-size: 12px;">账号登录</span></a-button>
            </div>
        </a-form-item>
        <a-form-item style="margin-bottom: 0">
            <a-button @click="formRef.resetFields()">重置</a-button>
            <a-button style="margin-left: 15px" type="primary" :loading="loading" html-type="submit">
                {{loginType===1?'登录':'确定'}}
            </a-button>
        </a-form-item>
    </a-form>
</template>

<script>
    import {ref, reactive, toRaw} from 'vue'
    import './less/login.less'
    import util from '../../../utils/util'
    import api from '../../../api/api'
    import router from "../../../router";

    export default {
        name: "PhoneLogin",
        props: {
            loginType: {
                type: Number,
                default: 1
            }
        },
        setup(props, content) {
            //登录表单
            let formRef = ref()
            let loading = ref(false)
            //手机号登录
            let phoneLoginForm = reactive({
                phone: "",
                verifyCode: "",
            })
            const phoneLogin = (value) => {
                if (props.loginType === 1) {
                    //登录界面
                    const key = 'login'
                    loading.value = true
                    const hide = util.loading({
                        content: '登录中...',
                        key,
                    });
                    let param = {
                        ...toRaw(value)
                    }
                    api.userApi.userLoginByPhone(param).then(res => {
                        util.success({
                            content: '登录成功!',
                            duration: 1,
                            key,
                        })
                        loading.value = false
                        localStorage.setItem("authorization", res.token)
                        localStorage.setItem("userName", res.userName)
                        localStorage.setItem("accountName", res.accountName)
                        localStorage.setItem("roleList", JSON.stringify(res.roleList))
                        localStorage.setItem("permissionList", JSON.stringify(res.permissionList))
                        router.push({name: 'Main'})
                    }).catch(err => {
                        loading.value = false
                        setTimeout(hide, 0)
                    })
                } else if (props.loginType === 2) {
                    //找回密码界面
                    let param = {
                        ...toRaw(value)
                    }
                    api.userApi.checkPhone(param).then(res => {
                        util.success("校验成功！")
                        callBackLogin(3,res.accountName)
                    })

                }
            }


            const phoneRules = {
                phone: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'change'
                    },
                    {
                        pattern: "^1[3456789]\\d{9}$",
                        message: "手机号格式有误",
                        trigger: 'blur'
                    }
                ],
                verifyCode: [
                    {
                        required: true,
                        message: '验证码不能为空'
                    }
                ]
            }
            let vcodeBtnMsg = ref("获取验证码")
            let vcodeBtnStatus = ref(false)
            let timer = 60
            let internal
            const getVcode = () => {
                const key="getCode"
                if (!phoneLoginForm.phone) {
                    util.warning("请输入手机号")
                } else {
                    const hide = util.loading({
                        content: '发送中...',
                        key,
                    });
                    vcodeBtnStatus.value = true
                    vcodeBtnMsg.value = "重新发送" + timer
                    internal = setInterval(() => {
                        if (timer <= 0) {
                            recoveryCode()
                        } else {
                            timer--
                            vcodeBtnMsg.value = "重新发送" + timer
                        }
                    }, 1000)
                    let param = {
                        phone: phoneLoginForm.phone
                    }
                    api.userApi.getVcode(param).then(res => {
                        util.success({
                            content: '发送成功!',
                            duration: 1,
                            key,
                        })
                    }).catch(err=>{
                        setTimeout(hide,0)
                    })
                }
            }
            //恢复验证码
            const recoveryCode = () => {
                clearInterval(internal)
                vcodeBtnStatus.value = false
                vcodeBtnMsg.value = "获取验证码"
                timer = 60
            }

            //回调父组件
            const callBackLogin = (value,accountName) => {
                formRef.value.resetFields()
                recoveryCode()
                content.emit('switchType', value,accountName)
            }

            return {
                formRef,
                phoneLogin,
                phoneLoginForm,
                phoneRules,
                getVcode,
                vcodeBtnMsg,
                vcodeBtnStatus,
                callBackLogin,
                loading
            }
        }
    }
</script>

<style scoped>

</style>