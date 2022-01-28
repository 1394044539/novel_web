<template>
    <div class="content-div">
        <a-divider />
        <div class="custom-table-search">
            <a-form :model="searchFrom" ref="searchFromRef">
                <a-row>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="文件名" name="fileName" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.fileName" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="小说名" name="novelName" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.novelName" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="所在系列" name="seriesName" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.seriesName" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="上传日期" name="createTime" :label-col="labelCol">
                            <a-range-picker
                                    v-model:value="searchFrom.createTime"
                                    :show-time="{ format: 'HH:mm' }"
                                    :placeholder="['开始时间', '结束时间']"
                                    format="YYYY-MM-DD HH:mm"
                                    style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="上传人" name="createByName" :label-col="labelCol">
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
                        <a-button>删除</a-button>
                    </a-col>
                    <a-col :span="8" style="text-align: center">
                        <a-button type="primary" @click="getUploadList()">查询</a-button>
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
<!--            <a-tabs activeKey="1" size="large">-->
<!--                <a-tab-pane key="1" tab="上传记录">-->
<!--                    <div class="upload-list-item">-->
<!--                        <div class="upload-list-item-photo">-->
<!--                            <a-image-->
<!--                                    :width="120"-->
<!--                                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"-->
<!--                            />-->
<!--                        </div>-->
<!--                        <div class="upload-list-item-info">-->
<!--                            <div>-->
<!--                                <h2>欢迎来到实力至上主义的教室</h2>-->
<!--                            </div>-->
<!--                            <div style="margin: 10px 0">-->
<!--                                <span>书名：作者</span>-->
<!--                            </div>-->
<!--                            <div>-->
<!--                                <span>2021-09-27 22:38:56</span>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                        <div style="display:table;margin-left: auto;">-->
<!--                            <span style="display:table-cell;vertical-align:middle;">操作</span>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <a-divider />-->
<!--                </a-tab-pane>-->
<!--            </a-tabs>-->
        </div>
</template>

<script>
    import './less/index.less'
    import { reactive,toRefs,ref,onMounted } from 'vue'
    import api from '../../api/api'
    import util from '../../utils/util'
    import constant from '../../common/constant'

    export default {
        name: "UploadRecord",
        setup(props,content){
            const state = reactive({
                page: 1,
                pageSize: 10,
                total: 0,
                searchFrom: {
                    fileName: '',
                    novelName: '',
                    seriesName: '',
                    createTime: [],
                    createByName: '',
                },
                selectedRowKeys: [],
                selectedRows: [],
                data: [],
            })
            onMounted(()=>{
                getUploadList()
            })
            const searchFromRef = ref();
            //列表功能
            const columns = [
                {
                    title: '文件名',
                    dataIndex: 'fileName',
                    key: 'fileName',
                    slots: {
                        customRender: 'fileName'
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
                    title: '所在系列',
                    dataIndex: 'seriesName',
                    key: 'seriesName',
                    slots: {
                        customRender: 'seriesName',
                    },
                },
                {
                    title: '文件大小',
                    dataIndex: 'fileSize',
                    key: 'fileSize',
                    slots: {
                        customRender: 'fileSize'
                    }
                },
                {
                    title: '上传日期',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    slots: {
                        customRender: 'createTime',
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

            const getUploadList = () => {
                let param = {
                    ...state.searchFrom
                }
                param.createStartTime = constant.method.getFormatTime(param.createTime[0],'yyyy-MM-DD HH:mm')
                param.createEndTime = constant.method.getFormatTime(param.createTime[1],'yyyy-MM-DD HH:mm')
                delete param.createTime
                let requestParam = {
                    page: state.page,
                    pageSize :state.pageSize,
                    param: param
                }
                api.novelApi.getUploadList(requestParam).then(res=>{
                    state.data = res.records
                    state.total = res.total
                })
            }
            const resetList = () => {
                searchFromRef.value.resetFields();
                getUploadList();
            }
            return{
                ...toRefs(state),
                labelCol:{
                    span: 8,
                },
                searchFromRef,
                getUploadList,
                resetList,
                columns,
                pagination,
                onSelectChange,
            }
        }
    }
</script>

<style scoped>

</style>