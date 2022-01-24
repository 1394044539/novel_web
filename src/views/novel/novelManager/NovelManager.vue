<template>
    <div class="content-div">
        <a-divider />
        <div class="custom-table-search">
            <a-form :model="searchFrom" ref="searchFromRef">
                <a-row>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="系列名" name="novelName" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.novelName" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="作者" name="novelAuthor" :label-col="labelCol">
                            <a-input allowClear v-model:value="searchFrom.novelAuthor" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :labelCol="labelCol">
                        <a-form-item label="类型" name="collectionType" :label-col="labelCol">
                            <a-select allowClear v-model:value="searchFrom.typeCodeList" mode="multiple">
                                <a-select-option v-for="item in novelTypes" value="0">小说</a-select-option>
                                <a-select-option value="1">系列</a-select-option>
                                <a-select-option value="2">文件夹</a-select-option>
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
                        <a-button type="primary" @click="createNovel(true,'create')">
                            <icon-component name="DiffOutlined"/>
                            创建小说
                        </a-button>
                        <a-button type="primary" style="margin-left: 5px" @click="editNovel()">编辑</a-button>
                        <a-button style="margin-left: 5px" @click="deleteNovel">删除</a-button>
                    </a-col>
                    <a-col :span="8" style="text-align: center">
                        <a-button type="primary" @click="getNovelList()">查询</a-button>
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
            <a-table rowKey="novelId" :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
                     :pagination="pagination" :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }">
                <template #novelName="{ text, record, index }">
                    <a-tooltip>
                        <template #title>{{text}}</template>
                        <a href="javascript:" @click="lookNovel(record)" class="custom-two-ellipsis">{{text}}</a>
                    </a-tooltip>
                </template>
                <template #novelImg="{ text, record, index }">
                    <a-image
                            :width="50"
                            :src="'/img/'+record.novelImg"
                            :fallback="require('@/assets/img/notImg.png')"
                    />
                </template>
                <template #typeList="{ text, record, index }">
                    {{getNovelTypeName(text)}}
                </template>
                <template #novelDesc="{ text, record, index }">
                    <a-tooltip>
                        <template #title>
                            {{text}}
                        </template>
                        <div class="custom-two-ellipsis">{{text}}</div>
                    </a-tooltip>
                </template>
                <template #novelIntroduce="{ text, record, index }">
                    <a-tooltip>
                        <template #title>{{text}}</template>
                        <div class="custom-two-ellipsis">{{text}}</div>
                    </a-tooltip>
                </template>
                <template #operation="{ text, record, index }">
                    <a-button size="small" type="primary" @click="showVolumeModal(true,record)">查看分卷</a-button>
                    <a-button class="custom-btn" size="small" type="primary" @click="downloadNovel(record)">下载</a-button>
                </template>
            </a-table>
        </div>
        <QuickUpload :quickUploadModal="quickUploadModal" @closeForm="quickUpload(false)"/>
        <CreateNovel :showCreateNovel="showCreateNovel" :modal-flag="modalFlag" :novel-info="novelInfo"
                     @closeForm="createNovel(false)"
                     @success="successCall"/>
        <VolumeTable
                :showVolumeTable="showVolume"
                :novelInfo="novelInfo"
                @closeForm="showVolumeModal"
        />
    </div>
</template>

