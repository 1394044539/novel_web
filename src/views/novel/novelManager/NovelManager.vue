<template>
    <div class="content-div">
        <div class="content-header">
            <a-button type="primary" style="margin-right: 10px" @click="quickUpload(true)">
                <component :is="$antIcons['UploadOutlined']"/>
                快速上传
            </a-button>
            <a-button type="primary" @click="createNovel(true)">
                <component :is="$antIcons['DiffOutlined']"/>
                创建小说
            </a-button>
        </div>
        <a-divider />
        <div>
            <a-table :pagination="pagination" :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }">
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
                <template #action>
                    <a-button size="small" type="primary">编辑</a-button>
                    <a-button style="margin-left: 5px" size="small">删除</a-button>
                </template>
            </a-table>
        </div>
        <QuickUpload :quickUploadModal="quickUploadModal" @closeForm="quickUpload(false)"/>
        <CreateNovel :showCreateNovel="showCreateNovel" @closeForm="createNovel(false)"/>
    </div>
</template>

<script>
    import '../../../views/novel/less/index.less'
    import { onMounted,reactive,ref,toRefs } from 'vue'
    import api from '../../../api/api'
    import { useRouter } from 'vue-router'
    import QuickUpload from "../../../components/novel/QuickUpload";
    import CreateNovel from "../../../components/novel/CreateNovel";

    export default {
        name: "NovelManager",
        components: {CreateNovel, QuickUpload},
        setup(props,content){
            const state = reactive({
                page: 1,
                pageSize: 10,
                data: [],
                quickUploadModal: false,
                showCreateNovel: false,
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
                    ellipsis: true,
                },
                {
                    title: '介绍',
                    dataIndex: 'novelIntroduce',
                    key: 'novelIntroduce',
                    width: 250,
                    ellipsis: true,
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
                    title: 'Action',
                    key: 'operation',
                    fixed: 'right',
                    width: 150,
                    slots: {
                        customRender: 'action',
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
            const lookNovel = (novel) => {
                route.push({
                    name: 'NovelInfo',
                    query: {
                        novelId: novel.novelId,
                    }
                })
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

            return {
                ...toRefs(state),
                columns,
                quickUpload,
                getNovelList,
                createNovel,
                lookNovel,
                pagination,
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