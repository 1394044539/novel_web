<template>
    <div>
        <a-modal
                v-model:visible="quickUploadModal"
                title="快速上传"
                :footer="null"
                @cancel="closeUpload"
        >
            <a-upload-dragger
                    :fileList="fileList"
                    accept=".txt,.epub"
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
                    <p style="color: grey">快速上传会以文件名作为小说标题，其他各种属性会尽量从文件中取</p>
                    <p style="color: grey">如数据不正确或缺失，需要您后续自行修改</p>
                </div>
            </a-upload-dragger>
            <div class="upload-modal-upload">
                <a-button :disabled="fileList.length===0" type="primary" @click="submitQuickUpload" :loading="uploading">上传</a-button>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import util from "../../utils/util";
    import api from "../../api/api";
    import {ref,reactive,watch,toRefs} from "vue";
    import {useRouter} from "vue-router";

    export default {
        name: "QuickUpload",
        props: {
            quickUploadModal:{
                type: Boolean,
                default: false,
            }
        },
        setup(props,content){
            const state = reactive({
                uploading: false
            })
            //获取路由
            const route = useRouter();
            //获取props
            let fileList = ref([])
            //上传关闭回调
            const closeUpload = () => {
                fileList.value = []
                content.emit("closeForm");
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
                state.uploading = true
                let formData = new FormData()
                formData.append('file',fileList.value[0])
                api.novelApi.quickUpload(formData).then(res=>{
                    util.success("上传成功")
                    state.uploading = false
                    route.push({
                        name: 'SeriesInfo',
                        query: {
                            seriesId: res.seriesId,
                        }
                    })
                }).catch(err=>{})
            }

            return {
                ...toRefs(state),
                fileList,
                closeUpload,
                beforeUpload,
                removeUpload,
                submitQuickUpload,
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