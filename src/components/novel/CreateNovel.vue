<template>
    <div>
        <a-modal
                v-model:visible="showCreateNovel"
                title="创建小说"
                :footer="null"
                @cancel="closeForm"
                width="800px"
        >
            <div style="padding-right: 10%">
                <a-form :model="formData"
                        :rules="rules"
                        ref="createNovelRef"
                >
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="小说名" name="novelName" :label-col="{span: 4}">
                                <a-input allowClear v-model:value="formData.novelName" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="作者" name="novelAuthor" :label-col="{span: 8}">
                                <a-input allowClear v-model:value="formData.novelAuthor" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="发布日期" name="publicTime" :label-col="{span: 8}">
                                <a-date-picker
                                        v-model:value="formData.publicTime"
                                        type="date"
                                        placeholder="发布时间"
                                        style="width: 100%"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="类型" name="typeCodeList" :label-col="{span: 4}">
                                <a-select
                                        allowClear
                                        v-model:value="formData.typeCodeList"
                                        mode="multiple"
                                        placeholder="选择小说类型">
                                    <a-select-option v-for="(item,index) in novelTypeList" :value="item.paramCode">{{item.paramValue}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="封面" name="novelImg" :label-col="{span: 4}">
                                <a-upload
                                        :before-upload="beforeUpload"
                                        accept=".jpg, .jpeg, .png"
                                        list-type="picture-card"
                                        v-model:file-list="fileList"
                                        @preview="handlePreview"
                                >
                                    <div v-if="fileList.length < 1">
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
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="简介" name="novelIntroduce" :label-col="{span: 4}">
                                <a-textarea
                                        showCount
                                        allowClear
                                        :maxlength=500
                                        :autoSize="{ minRows: 3, maxRows: 3 }"
                                        v-model:value="formData.novelIntroduce"
                                        :rows="3"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <div style="text-align: center">
                                <a-button type="primary" @click="createNovel">创建</a-button>
                                <a-button @click="closeForm" style="margin-left: 10px">取消</a-button>
                            </div>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import {reactive, ref,onMounted,toRefs} from "vue";
    import api from "../../api/api";
    import util from "../../utils/util";
    import {useRouter} from "vue-router";

    export default {
        name: "CreateNovel",
        props: {
            showCreateNovel: {
                default: false,
                type: Boolean,
            }
        },
        setup(props,content){
            const state = reactive({
                formData: {
                    novelName:'',
                    novelAuthor:'',
                    publicTime:'',
                    typeCodeList: [],
                    novelImg: '',
                    novelIntroduce: ''
                },
                novelTypeList: [],
                fileList: [],
                previewVisible: false,
                previewImage: ''
            })
            onMounted(()=>{
                getNovelType();
            })
            const getNovelType = () => {
                let param = {
                    dictCode: 'NOVEL_TYPE'
                }
                api.sysApi.getDictParamList(param).then(res=>{
                    state.novelTypeList=res
                })
            }
            //获取路由
            const route = useRouter();
            const createNovelRef=ref();
            const rules = {
                novelName: [
                    {
                        required: true,
                        message: '请填写小说名称'
                    }
                ]
            }
            // 关闭弹窗
            const closeForm = () => {
                createNovelRef.value.resetFields();
                state.formData.typeCodeList=[]
                state.fileList = []
                content.emit("closeForm");
            }
            // 上传前
            const beforeUpload = (file, fileList) => {
                return false
            }
            const handlePreview = async (file) => {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                state.previewImage = file.url || file.preview;
                state.previewVisible = true;
            }
            const handleCancel = () => {
                state.previewVisible = false;
            }
            const getBase64 = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            }
            // 提交表单
            const createNovel = () => {
                createNovelRef.value.validate().then(res=>{
                    let formData = new FormData();
                    debugger
                    formData.append("novelName",res.novelName);
                    formData.append("novelAuthor",res.novelAuthor);
                    formData.append("publicTime",res.publicTime?res.publicTime.format('YYYY-MM-DD'):'');
                    formData.append("typeCodeList",res.typeCodeList);
                    if(state.fileList.length>0){
                        formData.append("imgFile",state.fileList[0].originFileObj);
                    }
                    formData.append("novelIntroduce",res.novelIntroduce);
                    api.novelApi.createNovel(formData).then(res=>{
                        util.success("创建小说成功");
                        route.push({
                            name: 'NovelInfo',
                            query: {
                                novelId: res.novelId,
                            }
                        })
                    })
                }).catch(err=>{
                    console.log(err);
                })
            }
            return{
                ...toRefs(state),
                closeForm,
                createNovelRef,
                rules,
                createNovel,
                beforeUpload,
                handlePreview,
                handleCancel,
            }
        }
    }
</script>

<style scoped>

</style>