<template>
    <div>
        <div style="margin-bottom: 10px;">
            <a-row>
                <a-col :span="12" style="text-align: left">
                    <a-button type="primary" @click="showActionRoleModal(true,'addRole','新增角色')">新增</a-button>
                    <a-button style="margin-left: 5px" type="primary" @click="updateRoleModal">修改</a-button>
                    <a-button style="margin-left: 5px">删除</a-button>
                </a-col>
            </a-row>
        </div>
        <a-table :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
                 :pagination="pagination" :columns="columns" :data-source="roleListData">
            <template #action="{ text,record,index}">
                <a-button size="small" type="primary" @click="showRoleUser(true,record.roleId,record.roleName)">查看用户</a-button>
                <a-button style="margin-left: 5px" size="small" type="primary">权限管理</a-button>
            </template>
        </a-table>
        <RoleModal
            :modalFlag="modalFlag"
            :roleData="roleData"
            :showRoleModal="showRoleModal"
            :title="roleTile"
            @closeForm="showActionRoleModal"
            @success="actionSuccess"
        />
        <RoleUserTable
            :showRoleUserTable='showRoleUserTable'
            :roleId='roleId'
            :title="userTableTitle"
            @closeForm="showRoleUser(false)"
        />
    </div>
</template>

<script>
    import {reactive,toRefs,onMounted} from "vue";
    import api from '../../../api/api'
    import RoleModal from "./RoleModal";
    import util from "../../../utils/util";
    import RoleUserTable from "./RoleUserTable";

    export default {
        name: "RoleManagerTab",
        components: {RoleUserTable, RoleModal},
        setup(props,content){
            const state = reactive({
                page: '1',
                pageSize: '10',
                roleListData: [],
                selectedRowKeys: [],
                selectedRows: [],
                showRoleModal: false,
                modalFlag: '',
                roleTile: '',
                roleData: {},
                showRoleUserTable: false,
                roleId: '',
                userTableTitle: ''
            })

            onMounted(()=>{
                getRoleList()
            })

            const getRoleList = () =>{
                let param = {
                    page: state.page,
                    pageSize: state.pageSize,
                }
                api.userApi.getRoleList(param).then(res=>{
                    state.roleListData=res.records
                    state.selectedRowKeys= []
                    state.selectedRows= []
                })
            }

            // 表格
            const columns = [
                {
                    title: '角色编码',
                    dataIndex: 'roleCode',
                    key: 'roleCode',
                    align: 'center',
                },
                {
                    title: '角色名称',
                    dataIndex: 'roleName',
                    key: 'roleName',
                    align: 'center',
                },
                {
                    title: '角色描述',
                    dataIndex: 'roleDesc',
                    key: 'roleDesc',
                    align: 'center',
                },
                {
                    title: '角色权限',
                    dataIndex: 'rolePermission',
                    key: 'rolePermission',
                    align: 'center',
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    align: 'center',
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 200,
                    slots: {
                        customRender: 'action',
                    },
                }
            ]
            const pagination = {
                current: state.page,
                pageSize: state.pageSize,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],//每页中显示的数据
                showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                onShowSizeChange: (current, pageSize) => {}, // 改变每页数量时更新显示
                onChange:(page,pageSize)=> {
                },//点击页码事件
            }
            // 多选框
            const onSelectChange = (selectedRowKeys,selectedRows) => {
                state.selectedRowKeys = selectedRowKeys
                state.selectedRows = selectedRows
            }

            const updateRoleModal = () => {
                if(state.selectedRowKeys.length!==1){
                    util.info("请选择一个角色")
                }else {
                    state.roleData = state.selectedRows[0]
                    showActionRoleModal(true,'editRole','修改角色')
                }
            }

            // 打开或关闭弹窗
            const showActionRoleModal = (flag,modalFlag='',title='') => {
                state.showRoleModal=flag
                state.modalFlag=modalFlag
                state.roleTile=title
            }

            // 成功的回调函数
            const actionSuccess = () => {
                showActionRoleModal(false)
                getRoleList()
            }

            const showRoleUser = (flag,roleId='',roleName='') => {
                state.showRoleUserTable = flag
                state.userTableTitle = roleName
                state.roleId= roleId
            }

            return{
                ...toRefs(state),
                columns,
                pagination,
                onSelectChange,
                showActionRoleModal,
                updateRoleModal,
                actionSuccess,
                showRoleUser
            }
        }
    }
</script>

<style scoped>

</style>