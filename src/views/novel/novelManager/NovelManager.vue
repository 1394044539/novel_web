<template>
    <div class="content-div">
        <a-divider />
        <div class="custom-table-search">
            <a-form :model="searchFrom" ref="searchFromRef">
                <a-row>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="系列名" name="seriesName" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.seriesName" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="作者" name="seriesAuthor" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.seriesAuthor" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="类型" name="typeCodeList" :label-col="labelCol">
                            <a-select allowClear v-model:value="searchFrom.typeCodeList" mode="multiple">
                                <a-select-option v-for="(item,index) in novelTypes" :value="item.paramCode">{{item.paramValue}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="发布日期" name="publicTime" :label-col="labelCol">
                            <a-range-picker
                                    v-model:value="searchFrom.publicTime"
                                    :placeholder="['开始时间', '结束时间']"
                                    format="YYYY-MM-DD"
                                    style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :labelCol="labelCol">
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
        <div>
            <div style="margin-bottom: 10px">
                <a-row>
                    <a-col :span="8" style="text-align: left">
                        <a-button type="primary" @click="createSeries(true,'create')">
                            <icon-component name="DiffOutlined"/>
                            创建系列
                        </a-button>
                        <a-button type="primary" style="margin-left: 5px" @click="editSeries()">编辑</a-button>
                        <a-button style="margin-left: 5px" @click="deleteSeries">删除</a-button>
                    </a-col>
                    <a-col :span="8" style="text-align: center">
                        <a-button type="primary" @click="getSeriesList()">查询</a-button>
                    <a-button class="custom-btn" @click="resetList()" >重置</a-button>
                    </a-col>
                    <a-col :span="8" style="text-align: right">
                        <a-button type="primary" style="margin-right: 5px" @click="quickUpload(true)">
                            <icon-component name="UploadOutlined"/>
                            快速上传
                        </a-button>
                    </a-col>
                </a-row>
            </div>
            <a-table rowKey="seriesId" :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
                     :pagination="pagination" :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 500 }">
                <template #seriesName="{ text, record, index }">
                    <a-tooltip>
                        <template #title>{{text}}</template>
                        <a href="javascript:" @click="lookSeries(record)" class="custom-two-ellipsis">{{text}}</a>
                    </a-tooltip>
                </template>
                <template #seriesImg="{ text, record, index }">
                    <a-image
                            :width="50"
                            :src="'/img/'+record.seriesImg"
                            :fallback="require('@/assets/img/notImg.png')"
                    />
                </template>
                <template #seriesDesc="{ text, record, index }">
                    <a-tooltip>
                        <template #title>
                            {{text}}
                        </template>
                        <div class="custom-two-ellipsis">{{text}}</div>
                    </a-tooltip>
                </template>
                <template #seriesIntroduce="{ text, record, index }">
                    <a-tooltip>
                        <template #title>{{text}}</template>
                        <div class="custom-two-ellipsis">{{text}}</div>
                    </a-tooltip>
                </template>
                <template #operation="{ text, record, index }">
                    <a-button size="small" type="primary" @click="showNovelModal(true,record)">查看小说</a-button>
                    <a-button class="custom-btn" size="small" type="primary" @click="downloadSeries(record)">下载</a-button>
                </template>
            </a-table>
        </div>
        <QuickUpload :quickUploadModal="quickUploadModal" @closeForm="quickUpload(false)"/>
        <CreateSeries :showCreateSeries="showCreateSeries" :modal-flag="modalFlag" :seriesInfo="seriesInfo"
                     @closeForm="createSeries(false)"
                     @success="successCall"/>
        <NovelTable
                :showNovelTable="showNovel"
                :seriesInfo="seriesInfo"
                @closeForm="showNovelModal"
        />
    </div>
</template>

