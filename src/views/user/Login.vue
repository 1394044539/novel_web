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
    import util from "../../utils/util"
    import { QqOutlined,WechatOutlined } from '@ant-design/icons-vue'
    import { ref, watch } from 'vue'
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
                debugger
                loginType.value=data
                if(value){
                    accountName.value=value
                }
            }


            return{
                title,
                loginType,
                registerModelStatus,
                switchType,
                accountName
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