<script>
    import '../../../views/novel/less/index.less'
    import { onMounted, reactive, toRefs,ref} from 'vue'
    import api from '../../../api/api'
    import util from '../../../utils/util'
    import constant from '../../../common/constant'
    import { useRouter } from 'vue-router'
    import QuickUpload from "../../../components/novel/QuickUpload";
    import CreateNovel from "../../../components/novel/CreateNovel";
    import VolumeTable from "../../../components/novel/VolumeTable";
    import IconComponent from "../../../components/common/IconComponent";

    export default {
        name: "NovelManager",
        components: {IconComponent, VolumeTable, CreateNovel, QuickUpload},
        setup(props,content){
            const state = reactive({
                page: 1,
                pageSize: 10,
                data: [],
                selectedRowKeys: [],
                selectedRows: [],
                quickUploadModal: false,
                showCreateNovel: false,
                showVolume: false,
                novelInfo: {},
                modalFlag: '',
                searchFrom: {
                    novelName: '',
                    novelAuthor: '',
                    typeCodeList: [],
                    publicTime: [],
                    createTime: [],
                },
                novelTypes: []
            })
            //初始化
            onMounted(()=>{
                getNovelList();
            })
            //获取路由
            const route = useRouter();
            const searchFromRef = ref();
            //列表功能
            const columns = [
                {
                    title: '小说名',
                    width: 150,
                    dataIndex: 'novelName',
                    key: 'novelName',
                    fixed: 'left',
                    slots: {
                        customRender: 'novelName'
                    }
                },
                {
                    title: '作者',
                    dataIndex: 'novelAuthor',
                    key: 'novelAuthor',
                    width: 150,
                },
                {
                    title: '封面信息',
                    dataIndex: 'novelImg',
                    key: 'novelImg',
                    width: 150,
                    slots: {
                        customRender: 'novelImg',
                    },
                },
                {
                    title: '小说类型',
                    dataIndex: 'typeList',
                    key: 'typeList',
                    width: 150,
                    slots: {
                        customRender: 'typeList',
                    },
                },
                {
                    title: '描述(简单)',
                    dataIndex: 'novelDesc',
                    key: 'novelDesc',
                    width: 250,
                    slots: {
                        customRender: 'novelDesc',
                    },
                },
                {
                    title: '介绍',
                    dataIndex: 'novelIntroduce',
                    key: 'novelIntroduce',
                    width: 250,
                    slots: {
                        customRender: 'novelIntroduce',
                    },
                },
                {
                    title: '发布日期',
                    dataIndex: 'publicTime',
                    key: 'publicTime',
                    width: 200,
                },
                {
                    title: '小说总章节数',
                    dataIndex: 'totalWord',
                    key: 'totalWord',
                    width: 150,
                },
                {
                    title: '小说总字数',
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

            const getNovelTypeName = (types) =>{
                if(types){
                    let name = ''
                    types.forEach(e=>{
                        name += e.paramName + ','
                    })
                    return name.substring(0,name.length-1)
                }
                return ''
            }
            const lookNovel = (novel) => {
                const { href } = route.resolve({
                    path: '/main/novelInfo',
                    query: {
                        novelId: novel.novelId,
                    }
                })
                window.open(href, '_blank');
            }
            //获取小说列表
            const getNovelList = () => {
                let param={
                    page:state.page,
                    pageSize:state.pageSize,
                    ...state.searchFrom
                }
                param.createStartTime = constant.method.getFormatTime(param.createTime[0],'YYYY-MM-DD')
                param.createEndTime = constant.method.getFormatTime(param.createTime[1],'YYYY-MM-DD')
                param.publicStartTime = constant.method.getFormatTime(param.publicTime[0],'YYYY-MM-DD HH:mm')
                param.publicEndTime = constant.method.getFormatTime(param.publicTime[1],'YYYY-MM-DD HH:mm')
                delete param.publicTime
                delete param.createTime

                api.novelApi.getNovelList(param).then(res=>{
                    state.data = res.records
                    state.selectedRowKeys=[]
                    state.selectedRows=[]
                }).catch(err=>{})
            }

            //快速上传功能
            const quickUpload = (flag) =>{
                state.quickUploadModal = flag
            }

            //创建小数功能
            const createNovel = (flag,modalFlag='') => {
                state.showCreateNovel = flag
                state.modalFlag = modalFlag
            }
            // 修改成功回调
            const successCall = () => {
                createNovel(false)
                getNovelList()
            }
            //修改小说功能
            const editNovel = () => {
                if(state.selectedRowKeys.length===1){
                    state.modalFlag = 'edit'
                    state.novelInfo = state.selectedRows[0]
                    state.showCreateNovel = true
                }else {
                    util.info("请选择一个小说")
                }
            }
            const deleteNovel = () => {
                if(state.selectedRowKeys.length===0){
                    util.info("请选择要删除的小说")
                }else {
                    util.confirm('确认删除','是否删除选中小说（分卷、章节等信息将一并删除）',()=>{
                        let ids = state.selectedRows.map(e=>e.novelId);
                            api.novelApi.deleteNovel(ids).then(res=>{
                                util.success("删除成功")
                                getNovelList()
                            })
                    })
                }
            }

            const showVolumeModal = (flag,novelInfo = {}) => {
                state.showVolume = flag
                state.novelInfo = novelInfo
            }

            const downloadNovel = (novelInfo={}) => {
                let param = {
                    collectionType: '1',
                    novelId: novelInfo.novelId
                }
                api.novelApi.download(param)
            }

            const resetList = () => {
                searchFromRef.value.resetFields()
                state.page= 1
                state.pageSize= 10
                getNovelList()
            }

            return {
                ...toRefs(state),
                columns,
                quickUpload,
                getNovelList,
                createNovel,
                editNovel,
                deleteNovel,
                lookNovel,
                pagination,
                onSelectChange,
                showVolumeModal,
                successCall,
                getNovelTypeName,
                labelCol:{
                    span: 8,
                },
                downloadNovel,
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