<script>
    import '../../../views/novel/less/index.less'
    import { onMounted, reactive, toRefs,ref,provide} from 'vue'
    import api from '../../../api/api'
    import util from '../../../utils/util'
    import constant from '../../../common/constant'
    import { useRouter } from 'vue-router'
    import QuickUpload from "../../../components/novel/QuickUpload";
    import CreateSeries from "../../../components/novel/CreateSeries";
    import NovelTable from "../../../components/novel/NovelTable";
    import IconComponent from "../../../components/common/IconComponent";

    export default {
        name: "NovelManager",
        components: {IconComponent, NovelTable, CreateSeries, QuickUpload},
        setup(props,content){
            const state = reactive({
                page: 1,
                pageSize: 10,
                total: 0,
                data: [],
                selectedRowKeys: [],
                selectedRows: [],
                quickUploadModal: false,
                showCreateSeries: false,
                showNovel: false,
                seriesInfo: {},
                modalFlag: '',
                searchFrom: {
                    seriesName: '',
                    seriesAuthor: '',
                    typeCodeList: [],
                    publicTime: [],
                    createTime: [],
                },
                novelTypes: []
            })
            //初始化
            onMounted(()=>{
                initSeriesType()
                getSeriesList();
            })
            //获取路由
            const route = useRouter();
            const searchFromRef = ref();
            //列表功能
            const columns = [
                {
                    title: '系列名',
                    width: 150,
                    dataIndex: 'seriesName',
                    key: 'seriesName',
                    fixed: 'left',
                    slots: {
                        customRender: 'seriesName'
                    }
                },
                {
                    title: '作者',
                    dataIndex: 'seriesAuthor',
                    key: 'seriesAuthor',
                    width: 150,
                },
                {
                    title: '封面信息',
                    dataIndex: 'seriesImg',
                    key: 'seriesImg',
                    width: 150,
                    slots: {
                        customRender: 'seriesImg',
                    },
                },
                {
                    title: '系列类型',
                    dataIndex: 'types',
                    key: 'types',
                    width: 150,
                    slots: {
                        customRender: 'types',
                    },
                },
                {
                    title: '描述(简单)',
                    dataIndex: 'seriesDesc',
                    key: 'seriesDesc',
                    width: 250,
                    slots: {
                        customRender: 'seriesDesc',
                    },
                },
                {
                    title: '介绍',
                    dataIndex: 'seriesIntroduce',
                    key: 'seriesIntroduce',
                    width: 250,
                    slots: {
                        customRender: 'seriesIntroduce',
                    },
                },
                {
                    title: '发布日期',
                    dataIndex: 'publicTime',
                    key: 'publicTime',
                    width: 200,
                },
                {
                    title: '系列总章节数',
                    dataIndex: 'totalChapter',
                    key: 'totalChapter',
                    width: 150,
                },
                {
                    title: '系列总字数',
                    dataIndex: 'totalWord',
                    key: 'totalWord',
                    width: 150,
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    width: 200,
                },
                {
                    title: '最后更新时间',
                    dataIndex: 'updateTime',
                    key: 'updateTime',
                    width: 200,
                },
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 200,
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

            const initSeriesType = () => {
                let param = {
                    dictCode: 'NOVEL_TYPE'
                }
                api.sysApi.getDictParamList(param).then(res=>{
                    state.novelTypes=res
                })
            }
            const lookSeries = (series) => {
                const { href } = route.resolve({
                    path: '/main/seriesInfo',
                    query: {
                        seriesId: series.seriesId,
                    }
                })
                window.open(href, '_blank');
            }
            //获取系列列表
            const getSeriesList = () => {
                let param={
                    ...state.searchFrom
                }
                param.createStartTime = constant.method.getFormatTime(param.createTime[0],'yyyy-MM-DD HH:mm')
                param.createEndTime = constant.method.getFormatTime(param.createTime[1],'yyyy-MM-DD HH:mm')
                param.publicStartTime = constant.method.getFormatTime(param.publicTime[0],'YYYY-MM-DD')
                param.publicEndTime = constant.method.getFormatTime(param.publicTime[1],'YYYY-MM-DD')
                delete param.publicTime
                delete param.createTime
                let requestParam = {
                    page: state.page,
                    pageSize: state.pageSize,
                    param:param,
                }
                api.novelApi.getSeriesList(requestParam).then(res=>{
                    state.data = res.records
                    state.total = res.total
                    state.selectedRowKeys=[]
                    state.selectedRows=[]
                }).catch(err=>{})
            }

            //快速上传功能
            const quickUpload = (flag) =>{
                state.quickUploadModal = flag
            }

            //创建小数功能
            const createSeries = (flag,modalFlag='') => {
                state.showCreateSeries = flag
                state.modalFlag = modalFlag
            }
            // 修改成功回调
            const successCall = () => {
                createSeries(false)
                getSeriesList()
            }
            //修改系列功能
            const editSeries = () => {
                if(state.selectedRowKeys.length===1){
                    state.modalFlag = 'edit'
                    state.seriesInfo = state.selectedRows[0]
                    state.showCreateSeries = true
                }else {
                    util.info("请选择一个系列")
                }
            }
            const deleteSeries = () => {
                if(state.selectedRowKeys.length===0){
                    util.info("请选择要删除的系列")
                }else {
                    util.confirm('确认删除','是否删除选中系列（小说、章节等信息将一并删除）',()=>{
                        let ids = state.selectedRows.map(e=>e.seriesId);
                            api.novelApi.deleteSeries(ids).then(res=>{
                                util.success("删除成功")
                                getSeriesList()
                            })
                    })
                }
            }

            const showNovelModal = (flag,seriesInfo = {}) => {
                state.showNovel = flag
                state.seriesInfo = seriesInfo
            }

            const downloadSeries = (seriesInfo={}) => {
                let param = {
                    collectionType: '1',
                    seriesId: seriesInfo.seriesId
                }
                api.novelApi.download(param)
            }

            const resetList = () => {
                searchFromRef.value.resetFields()
                state.page= 1
                state.pageSize= 10
                getSeriesList()
            }

            return {
                ...toRefs(state),
                columns,
                quickUpload,
                getSeriesList,
                createSeries,
                editSeries,
                deleteSeries,
                lookSeries,
                pagination,
                onSelectChange,
                showNovelModal,
                successCall,
                labelCol:{
                    span: 8,
                },
                downloadSeries,
                resetList,
                searchFromRef,
            }
        }
    }
</script>

<style scoped>
    .upload-modal-upload{
        text-align: center;
        margin-top: 20px;
    }
</style>