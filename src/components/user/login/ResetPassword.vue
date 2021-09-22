<template>
    <a-form
            name="custom-validation"
            ref="formRef"
            :model="forgetPwdForm"
            @finish="forgetPwd"
            :rules="forgetRules"
    >
        <a-form-item style="text-align: left" label="新密码：" name="newPassword">
            <a-input v-model:value="forgetPwdForm.newPassword" type="password" autocomplete="off"/>
        </a-form-item>
        <a-form-item style="text-align: left" label="确认密码" name="checkPassword">
            <a-input v-model:value="forgetPwdForm.checkPassword" type="password" autocomplete="off"/>
        </a-form-item>
        <a-form-item style="margin-top: -20px;">
            <div class="login-other">
                <a-button type="link" @click="callBackLogin(0)"><span
                        style="font-size: 12px;margin-left: 40px">账号登录</span></a-button>
                <a-button type="link" @click="callBackLogin(1)"><span style="font-size: 12px;">手机号登录</span></a-button>
            </div>
        </a-form-item>
        <a-form-item style="margin-bottom: 0">
            <a-button @click="formRef.resetFields()">重置</a-button>
            <a-button style="margin-left: 15px" type="primary" html-type="submit">确定</a-button>
        </a-form-item>
    </a-form>
</template>

<script>
    import {ref, reactive, toRaw} from 'vue'
    import router from "../../../router/index";
    import './less/login.less'
    import api from '../../../api/api'
    import util from '../../../utils/util'

    export default {
        name: "ResetPassword",
        props: {
            accountName: {
                type: String,
            }
        },
        setup(props, content) {
            //登录表单
            let formRef = ref()
            //忘记密码
            const forgetPwdForm = reactive({
                newPassword: "",
                checkPassword: ""
            })

            const forgetPwd = (value) => {
                const key = 'update'
                const hide = util.loading({
                    content: '请求中...',
                    key,
                });
                let param = {
                    accountName: props.accountName,
                    password: value.newPassword
                }
                api.userApi.updatePassword(param).then(res => {
                    util.success({
                        content: '修改成功，请登录!',
                        duration: 1,
                        key,
                    })
                    callBackLogin(0)
                }).catch(err=>{setTimeout(hide,0)})

            }

            //校验密码
            let checkPassword = async (rule, value) => {
                if (!value) {
                    return Promise.reject('请确认密码');
                }
                if (forgetPwdForm.newPassword !== value) {
                    return Promise.reject('两次输入密码不一致');
                } else {
                    return Promise.resolve();
                }
            };
            const forgetRules = {
                newPassword: [
                    {
                        required: true,
                        message: "密码不能为空",
                        trigger: 'change'
                    },
                    {
                        pattern: "^[a-zA-Z]\\S{5,18}$",
                        message: "密码必须是以字母开头的6-18位字符",
                        trigger: 'blur'
                    }
                ],
                checkPassword: [
                    {
                        required: true,
                        validator: checkPassword,
                        trigger: 'blur',
                    },
                ]
            }

            const callBackLogin = (value) => {
                formRef.value.resetFields()
                content.emit('switchType', value)
            }

            return {
                formRef,
                forgetPwdForm,
                forgetPwd,
                forgetRules,
                callBackLogin
            }

        }
    }
</script>

<style scoped>

</style>