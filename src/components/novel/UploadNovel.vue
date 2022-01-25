<template>
    <a-modal
            v-model:visible="showUploadModal"
            title="上传小说"
            :footer="null"
            @cancel="closeForm"
            style="text-align: center"
    >
        <div style="margin: 15px 0">
            <a-row>
                <a-col :span="24">
                    请选择上传模式
                </a-col>
            </a-row>
            <a-row style="margin-top: 10px">
                <a-col :span="24">
                    <a-button type="primary" @click="showSingleFile(true)">单小说上传</a-button>
                    <a-button style="margin-left: 10px" type="primary" @click="showBatchFile(true)">批量上传</a-button>
                </a-col>
            </a-row>
        </div>
    </a-modal>
    <a-modal
            v-model:visible="showSingleModal"
            :closable="uploadStatus"
            :maskClosable="false"
            title="单小说上传"
            :footer="null"
            @cancel="showSingleFile(false)"
            style="text-align: center"
    >
        <div>
            <a-form :model="novelFormData"
                    ref="volumeFormRef"
                    :rules="volumeRules">
                <a-row>
                    <a-col :span="24">
                        <a-form-item label="小说名：" name="novelName" :label-col="{span: 4}">
                            <a-input allowClear v-model:value="novelFormData.novelName" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="发布时间：" name="publicTime" :label-col="{span: 8}">
                            <a-date-picker
                                    v-model:value="novelFormData.publicTime"
                                    type="date"
                                    placeholder="发布时间"
                                    style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="排序号：" name="novelOrder" :label-col="{span: 8}">
                            <a-input-number allowClear style="width: 100%" v-model:value="novelFormData.novelOrder" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="文件：" name="novelFile" :label-col="{span: 8}">
                            <div style="max-width: 150px">
                                <a-upload
                                        v-model:file-list="fileList"
                                        accept=".txt,.epub"
                                        :before-upload="beforeUpload"
                                >
                                    <a-button v-if="fileList.length===0">
                                        <upload-outlined></upload-outlined>
                                        选择文件
                                    </a-button>
                                </a-upload>
                            </diV>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="封面：" name="novelImg" :label-col="{span: 8}">
                            <a-upload
                                    :before-upload="beforeUploadImg"
                                    accept=".jpg, .jpeg, .png"
                                    list-type="picture-card"
                                    v-model:file-list="novelImgFiles"
                                    @preview="handlePreview"
                            >
                                <div v-if="novelImgFiles.length < 1">
                                    <plus-outlined />
                                    <div class="ant-upload-text">点击上传封面</div>
                                </div>
                            </a-upload>
                            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                                <img alt="example" style="width: 100%" :src="previewImage" />
                            </a-modal>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24">
                        <a-form-item label="小说描述：" name="novelDesc" :label-col="{span: 4}">
                            <a-textarea
                                    showCount
                                    allowClear
                                    :maxlength=500
                                    :autoSize="{ minRows: 3, maxRows: 3 }"
                                    v-model:value="novelFormData.novelDesc"
                                    :rows="3"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24">
                        <a-button type="primary" @click="uploadSingleFile" :loading="!uploadStatus">上传</a-button>
                        <a-button style="margin-left: 5px" @click="showSingleFile(false)">取消</a-button>
                    </a-col>
                </a-row>
            </a-form>
        </div>
    </a-modal>
    <a-modal
            v-model:visible="showBatchModal"
            :closable="uploadStatus"
            :maskClosable="false"
            title="批量上传"
            :footer="null"
            @cancel="showBatchFile(false)"
            style="text-align: center"
    >
        <div>
            <div style="max-height: 250px;overflow-y: auto;padding: 0 15%">
                <a-upload
                        v-model:file-list="fileList"
                        :multiple="true"
                        accept=".txt,.epub"
                        :before-upload="beforeUpload"
                        @change="handleChange"
                >
                    <a-button>
                        <upload-outlined></upload-outlined>
                        选择文件
                    </a-button>
                </a-upload>
                <p v-if="fileList.length===0" style="margin-top: 5px">
                        只能上传txt,epub文件
                </p>
            </div>
            <a-row style="text-align: center;margin-top: 20px">
                <a-col :span="24" >
                    <a-button type="primary" @click="uploadFiles" :loading="!uploadStatus">上传</a-button>
                </a-col>
            </a-row>
        </div>
    </a-modal>
</template>

