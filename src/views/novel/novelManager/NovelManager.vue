<template>
    <div class="content-div">
        <div class="content-header">
        </div>
        <a-divider />
        <div>
            <div style="margin-bottom: 10px">
                <a-row>
                    <a-col :span="12">
                        <a-button type="primary" @click="createNovel(true)">
                            <component :is="$antIcons['DiffOutlined']"/>
                            创建小说
                        </a-button>
                        <a-button type="primary" style="margin-left: 5px" @click="editNovel">编辑</a-button>
                        <a-button style="margin-left: 5px" @click="deleteNovel">删除</a-button>
                    </a-col>
                    <a-col :span="12" style="text-align: right">
                        <a-button type="primary" style="margin-right: 5px" @click="quickUpload(true)">
                            <component :is="$antIcons['UploadOutlined']"/>
                            快速上传
                        </a-button>
                    </a-col>
                </a-row>
            </div>
            <a-table :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
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
                </template>
            </a-table>
        </div>
        <QuickUpload :quickUploadModal="quickUploadModal" @closeForm="quickUpload(false)"/>
        <CreateNovel :showCreateNovel="showCreateNovel" @closeForm="createNovel(false)"/>
        <VolumeTable
                :showVolumeTable="showVolume"
                :novelInfo="novelInfo"
                @closeForm="showVolumeModal"
        />
    </div>
</template>

<script>
    import '../../../views/novel/less/index.less'
    import {createVNode, onMounted, reactive, ref, toRefs} from 'vue'
    import { Modal } from 'ant-design-vue'
    import api from '../../../api/api'
    import util from '../../../utils/util'
    import { useRouter } from 'vue-router'
    import QuickUpload from "../../../components/novel/QuickUpload";
    import CreateNovel from "../../../components/novel/CreateNovel";
    import { QuestionCircleOutlined } from '@ant-design/icons-vue';
    import VolumeTable from "../../../components/novel/VolumeTable";

    export default {
        name: "NovelManager",
        components: {VolumeTable, CreateNovel, QuickUpload},
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
                novelInfo: {}
            })
            //初始化
            onMounted(()=>{
                getNovelList();
            })
            //获取路由
            const route = useRouter();

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
                    width: 150,
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
                }
                api.novelApi.getNovelList(param).then(res=>{
                    state.data = res.records
                }).catch(err=>{})
            }

            //快速上传功能
            const quickUpload = (flag) =>{
                state.quickUploadModal = flag
            }

            //创建小数功能
            const createNovel = (flag) => {
                state.showCreateNovel = flag
            }
            //修改小说功能
            const editNovel = () => {
                if(state.selectedRowKeys.length===1){
                    util.success("修改成功！")
                }else {
                    util.info("请选择一个小说")
                }
            }
            const deleteNovel = () => {
                if(state.selectedRowKeys.length===0){
                    util.info("请选择要删除的小说")
                }else {
                    Modal.confirm({
                        title: '确认删除',
                        content: '是否删除选中小说（分卷、章节等信息将一并删除）',
                        icon:createVNode(QuestionCircleOutlined),
                        okText: '确认',
                        cancelText: '取消',
                        onOk(){
                            let ids = state.selectedRows.map(e=>e.novelId);
                            api.novelApi.deleteNovel(ids).then(res=>{
                                util.success("删除成功")
                                getNovelList()
                            })
                        }
                    })
                }
            }

            const showVolumeModal = (flag,novelInfo = {}) => {
                state.showVolume = flag
                state.novelInfo = novelInfo
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
            }
        }
    }
</script>

<style scoped>
    .content-header{
        text-align: right;
    }
    .upload-modal-upload{
        text-align: center;
        margin-top: 20px;
    }
</style>