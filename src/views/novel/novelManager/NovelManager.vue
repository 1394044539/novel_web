<template>
    <div class="content-div">
        <div class="content-header">
            <a-button type="primary" size="large" style="margin-right: 10px" @click="quickUpload">
                <component :is="$antIcons['UploadOutlined']"/>
                快速上传
            </a-button>
            <a-button type="primary" size="large" @click="getNovelList">
                <component :is="$antIcons['DiffOutlined']"/>
                创建小说
            </a-button>
        </div>
        <a-divider />
        <div>
            <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }">
                <template #novelImg="{ record }">
                    <a-image
                            :width="50"
                            :src="record.novelImg"
                    />
                </template>
                <template #action>
                    <a>action</a>
                </template>
            </a-table>
        </div>

        <a-modal
            v-model:visible="quickUploadModal"
            title="快速上传"
            :footer="null"
            @cancel="closeUpload"
        >
            <a-upload-dragger
                    :fileList="fileList"
                    accept=".txt,.epub"
                    name="file"
                    :multiple="false"
                    :before-upload="beforeUpload"
                    :remove="removeUpload"
            >
                <div v-if="fileList.length===0">
                    <p class="ant-upload-drag-icon">
                        <inbox-outlined></inbox-outlined>
                    </p>
                    <p class="ant-upload-text">点击或移动上传文件</p>
                </div>
                <div v-else>
                    <p style="font-weight: bold">请点击下方按钮上传</p>
                    <p>请注意</p>
                    <p>快速上传会以文件名作为小说标题，其他各种属性会尽量从文件中取</p>
                    <p>如数据不正确或缺失，需要您后续自行修改</p>
                </div>
            </a-upload-dragger>
            <div class="upload-modal-upload">
                <a-button :disabled="fileList.length===0" type="primary" size="large" @click="submitQuickUpload">上传</a-button>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import { onMounted,reactive,ref } from 'vue'
    import {} from 'vue'
    import util from '../../../utils/util'
    import api from '../../../api/api'
    import { useRouter } from 'vue-router'
    import { InboxOutlined } from '@ant-design/icons-vue';

    export default {
        name: "NovelManager",
        components: [
            InboxOutlined,
        ],
        setup(props,content){
            //获取路由
            const route = useRouter();
            let fileList = ref([])
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
                    width: 100,
                    slots: {
                        customRender: 'action',
                    },
                }
            ]


            //初始化
            onMounted(()=>{
                getNovelList();
            })

            //直接调用方法
            const getNovelList = () => {
                let param={
                    page: page.value,
                    pageSize: pageSize.value
                }
                api.novelApi.getNovelList(param).then(res=>{
                    data.value = res.records
                }).catch(err=>{})
            }


            //快速上传弹窗
            const quickUploadModal = ref(false)
            //快速上传弹窗
            const quickUpload = () =>{
                quickUploadModal.value = true
            }
            //上传关闭回调
            const closeUpload = (e) => {
                fileList.value = []
            }
            // 上传前，file是当前的文件，files是批量文件，这里关闭了批量文件，所以files一直是一个
            const beforeUpload = (file,files) => {
                if(fileList.value.length===0){
                    fileList.value = [...fileList.value, file];
                }else {
                    util.info("只能上传一个文件")
                }
                return false
            }
            //删除文件
            const removeUpload = (file) => {
                const index = fileList.value.indexOf(file);
                const newFileList = fileList.value.slice();
                newFileList.splice(index, 1);
                fileList.value = newFileList;
            }
            //上传文件
            const submitQuickUpload = () => {
                let formData = new FormData()
                formData.append('file',fileList.value[0])
                api.novelApi.quickUpload(formData).then(res=>{
                    util.success("上传成功")
                    route.push({
                        name: 'NovelInfo',
                        query: {
                            novelId: 'e05c70a6e84646eba3191b0b22a22371',
                        }
                    })
                }).catch(err=>{})
            }



            return {
                columns,
                quickUpload,
                quickUploadModal,
                closeUpload,
                fileList,
                data,
                beforeUpload,
                removeUpload,
                submitQuickUpload,
                getNovelList
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