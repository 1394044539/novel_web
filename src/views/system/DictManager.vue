<template>
    <div>
        <div>
            <div style="margin-bottom: 10px">
                <a-row>
                    <a-col :span="12">
                        <a-button type="primary" @click="openInsertModal(true,'addDict','新增字典大类')">新增</a-button>
                        <a-button type="primary" style="margin-left: 5px">修改</a-button>
                        <a-button style="margin-left: 5px">删除</a-button>
                    </a-col>
                </a-row>
            </div>
            <a-table :row-selection="rowSelection" :pagination="pagination" :columns="columns" :data-source="data">
                <template #dictType="{ text,record,index}">
                    <div v-if="text!=='2'">{{text==='0'?'字符串':text==='1'?'开关':'集合'}}</div>
                    <a href="javascript:" @click="showDictParamTableForm(true,record.dictId)" v-if="text==='2'">集合</a>
                </template>
                <template #dictValue="{ text,record,index}">
                    <div>{{record.dictType!=='1'?text:text==='1'?'开':'关'}}</div>
                </template>
            </a-table>
            <DictModal
                    :showModal="showModal"
                    :modalFlag="modelFlag"
                    :title="title"
                    @closeForm="openInsertModal"
                    @success="success"
            />
            <DictParamTable
                :showParamTable="showParamTable"
                :dictId="dictId"
                @closeForm="showDictParamTableForm"
            />
        </div>
    </div>
</template>

<script>
    import {onMounted, reactive, toRefs} from "vue";
    import api from '../../api/api'
    import DictModal from "../../components/dict/DictModal";
    import DictParamTable from "../../components/dict/DictParamTable";

    export default {
        name: "DictManager",
        components: {DictParamTable, DictModal},
        setup(props,content){
            const state=reactive({
                data: [],
                page: 1,
                pageSize: 10,
                showModal: false,
                modelFlag: '',
                title: '',
                showParamTable: false,
                dictId: '',
                selectedRowKeys: [],
                selectedRows: [],
            })

            // 初始化钩子
            onMounted(()=>{
                getDictList();
            })
            const getDictList = () => {
                let param={
                    page: state.page,
                    pageSize: state.pageSize,
                }
                api.sysApi.getDictList(param).then(res=>{
                    state.data=res.records
                })
            }
            const columns = [
                {
                    title: '字典编码',
                    dataIndex: 'dictCode',
                    key: 'dictCode',
                    width: 180,
                    align: 'center',
                },
                {
                    title: '字典名称',
                    dataIndex: 'dictName',
                    key: 'dictName',
                    width: 180,
                    align: 'center',
                },
                {
                    title: '字典值',
                    dataIndex: 'dictValue',
                    key: 'dictValue',
                    width: 180,
                    align: 'center',
                    slots:{
                        customRender: 'dictValue'
                    }
                },
                {
                    title: '字典类型',
                    dataIndex: 'dictType',
                    key: 'dictType',
                    width: 120,
                    align: 'center',
                    slots:{
                        customRender: 'dictType'
                    }
                },
                {
                    title: '字典描述',
                    dataIndex: 'dictDesc',
                    key: 'dictDesc',
                    align: 'center',
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
            // 子项字典选择框
            const rowSelection={
                onChange:(selectedRowKeys,selectedRows) => {
                    state.selectedRowKeys = selectedRowKeys
                    state.selectedRows = selectedRows
                }
            }

            const openInsertModal = (flag,modalFlag='',title='') =>{
                state.showModal=flag
                state.modelFlag=modalFlag
                state.title = title
            }
            const success = () => {
                openInsertModal(false)
                getDictList()
            }

            const showDictParamTableForm = (flag,dictId='') => {
                state.showParamTable=flag;
                state.dictId=dictId;

            }
            return {
                ...toRefs(state),
                pagination,
                columns,
                openInsertModal,
                success,
                showDictParamTableForm,
                rowSelection,
            }
        }
    }
</script>

<style scoped>

</style>