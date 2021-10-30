<template>
    <div style="margin-top: 24px">
        <div>
        </div>
        <div>
            <div style="margin-bottom: 10px">
                <a-row>
                    <a-col :span="12">
                        <a-button type="primary" @click="openInsertModal(true,'addDict','新增字典大类')">新增</a-button>
                        <a-button type="primary" style="margin-left: 5px" @click="updateDict">修改</a-button>
                        <a-button style="margin-left: 5px" @click="deleteDict">删除</a-button>
                    </a-col>
                </a-row>
            </div>
            <a-table :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
                     :pagination="pagination" :columns="columns" :data-source="data">
                <template #dictType="{ text,record,index}">
                    <div v-if="text!=='2'">{{text==='0'?'字符串':text==='1'?'开关':'集合'}}</div>
                    <a href="javascript:" @click="showDictParamTableForm(true,record.dictId)" v-if="text==='2'">集合</a>
                </template>
                <template #dictValue="{ text,record,index}">
                    <div>{{record.dictType!=='1'?text:text==='1'?'开':'关'}}</div>
                </template>
            </a-table>
        </div>
        <DictModal
                :showModal="showModal"
                :modalFlag="modalFlag"
                :updateDictId="updateDictId"
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
</template>

<script>
    import {onMounted, reactive, toRefs,createVNode} from "vue";
    import api from '../../api/api'
    import DictModal from "../../components/dict/DictModal";
    import DictParamTable from "../../components/dict/DictParamTable";
    import util from "../../utils/util";
    import {Modal} from "ant-design-vue";
    import { QuestionCircleOutlined } from '@ant-design/icons-vue';

    export default {
        name: "DictManager",
        components: {DictParamTable, DictModal, QuestionCircleOutlined},
        setup(props,content){
            const state=reactive({
                data: [],
                page: 1,
                pageSize: 10,
                showModal: false,
                modalFlag: '',
                title: '',
                showParamTable: false,
                dictId: '',
                updateDictId: '',
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
                    state.selectedRows = []
                    state.selectedRowKeys = []
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
            // 多选框
            const onSelectChange = (selectedRowKeys,selectedRows) => {
                state.selectedRowKeys = selectedRowKeys
                state.selectedRows = selectedRows
            }
            // 打开插入弹窗
            const openInsertModal = (flag,modalFlag='',title='') =>{
                state.modalFlag=modalFlag
                state.title = title
                state.showModal=flag
            }
            // 更新字典大项
            const updateDict = () => {
                if(state.selectedRowKeys.length!==1){
                    util.info("请选择要更新的字典")
                }else {
                    state.updateDictId = state.selectedRows[0].dictId
                    openInsertModal(true,'editDict','修改字典大类')
                }
            }
            const deleteDict = () => {
                if(state.selectedRowKeys.length===0){
                    util.info('请选择要删除的字典')
                }else {
                    Modal.confirm({
                        title: '确认删除',
                        content: '是否删除选中子项',
                        icon:createVNode(QuestionCircleOutlined),
                        okText: '确认',
                        cancelText: '取消',
                        onOk(){
                            let strings = state.selectedRows.map(e=>e.dictId);
                            api.sysApi.deleteDict(strings).then(res=>{
                                util.success("删除成功！")
                                getDictList()
                            })
                        }
                    });
                }
            }

            // 保存成功的回调
            const success = () => {
                state.selectedRowKeys = []
                state.selectedRows = []
                openInsertModal(false)
                getDictList()
            }
            // 展示集合
            const showDictParamTableForm = (flag,dictId='') => {
                state.showParamTable=flag;
                state.dictId=dictId;
            }
            return {
                ...toRefs(state),
                pagination,
                columns,
                openInsertModal,
                updateDict,
                deleteDict,
                success,
                showDictParamTableForm,
                onSelectChange,
            }
        }
    }
</script>

<style scoped>

</style>