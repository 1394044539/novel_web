<template>
    <div>
        <a-modal
                v-model:visible="showRoleModal"
                :maskClosable="false"
                :title="title"
                :footer="null"
                @cancel="closeForm"
                width="600px"
        >
            <a-form :model="roleFormData"
                    ref="roleFormRef"
                    :rules="rules">
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="角色编码" name="roleCode" :label-col="{span: 8}">
                            <a-input allowClear v-model:value="roleFormData.roleCode" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="角色名称" name="roleName" :label-col="{span: 8}">
                            <a-input allowClear v-model:value="roleFormData.roleName" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24">
                        <a-form-item label="角色描述" name="roleDesc" :label-col="{span: 4}">
                            <a-textarea
                                    showCount
                                    allowClear
                                    :maxlength=500
                                    :autoSize="{ minRows: 3, maxRows: 3 }"
                                    v-model:value="roleFormData.roleDesc"
                                    :rows="3"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24" style="text-align: center">
                        <a-button type="primary" @click="submitRole">提交</a-button>
                        <a-button style="margin-left: 5px" @click="closeForm">取消</a-button>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import {ref,reactive,toRefs,watch,toRaw} from "vue";
    import api from '../../../api/api'
    import util from "../../../utils/util";

    export default {
        name: "RoleModal",
        props: {
            showRoleModal: {
                type: Boolean,
                default: false,
            },
            roleData: {
                type: Object,
                default: {}
            },
            title: String,
            modalFlag: String,
        },
        setup(props,content){
            const state = reactive({
                roleFormData: {
                    roleCode: '',
                    roleName: '',
                    roleDesc: '',
                }
            })

            watch(()=>props.showRoleModal,(newV,oldV)=>{
                if(newV){
                    if(props.modalFlag==='editRole'){
                        state.roleFormData = {
                            ...props.roleData
                        }
                    }
                }
            })
            const rules = {
                roleCode:[
                    {
                        required: true,
                        pattern: '^[a-z,A-Z,_,0-9]{1,30}$',
                        message: '参数编码必须是1-30位字母数字加下划线组合'
                    }
                ],
                roleName:[
                    {
                        required: true,
                        message: '请输入角色名称'
                    }
                ]
            }
            const roleFormRef = ref()
            const submitRole = () => {
                roleFormRef.value.validate().then(()=>{
                    let param = {
                        ...toRaw(state.roleFormData)
                    }
                    if(props.modalFlag==='editRole'){
                        api.userApi.updateRole(param).then(res=>{
                            util.success("修改成功！")
                            content.emit('success')
                        })
                    }else if(props.modalFlag==='addRole'){
                        api.userApi.addRole(param).then(res=>{
                            util.success("添加成功！")
                            content.emit('success')
                        })
                    }
                })
            }
            const closeForm = () => {
                roleFormRef.value.resetFields()
                content.emit('closeForm',false)
            }

            return{
                ...toRefs(state),
                rules,
                roleFormRef,
                closeForm,
                submitRole
            }
        }
    }
</script>

<style scoped>

</style>