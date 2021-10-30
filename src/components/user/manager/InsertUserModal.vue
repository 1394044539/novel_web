<template>
    <div>
        <a-modal
                v-model:visible="showModal"
                :maskClosable="false"
                title="新增用户"
                :footer="null"
                @cancel="closeForm"
                width="600px"
        >
            <a-form :model="userFormData"
                    ref="userFormRef"
                    :rules="rules">
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="用户账号" name="accountName" :label-col="{span: 8}">
                            <a-input allowClear v-model:value="userFormData.accountName" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="用户名称" name="userName" :label-col="{span: 8}">
                            <a-input allowClear v-model:value="userFormData.userName" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="手机号" name="phone" :label-col="{span: 8}">
                            <a-input allowClear v-model:value="userFormData.phone" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="密码" name="password" :label-col="{span: 8}">
                            <a-input type="password" allowClear v-model:value="userFormData.password" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="角色" name="roleCode" :label-col="{span: 8}">
                            <a-select
                                    v-model:value="userFormData.roleCode"
                                    placeholder="请选择角色"
                            >
                                <a-select-option v-for="(item,index) in roleList" :value="item.roleCode">{{item.roleName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24" style="text-align: center">
                        <a-button type="primary" @click="submitUser">提交</a-button>
                        <a-button style="margin-left: 5px" @click="closeForm">取消</a-button>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import {ref,reactive,toRefs,onMounted,toRaw} from "vue";
    import api from '../../../api/api'
    import util from '../../../utils/util'

    export default {
        name: "InsertUserModal",
        props: {
            showModal: {
                type: Boolean,
                default: false,
            }
        },
        setup(props,content){
            const state = reactive({
                userFormData: {
                    accountName: '',
                    userName: '',
                    phone: '',
                    password: '',
                    roleCode: '',
                },
                roleList: [],
            })
            onMounted(()=>{
                getRoleList()
            })

            const getRoleList = () => {
                api.userApi.getAllRoleList({}).then(res=>{
                    state.roleList = res
                })
            }


            const userFormRef=ref()
            const rules ={
                accountName: [
                    {
                        required: true,
                        message: "请输入账号",
                    }
                ],
                userName: [
                    {
                        required: true,
                        message: "请输入用户名称",
                    }
                ],
                phone: [
                    {
                        required: true,
                        message: '请输入手机号',
                    },
                    {
                        pattern: "^1[3456789]\\d{9}$",
                        message: "手机号格式有误",
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "密码不能为空",
                    },
                    {
                        pattern: "^[a-zA-Z]\\S{5,18}$",
                        message: "密码必须是以字母开头的6-18位字符",
                    }
                ],
                roleCode: [
                    {
                        required: true,
                        message: '请选择用户角色'
                    }
                ]
            }

            // 添加用户
            const submitUser = () => {
                userFormRef.value.validate().then(()=>{
                    let param = {
                        ...toRaw(state.userFormData)
                    }
                    api.userApi.addUser(param).then(res=>{
                        util.success("添加成功")
                        content.emit('success')
                    })
                })
            }

            // 关闭弹窗
            const closeForm = () => {
                userFormRef.value.resetFields()
                content.emit('closeForm',false)
            }
            return{
                ...toRefs(state),
                closeForm,
                userFormRef,
                rules,
                submitUser,
            }
        }
    }
</script>

<style scoped>

</style>