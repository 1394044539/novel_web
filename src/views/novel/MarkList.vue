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
                        <a-form-item label="书签名" name="markName" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.markName" />
                        </a-form-item>
                    </a-col>
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
                </a-row>
            </a-form>
        </div>
        <div>
            <div style="margin-bottom: 10px">
                <a-row>
                    <a-col :span="8" style="text-align: left">
                        <a-button @click="deleteMark">删除</a-button>
                    </a-col>
                    <a-col :span="8" style="text-align: center">
                        <a-button type="primary" @click="getMarkList()">查询</a-button>
                        <a-button class="custom-btn" @click="resetList()" >重置</a-button>
                    </a-col>
                    <a-col :span="8" style="text-align: right">
                        <a-button @click="clearMark">清空历史</a-button>
                    </a-col>
                </a-row>
            </div>
            <a-table rowKey="historyId" :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
                     :pagination="pagination" :columns="columns" :data-source="data" :scroll="{ y: 500 }">
                <template #markName="{ text, record, index}">
                    <a href="javascript:" @click="lookChapter(record)">{{text}}</a>
                </template>
                <template #operation="{ text, record, index }">
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
    import { reactive,toRefs,ref,onMounted } from 'vue'
    import { useRoute,useRouter } from 'vue-router'
    import api from '../../api/api'
    import util from '../../utils/util'
    import constant from '../../common/constant'

    export default {
        name: "MarkList",
        setup(props,content){
            const state = reactive({
                page: 1,
                pageSize: 10,
                total: 0,
                searchFrom: {
                    markName: '',
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
            const route = useRoute()
            const router = useRouter()
            const searchFromRef = ref();
            //列表功能
            const columns = [
                {
                    title: '书签名',
                    dataIndex: 'markName',
                    key: 'markName',
                    slots: {
                        customRender: 'markName'
                    }
                },
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
                    title: '记录人',
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
                getMarkList();
            })

            // 获取列表
            const getMarkList = () => {
                let param = {
                    ...state.searchFrom,
                    recordType: '1'
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
                getMarkList();
            }

            //删除历史
            const deleteMark = () => {
                if(state.selectedRowKeys.length===0){
                    util.info("请选择要删除的内容")
                    return
                }
                util.confirm("删除","是否删除选择的内容？",()=>{
                    let ids = state.selectedRows.map(e=>e.historyId);
                    api.novelApi.batchDeleteHistory(ids).then(res=>{
                        util.success("删除成功！")
                        getMarkList();
                    })
                })
            }

            const clearMark = () => {
                util.confirm("清空","是否清空书签？",()=>{
                    api.novelApi.clearHistory({recordType: '0'}).then(res=>{
                        util.success("清空成功！")
                        getMarkList();
                    })
                })
            }

            const lookChapter = (record) => {
                router.push({
                    name: 'ChapterContent',
                    query: {
                        chapterId: record.lastChapterId
                    },
                    params: {
                        visit: 'mark',
                        percentage: record.recordPercentage
                    }
                })
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
                deleteMark,
                getMarkList,
                resetList,
                clearMark,
                lookChapter,
            }
        }
    }
</script>

<style scoped>

</style>