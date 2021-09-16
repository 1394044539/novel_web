<template>
    <div class="novel-login">
        <a-modal
                :visible=true
                title="登录系统"
                :footer="null"
                :closable=false
                @ok="handleOk"
                width="500px"
                style="text-align: center">
            <a-form
                    name="custom-validation"
                    ref="formRef"
                    :model="loginForm"
                    @finish="handleFinish"
                    :rules="rules"
            >
                <a-form-item style="text-align: left" label="账号：" name="accountName">
                    <a-input v-model:value="loginForm.accountName" type="input" autocomplete="off" />
                </a-form-item>
                <a-form-item style="text-align: left" label="密码" name="password">
                    <a-input v-model:value="loginForm.password" type="password" autocomplete="off" />
                </a-form-item>
                <a-form-item>

                    <a-button @click="resetForm">注册</a-button>
                    <a-button style="margin-left: 10px" type="primary" html-type="submit">登录</a-button>
                </a-form-item>
            </a-form>
        </a-modal>

    </div>
</template>

<script>
    import api from '../../api/api'
    import router from "../../router";
    import util from "../../utils/util"
    import { Modal } from 'ant-design-vue'
    import { ref, reactive,toRaw } from 'vue'

    export default {
        name: "Login",
        setup(){
            let formRef = ref()
            let loginForm=reactive({
                accountName:'',
                password:'',
            })
            const handleFinish = (value) =>{
                let param={
                    ...toRaw(value)
                }
                api.userApi.userLogin(param).then(res=>{
                    router.push({name: 'main'})
                })
            }
            const rules = {
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
            const resetForm = () =>{
                formRef.value.resetFields();
            }

            //

            const handleOk = e => {

            };

            return{
                loginForm,
                handleFinish,
                rules,
                formRef,
                resetForm,
                handleOk
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
</style>