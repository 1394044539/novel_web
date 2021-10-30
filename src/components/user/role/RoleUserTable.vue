<template>
    <div>
        <a-modal
                v-model:visible="showRoleUserTable"
                :title="title+'用户列表'"
                :footer="null"
                @cancel="closeForm"
                width="600px"
        >
            <a-table size="small"
                     :pagination="false"
                     :data-source="userListData"
                     :columns="columns"
                     :scroll="{y: 500}"
                     bordered>
            </a-table>
        </a-modal>
    </div>
</template>

<script>
    import {reactive,toRefs,watch} from 'vue'
    import api from '../../../api/api'

    export default {
        name: "RoleUserTable",
        props: {
            showRoleUserTable: {
                type: Boolean,
                default: false,
            },
            roleId: {
                type: String,
                default: '',
            },
            title: {
                type: String,
                default: '用户列表'
            }
        },
        setup(props,content){
            const state = reactive({
                userListData: []
            })

            watch(()=>props.showRoleUserTable,(newV,oldV)=>{
                if(newV){
                    api.userApi.geyRoleInfo({roleId:props.roleId}).then(res=>{
                        state.userListData=res.userList
                    })
                }
            })

            const columns = [
                {
                    title: '用户账号',
                    dataIndex: 'accountName',
                    key: 'accountName',
                    align: 'center'
                },
                {
                    title: '用户姓名',
                    dataIndex: 'accountName',
                    key: 'accountName',
                    align: 'center'
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    align: 'center'
                },

            ]
            const closeForm = () => {
                content.emit('closeForm',false)
            }


            return {
                ...toRefs(state),
                closeForm,
                columns
            }
        }
    }
</script>

<style scoped>

</style>