<template>
    <div class="content-div">
        <a-divider />
        <div class="custom-table-search">
            <a-form :model="searchFrom" ref="searchFromRef">
                <a-row>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="小说名" name="novelName" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.novelName" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="系列名" name="seriesName" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.seriesName" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="章节名" name="chapterName" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.chapterName" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="时间" name="updateTime" :label-col="labelCol">
                            <a-range-picker
                                    v-model:value="searchFrom.updateTime"
                                    :show-time="{ format: 'HH:mm' }"
                                    :placeholder="['开始时间', '结束时间']"
                                    format="YYYY-MM-DD HH:mm"
                                    style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="记录用户" name="createByName" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.createByName" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="ip" name="ip" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.ip" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <div>
            <div style="margin-bottom: 10px">
                <a-row>
                    <a-col :span="8" style="text-align: left">
                        <a-button @click="deleteHistory">删除</a-button>
                    </a-col>
                    <a-col :span="8" style="text-align: center">
                        <a-button type="primary" @click="getHistoryList()">查询</a-button>
                        <a-button class="custom-btn" @click="resetList()" >重置</a-button>
                    </a-col>
                    <a-col :span="8" style="text-align: right">
                    </a-col>
                </a-row>
            </div>
            <a-table rowKey="index" :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
                     :pagination="pagination" :columns="columns" :data-source="data" :scroll="{ y: 500 }">
                <template #operation="{ text, record, index }">
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
    import { reactive,toRefs,ref,onMounted } from 'vue'
    import api from '../../api/api'
    import util from '../../utils/util'
    import constant from '../../common/constant'

    export default {
        name: "HistoryRecord",
        setup(props,content){
            const state = reactive({
                page: 1,
                pageSize: 10,
                total: 0,
                searchFrom: {
                    ip: '',
                    novelName: '',
                    seriesName: '',
                    updateTime: [],
                    createByName: '',
                    chapterName: '',
                },
                selectedRowKeys: [],
                selectedRows: [],
                data: [],
            })
            const searchFromRef = ref();
            //列表功能
            const columns = [
                {
                    title: '小说名',
                    dataIndex: 'novelName',
                    key: 'novelName',
                    slots: {
                        customRender: 'novelName'
                    }
                },
                {
                    title: '章节名',
                    dataIndex: 'chapterName',
                    key: 'chapterName',
                    slots: {
                        customRender: 'chapterName'
                    }
                },
                {
                    title: '所在系列',
                    dataIndex: 'seriesName',
                    key: 'seriesName',
                    slots: {
                        customRender: 'seriesName',
                    },
                },
                {
                    title: '阅读进度',
                    dataIndex: 'recordPercentage',
                    key: 'recordPercentage',
                    slots: {
                        customRender: 'recordPercentage',
                    },
                },
                {
                    title: '记录日期',
                    dataIndex: 'updateTime',
                    key: 'updateTime',
                    slots: {
                        customRender: 'updateTime',
                    },
                },
                {
                    title: '上传人',
                    dataIndex: 'createByName',
                    key: 'createByName',
                    slots: {
                        customRender: 'createByName',
                    },
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
                total: state.total,
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
            onMounted(()=>{
                getHistoryList();
            })

            // 获取列表
            const getHistoryList = () => {
                let param = {
                    ...state.searchFrom
                }
                param.updateStartTime = constant.method.getFormatTime(param.updateTime[0],'yyyy-MM-DD HH:mm')
                param.updateEndTime = constant.method.getFormatTime(param.updateTime[1],'yyyy-MM-DD HH:mm')
                delete param.updateTime
                let requestParam = {
                    page: state.page,
                    pageSize :state.pageSize,
                    param: param
                }
                api.novelApi.getHistoryList(requestParam).then(res=>{
                    state.data = res.records
                    state.total = res.total
                })
            }

            //重置搜索表单
            const resetList = () => {
                searchFromRef.value.resetFields();
                getHistoryList();
            }

            //删除历史
            const deleteHistory = () => {

            }

            return{
                ...toRefs(state),
                labelCol:{
                    span: 8,
                },
                onSelectChange,
                pagination,
                columns,
                searchFromRef,
                deleteHistory,
                getHistoryList,
                resetList,
            }
        }
    }
</script>

<style scoped>

</style>