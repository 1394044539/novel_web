<template>
    <a-modal
            v-model:visible="showUpdateNovel"
            title="编辑小说"
            :footer="null"
            @cancel="closeForm"
            width="800px"
    >
        <a-form :model="novelFormData"
                ref="novelFormRef"
                :rules="novelRules">
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
                    <a-form-item label="封面：" name="volumeImg" :label-col="{span: 8}">
                        <a-upload
                                :before-upload="beforeUpload"
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
                                :autoSize="{ minRows: 5, maxRows: 5 }"
                                v-model:value="novelFormData.novelDesc"
                                :rows="5"/>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="24" style="text-align: center">
                    <a-button type="primary" @click="updateNovel">保存</a-button>
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
        name: "UpdateNovel",
        props:{
            showUpdateNovel:{
                type:Boolean,
                default: false
            },
            novelInfo:{
                type: Object
            }
        },
        setup(props,content){
            const state = reactive({
                // showUpdateNovel: false,
                novelFormData:{},
                novelImgFiles: [],
                previewVisible: false,
                previewImage: ''
            })
            const novelRules = {}
            watch(()=>props.showUpdateNovel,(newV,oldV)=>{
                if(newV){
                    state.novelFormData = { ...props.novelInfo }
                    state.novelImgFiles = []
                }
            })
            const closeForm = () => {
                content.emit("closeForm",false)
            }
            const updateNovel = () => {
                let formData = new FormData();
                formData.append("seriesId",props.novelInfo.seriesId)
                formData.append("novelId",props.novelInfo.novelId)
                formData.append("novelName",state.novelFormData.novelName)
                if(state.novelFormData.publicTime){
                    let time = state.novelFormData.publicTime
                    time = typeof time === 'string' ?time : time.format('YYYY-MM-DD')
                    formData.append("publicTime",time);
                }
                formData.append("novelOrder",state.novelFormData.novelOrder)
                formData.append("novelDesc",state.novelFormData.novelDesc)
                if(state.novelImgFiles.length>0){
                    formData.append("imgFile",state.novelImgFiles[0].originFileObj)
                }
                api.novelApi.updateNovel(formData).then(res=>{
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
                novelRules,
                handleCancel,
                handlePreview,
                beforeUpload,
                updateNovel
            }
        }
    }
</script>

<style scoped>

</style>