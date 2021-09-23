<template>
    <div class="novel-login">
        <a-modal
                :visible=true
                :title="title"
                :closable=false
                width="400px"
                style="text-align: center;">
            <!-- 账号登录表单 -->
            <AccountLogin v-if="loginType===0" @switchType="switchType"/>
            <!-- 手机号登录或者是找回密码表单 -->
            <PhoneLogin v-if="loginType===1||loginType===2" :loginType="loginType"  @switchType="switchType"/>
            <!-- 重新输入密码的界面 -->
            <ResetPassword v-if="loginType===3" :accountName="accountName" @switchType="switchType"/>
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
            v-model:visible="registerModelStatus"
            title="注册"
            width="400px"
            style="text-align: center"
            :after-close="()=>registerRef.resetFields()"
        >
            <p>该平台暂提供给内部使用，注册请填写信息申请</p>
            <a-form
                :model="registerForm"
                ref="registerRef"
                :rules="registerRules"
            >
                <a-form-item style="text-align: left" label="手机号：" name="phone">
                    <a-input v-model:value="registerForm.phone" type="input" autocomplete="off"/>
                </a-form-item>
                <a-form-item style="text-align: left" label="申请描述：" name="registerMessage">
                    <a-textarea showCount :maxlength="200" :rows="5" placeholder="说说为什么要申请" v-model:value="registerForm.registerMessage" autocomplete="off"/>
                </a-form-item>
            </a-form>
            <template #footer>
                <div style="text-align: center">
                    <a-button @click="()=>registerModelStatus=false">取消</a-button>
                    <a-button style="margin-left: 15px" type="primary" @click="applyRegister">申请</a-button>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script>
    import util from "../../utils/util"
    import { QqOutlined,WechatOutlined } from '@ant-design/icons-vue'
    import { ref,reactive, watch } from 'vue'
    import AccountLogin from '@/components/user/login/AccountLogin'
    import PhoneLogin from '@/components/user/login/PhoneLogin'
    import ResetPassword from '@/components/user/login/ResetPassword'

    export default {
        name: "Login",
        components:{
            QqOutlined,
            WechatOutlined,
            AccountLogin,
            PhoneLogin,
            ResetPassword
        },
        setup(){
            //模块标题
            let title=ref("登录模块")
            let loginType=ref(0)
            let accountName=ref("")
            //footer部分
            let registerModelStatus = ref(false)
            //监听loginType的变化
            watch(loginType,(newV,oldV)=>{
                if(newV===2){
                    title.value="通过手机号找回密码"
                }else if(newV===1||newV===0){
                    title.value="登录界面"
                }else if(newV===3){
                    title.value="重置密码"
                }
            })

            //切换登录状态
            const switchType = (data,value) =>{
                loginType.value=data
                if(value){
                    accountName.value=value
                }
            }

            //申请注册模块
            const registerRef=ref()
            let registerForm = reactive({
                phone:'',
                registerMessage:''
            })

            let registerRules ={
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
                ]
            }
            //提交表单
            const applyRegister = () =>{
                registerRef.value.validate().then(res=>{
                    //开始校验逻辑
                    registerModelStatus.value=false
                }).catch(err=>{
                    console.log(err)
                })
            }


            return{
                title,
                loginType,
                registerModelStatus,
                switchType,
                accountName,
                registerForm,
                registerRef,
                applyRegister,
                registerRules
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