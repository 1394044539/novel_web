<template>
    <div>
        <div style="margin-bottom: 10px;">
            <a-row>
                <a-col :span="12" style="text-align: left">
                    <a-button type="primary" @click="showInsertModal(true)">新增</a-button>
                    <a-button type="primary" danger style="margin-left: 5px" @click="disabledUser">禁用</a-button>
                </a-col>
            </a-row>
        </div>
        <a-table :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
                 :pagination="pagination" :columns="columns" :data-source="userInfoList">
            <template #photo="{ text,record,index }">
                <a-image
                        v-if="text"
                        :width="50"
                        :src="'/img/'+text"
                        :fallback="require('@/assets/img/photo.png')"
                />
                <div>-</div>
            </template>
            <template #userStatus="{text,record,index}">
                {{text==='0'?'正常':'禁用'}}
            </template>
            <template #action="{text,record,index}">
                <a-button size="small" type="primary">修改角色</a-button>
                <a-button style="margin-left: 5px" size="small" type="primary">分配空间</a-button>
            </template>
        </a-table>
        <InsertUserModal
            :showModal="showModal"
            @closeForm="showInsertModal"
            @success="insertSuccess"
        />
    </div>
</template>

<script>
    import {reactive,toRefs,onMounted} from "vue";
    import api from '../../../api/api'
    import InsertUserModal from "./InsertUserModal";

    export default {
        name: "UserInfoTab",
        components: {InsertUserModal},
        setup(props,content){
            const state = reactive({
                page: '1',
                pageSize: '10',
                userInfoList: [],
                selectedRowKeys: [],
                selectedRows: [],
                showModal: false,
            })
            // 初始化钩子
            onMounted(()=>{
                getUserInfoList()
            })
            const getUserInfoList=()=>{
                let param={
                    page: state.page,
                    pageSize: state.pageSize
                }
                api.userApi.getUserInfoList(param).then(res=>{
                    state.userInfoList=res.records
                })
            }

            // 表格
            const columns = [
                {
                    title: '用户账号',
                    dataIndex: 'accountName',
                    key: 'accountName',
                    align: 'center',
                },
                {
                    title: '用户名称',
                    dataIndex: 'userName',
                    key: 'userName',
                    align: 'center',
                },
                {
                    title: '头像',
                    dataIndex: 'photo',
                    key: 'photo',
                    align: 'center',
                    slots: { customRender: 'photo'}
                },
                {
                    title: '角色',
                    dataIndex: 'roleName',
                    key: 'roleName',
                    align: 'center',
                },
                {
                    title: '可用内存空间',
                    dataIndex: 'fullMemory',
                    key: 'fullMemory',
                    align: 'center',
                },
                {
                    title: '已用内存空间',
                    dataIndex: 'useMemory',
                    key: 'useMemory',
                    align: 'center',
                },
                {
                    title: '用户状态',
                    dataIndex: 'userStatus',
                    key: 'userStatus',
                    align: 'center',
                    slots: { customRender: 'userStatus'}
                },
                {
                    title: '注册时间',
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

            const disabledUser = () => {

            }

            const showInsertModal = (flag) => {
                state.showModal = flag
            }
            // 添加成功的回滚
            const insertSuccess = () => {
                showInsertModal(false)
                getUserInfoList()
            }

            return {
                ...toRefs(state),
                pagination,
                onSelectChange,
                columns,
                disabledUser,
                showInsertModal,
                insertSuccess
            }
        }
    }
</script>

<style scoped>

</style>