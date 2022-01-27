<template>
    <div class="content-div">
        <a-divider />
        <div class="custom-table-search">
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
                <a-row>
                    <a-col :span="8">
                        <a-form-item label="操作人" name="createByName" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.createByName" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="创建日期" name="createTime" :label-col="labelCol">
                            <a-range-picker
                                    v-model:value="searchFrom.createTime"
                                    :show-time="{ format: 'HH:mm' }"
                                    :placeholder="['开始时间', '结束时间']"
                                    format="YYYY-MM-DD HH:mm"
                                    style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <div style="margin-bottom: 20px">
            <a-row>
                <a-col :span="8" style="text-align: left">
                    <a-button class="custom-btn" @click="batchDelete">删除</a-button>
                </a-col>
                <a-col :span="8" style="text-align: center">
                    <a-button type="primary" @click="getList()">查询</a-button>
                    <a-button class="custom-btn" @click="resetList()" >重置</a-button>
                </a-col>
                <a-col :span="8" style="text-align: right">
<!--                    <a-button>清除失效收藏</a-button>-->
                    <a-button class="custom-btn" @click="removeAll">清空收藏</a-button>
                </a-col>
            </a-row>
        </div>
        <div>
            <a-table :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
                     rowKey='collectionId'
                     :pagination="pagination" :columns="columns" :data-source="data" :scroll="{ y: 600 }">
                <template #collectionType="{text,record,index}">
                    {{text==='0'?'小说':text==='1'?'系列':'文件夹'}}
                </template>
                <template #parentName="{text,record,index}">
                    {{text || '-'}}
                </template>
                <template #operation="{text,record,index}">
                    <a-button v-if="record.collectionType==='2'" size="small">重命名</a-button>
<!--                    <a-button class="custom-btn" size="small">移动</a-button>-->
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
    import { reactive,toRefs,onMounted,ref} from 'vue'
    import api from '../../api/api'
    import util from '../../utils/util'
    import constant from '../../common/constant'

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
                    collectionType: '',
                    createByName: '',
                    createTime: '',
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
                    align: 'center',
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
                    align: 'center',
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
                    ...state.searchFrom
                }
                param.createStartTime = constant.method.getFormatTime(param.createTime[0],'yyyy-MM-DD HH:mm')
                param.createEndTime = constant.method.getFormatTime(param.createTime[1],'yyyy-MM-DD HH:mm')
                delete param.createTime
                let requestParam = {
                    page: state.page,
                    pageSize: state.pageSize,
                    param
                }
                api.novelApi.getCollectionListPage(requestParam).then(res=>{
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
            // 批量删除
            const batchDelete = () => {
                if(state.selectedRowKeys.length===0){
                    util.info("请选择要删除的内容")
                    return
                }
                util.confirm("删除","是否删除选择的内容？",()=>{
                    api.novelApi.batchCancelCollection(state.selectedRows).then(res=>{
                    })
                })
            }
            //清空收藏
            const removeAll = () => {
                util.confirm("清空","是否要清空收藏？",()=>{
                    api.novelApi.removeAll({}).then(res=>{
                        util.success("清除成功！")
                        getList()
                    })
                })
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
                batchDelete,
                removeAll,
            }
        }
    }
</script>

<style scoped>

</style>