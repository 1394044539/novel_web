<template>
    <div class="content-div">
        <div style="padding: 0 10%">
            <a-form :model="searchFrom" ref="searchFromRef">
                <a-row>
                    <a-col :span="8">
                        <a-form-item label="收藏名" name="catalogName" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.catalogName" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="收藏类型" name="collectionType" :label-col="labelCol">
                            <a-select allowClear v-model:value="searchFrom.collectionType">
                                <a-select-option value="0">小说</a-select-option>
                                <a-select-option value="1">系列</a-select-option>
                                <a-select-option value="2">文件夹</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="父级目录" name="parentName" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.parentName" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <div style="margin-bottom: 20px">
            <a-row>
                <a-col :span="8" style="text-align: left">
                    <a-button type="primary">新增</a-button>
                    <a-button style="margin-left: 15px">修改</a-button>
                    <a-button style="margin-left: 15px">删除</a-button>
                </a-col>
                <a-col :span="8" style="text-align: center">
                    <a-button type="primary" @click="getList()">查询</a-button>
                    <a-button style="margin-left: 15px" @click="resetList()" >重置</a-button>
                </a-col>
                <a-col :span="8" style="text-align: right">
                    <a-button>清空收藏</a-button>
                </a-col>
            </a-row>
        </div>
        <div>
            <a-table :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
                     rowKey='collectionId'
                     :pagination="pagination" :columns="columns" :data-source="data" :scroll="{ y: 500 }">
                <template #collectionType="{text,record,index}">
                    {{text==='0'?'小说':text==='1'?'系列':'文件夹'}}
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
    import { reactive,toRefs,onMounted,ref} from 'vue'
    import api from '../../api/api'

    export default {
        name: "MyNovel",
        setup(props, context) {
            const state = reactive({
                data: [],
                page: 1,
                pageSize: 10,
                total: 0,
                selectedRowKeys: [],
                selectedRows: [],
                searchFrom:{
                    catalogName: '',
                    parentName: '',
                },
            })
            let searchFromRef = ref()
            onMounted(()=>{
                getList();
            })
            const columns = [
                {
                    title: '名字',
                    dataIndex: 'name',
                    key: 'name',
                    slots: {
                        customRender: 'name'
                    }
                },
                {
                    title: '收藏类型',
                    dataIndex: 'collectionType',
                    key: 'collectionType',
                    slots: {
                        customRender: 'collectionType'
                    }
                },
                {
                    title: '父级目录',
                    dataIndex: 'parentName',
                    key: 'parentName',
                    slots: {
                        customRender: 'parentName'
                    }
                },
                {
                    title: '创建人',
                    dataIndex: 'createByName',
                    key: 'createByName',
                    slots: {
                        customRender: 'createByName'
                    }
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    slots: {
                        customRender: 'createTime'
                    }
                },
                {
                    title: '操作',
                    key: 'operation',
                    slots: {
                        customRender: 'operation',
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
                onChange:(page,pageSize)=> {},//点击页码事件
            }
            const onSelectChange = (selectedRowKeys,selectedRows) => {
                state.selectedRowKeys = selectedRowKeys
                state.selectedRows = selectedRows
            }

            const getList = () =>{
                let param = {
                    page: state.page,
                    pageSize: state.pageSize,
                    ...state.searchFrom
                }
                api.novelApi.getCollectionListPage(param).then(res=>{
                    state.data=res.records
                    state.total = res.total
                })
            }
            const resetList = () => {
                searchFromRef.value.resetFields()
                state.page= 1
                state.pageSize= 10
                getList()
            }
            return {
                ...toRefs(state),
                columns,
                onSelectChange,
                pagination,
                labelCol:{
                    span: 8,
                },
                getList,
                resetList,
                searchFromRef,
            }
        }
    }
</script>

<style scoped>

</style>