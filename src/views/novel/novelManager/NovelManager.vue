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
            <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }">
                <template #novelName="{ text, record, index }">
                    <a-tooltip>
                        <template #title>{{text}}</template>
                        <a class="custom-two-ellipsis">{{text}}</a>
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
                    <a-button size="small">编辑</a-button>
                    <a-button size="small">删除</a-button>
                </template>
            </a-table>
        </div>
        <QuickUpload :quickUploadModal="quickUploadModal" @closeForm="quickUpload(false)"/>
        <CreateNovel :showCreateNovel="showCreateNovel" @closeForm="createNovel(false)"/>
    </div>
</template>

<script>
    import '../../../views/novel/less/index.less'
    import { onMounted,reactive,ref } from 'vue'
    import api from '../../../api/api'
    import { useRouter } from 'vue-router'
    import QuickUpload from "../../../components/novel/QuickUpload";
    import CreateNovel from "../../../components/novel/CreateNovel";

    export default {
        name: "NovelManager",
        components: {CreateNovel, QuickUpload},
        setup(props,content){
            //初始化
            onMounted(()=>{
                getNovelList();
            })
            //获取路由
            const route = useRouter();

            //快速上传功能
            let fileList = ref([])

            //列表功能
            let page=ref(1);
            let pageSize=ref(10);
            let data = ref([])
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
            //获取小说列表
            const getNovelList = () => {
                let param={
                    page: page.value,
                    pageSize: pageSize.value
                }
                api.novelApi.getNovelList(param).then(res=>{
                    data.value = res.records
                }).catch(err=>{})
            }

            //快速上传功能
            let quickUploadModal = ref(false)
            const quickUpload = (flag) =>{
                quickUploadModal.value = flag
            }

            //创建小数功能
            let showCreateNovel = ref(false)
            const createNovel = (flag) => {
                showCreateNovel.value = flag
            }

            return {
                columns,
                quickUpload,
                quickUploadModal,
                fileList,
                data,
                getNovelList,
                createNovel,
                showCreateNovel,
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