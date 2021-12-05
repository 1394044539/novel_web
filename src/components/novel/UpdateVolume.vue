<template>
    <a-modal
            v-model:visible="showUpdateVolume"
            title="编辑分卷"
            :footer="null"
            @cancel="closeForm"
            width="800px"
    >
        <a-form :model="volumeFormData"
                ref="volumeFormRef"
                :rules="volumeRules">
            <a-row>
                <a-col :span="24">
                    <a-form-item label="分卷名：" name="volumeName" :label-col="{span: 4}">
                        <a-input allowClear v-model:value="volumeFormData.volumeName" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12">
                    <a-form-item label="发布时间：" name="publicTime" :label-col="{span: 8}">
                        <a-date-picker
                                v-model:value="volumeFormData.publicTime"
                                type="date"
                                placeholder="发布时间"
                                style="width: 100%"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="排序号：" name="volumeOrder" :label-col="{span: 8}">
                        <a-input-number allowClear style="width: 100%" v-model:value="volumeFormData.volumeOrder" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12">
                    <a-form-item label="封面：" name="volumeImg" :label-col="{span: 8}">
                        <a-upload
                                :before-upload="beforeUpload"
                                accept=".jpg, .jpeg, .png"
                                list-type="picture-card"
                                v-model:file-list="volumeImgFiles"
                                @preview="handlePreview"
                        >
                            <div v-if="volumeImgFiles.length < 1">
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
                    <a-form-item label="分卷描述：" name="volumeDesc" :label-col="{span: 4}">
                        <a-textarea
                                showCount
                                allowClear
                                :maxlength=500
                                :autoSize="{ minRows: 3, maxRows: 3 }"
                                v-model:value="volumeFormData.volumeDesc"
                                :rows="3"/>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="24" style="text-align: center">
                    <a-button type="primary" @click="updateVolume">保存</a-button>
                    <a-button style="margin-left: 5px" @click="closeForm">取消</a-button>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
    import {reactive,onMounted,toRefs,watch} from "vue";
    import api from "../../api/api";
    import util from "../../utils/util";
    import {useRouter} from "vue-router";

    export default {
        name: "UpdateVolume",
        props:{
            showUpdateVolume:{
                type:Boolean,
                default: false
            },
            volumeInfo:{
                type: Object
            }
        },
        setup(props,content){
            const state = reactive({
                showUpdateVolume: false,
                volumeFormData:{},
                volumeImgFiles: [],
                previewVisible: false,
                previewImage: ''
            })
            const volumeRules = {}
            watch(()=>props.showUpdateVolume,(newV,oldV)=>{
                if(newV){
                    state.volumeFormData = { ...props.volumeInfo }
                    state.volumeImgFiles = []
                }
            })
            const closeForm = () => {
                content.emit("closeForm",false)
            }
            const updateVolume = () => {
                let formData = new FormData();
                formData.append("novelId",props.volumeInfo.novelId)
                formData.append("volumeId",props.volumeInfo.volumeId)
                formData.append("volumeName",state.volumeFormData.volumeName)
                if(state.volumeFormData.publicTime){
                    let time = state.volumeFormData.publicTime
                    time = typeof time === 'string' ?time : time.format('YYYY-MM-DD')
                    formData.append("publicTime",time);
                }
                formData.append("volumeOrder",state.volumeFormData.volumeOrder)
                formData.append("volumeDesc",state.volumeFormData.volumeDesc)
                if(state.volumeImgFiles.length>0){
                    formData.append("imgFile",state.volumeImgFiles[0].originFileObj)
                }
                api.novelApi.updateVolume(formData).then(res=>{
                    util.success("修改成功！")
                    content.emit("success")
                })
            }
            const beforeUpload = (file, fileList) => {
                return false
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
            return{
                ...toRefs(state),
                closeForm,
                volumeRules,
                handleCancel,
                handlePreview,
                beforeUpload,
                updateVolume
            }
        }
    }
</script>

<style scoped>

</style>