<script>
    import {ref, reactive, toRefs, toRaw, createVNode,inject } from 'vue'
    import {Modal} from 'ant-design-vue'
    import { QuestionCircleOutlined } from '@ant-design/icons-vue';
    import api from '../../api/api'
    import util from '../../utils/util'

    export default {
        name: "UploadNovel",
        props: {
            showUploadModal: {
                type: Boolean,
                default: false,
            },
            seriesInfo:{
                type:Object,
                default:{},
            }
        },
        components: {QuestionCircleOutlined},
        setup(props,content){
            const state = reactive({
                showSingleModal: false,
                showBatchModal: false,
                fileList: [],
                novelFormData: {
                    novelName: '',
                    publicTime: '',
                    novelOrder: '',
                    novelDesc: '',
                },
                novelImgFiles: [],
                previewVisible: false,
                previewImage: '',
                uploadStatus: true,
            })
            const resetPage = () =>{
                state.showSingleModal= false
                state.showBatchModal= false
                state.fileList= []
                state.novelFormData= {
                    novelName: '',
                    publicTime: '',
                    novelOrder: '',
                    novelDesc: '',
                }
                state.novelImgFiles= []
                state.previewVisible= false
                state.previewImage= ''
                state.uploadStatus= true
            }
            // 单文件上传
            const showSingleFile = (flag) => {
                state.fileList = []
                state.showSingleModal = flag
            }
            // 多文件上传
            const showBatchFile = (flag) => {
                state.fileList = []
                state.showBatchModal = flag
            }
            // 选择文件
            const beforeUpload = (file,fileList) => {
                return false;
            }
            const handleChange = (info) => {
                let fileList = info.fileList
                let file = info.file
                let nameList= []
                let reFileList = []
                let flag = false
                fileList.forEach(item=>{
                    if(nameList.indexOf(item.name)!==-1){
                        if(item.name === file.name){
                            flag = true
                        }
                    }else {
                        nameList.push(item.name)
                        reFileList.push(item)
                    }
                })
                if(flag){
                    util.info("请勿上传重复文件:" + file.name)
                }
                state.fileList = reFileList
            }
            // 批量上传提交
            const uploadFiles = () => {
                util.confirm('上传文件','是否批量上传文件(根据上传文件的大小和数量，上传时间会非常长，上传时请勿取消)',()=>{
                    state.uploadStatus=false
                    let formData = new FormData();
                    formData.append("seriesId",props.seriesInfo.seriesId)
                    state.fileList.forEach(e=> {
                        formData.append("files",e.originFileObj)
                    })
                    api.novelApi.batchUploadNovel(formData).then(res=>{
                        state.uploadStatus=true
                        util.success("上传成功")
                        success();
                    })
                })
            }
            // 单文件上传表单
            const volumeFormRef = ref();
            const volumeRules = {
            }
            const uploadSingleFile = () => {
                if(state.fileList.length===0){
                    util.info("请选择文件")
                }else {
                    state.uploadStatus=false
                    let formData = new FormData();
                    formData.append("seriesId",props.seriesInfo.seriesId)
                    formData.append("novelName",state.novelFormData.novelName)
                    formData.append("publicTime",state.novelFormData.publicTime?state.novelFormData.publicTime.format('YYYY-MM-DD'):'')
                    formData.append("novelOrder",state.novelFormData.novelOrder)
                    formData.append("novelDesc",state.novelFormData.novelDesc)
                    formData.append("novelFile",state.fileList[0].originFileObj)
                    if(state.novelImgFiles.length>0){
                        formData.append("imgFile",state.novelImgFiles[0].originFileObj)
                    }
                    api.novelApi.addNovel(formData).then(res=>{
                        state.uploadStatus=true
                        util.success("上传成功")
                        success();
                    }).catch(err=>{})
                }
            }
            // 选择图片
            const beforeUploadImg = (file,fileList) => {
                return false;
            }
            // 取消预览
            const handleCancel = () => {
                state.previewVisible = false;
            }
            // 获取图片Base64
            const getBase64 = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            }
            // 封面预览
            const handlePreview = async (file) => {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                state.previewImage = file.url || file.preview;
                state.previewVisible = true;
            }

            const closeForm = () =>{
                content.emit('closeForm',false)
            }
            const success = () =>{
                resetPage()
                content.emit('success')
            }
            return{
                ...toRefs(state),
                volumeRules,
                volumeFormRef,
                closeForm,
                showSingleFile,
                showBatchFile,
                beforeUpload,
                uploadFiles,
                beforeUploadImg,
                handlePreview,
                handleCancel,
                handleChange,
                uploadSingleFile,
            }
        }
    }
</script>

<style scoped>

</style>