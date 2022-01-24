<template>
    <div>
        <a-modal
                v-model:visible="showCreateSeries"
                :title="modalFlag==='create'?'创建系列':'编辑系列'"
                :footer="null"
                @cancel="closeForm"
                width="800px"
        >
            <div style="padding-right: 10%">
                <a-form :model="formData"
                        :rules="rules"
                        ref="createSeriesRef"
                >
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="系列名" name="seriesName" :label-col="{span: 4}">
                                <a-input allowClear v-model:value="formData.seriesName" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="作者" name="seriesAuthor" :label-col="{span: 8}">
                                <a-input allowClear v-model:value="formData.seriesAuthor" />
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
                                        placeholder="选择系列类型">
                                    <a-select-option v-for="(item,index) in novelTypeList" :value="item.paramCode">{{item.paramValue}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="封面" name="seriesImg" :label-col="{span: 4}">
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
                            <a-form-item label="简介" name="seriesIntroduce" :label-col="{span: 4}">
                                <a-textarea
                                        showCount
                                        allowClear
                                        :maxlength=500
                                        :autoSize="{ minRows: 3, maxRows: 3 }"
                                        v-model:value="formData.seriesIntroduce"
                                        :rows="3"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <div style="text-align: center">
                                <a-button v-if="modalFlag==='create'" type="primary" @click="createNovel">创建</a-button>
                                <a-button v-if="modalFlag==='edit'" type="primary" @click="createNovel">修改</a-button>
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
    import {reactive, ref,onMounted,toRefs,watch} from "vue";
    import api from "../../api/api";
    import util from "../../utils/util";
    import {useRouter} from "vue-router";

    export default {
        name: "CreateSeries",
        props: {
            showCreateSeries: {
                default: false,
                type: Boolean,
            },
            modalFlag: {
                default: '', //create edit
                type: String,
            },
            seriesInfo: {
                type: Object,
            }
        },
        setup(props,content){
            const state = reactive({
                formData: {
                    seriesId: '',
                    seriesName:'',
                    seriesAuthor:'',
                    publicTime:'',
                    typeCodeList: [],
                    seriesImg: '',
                    seriesIntroduce: ''
                },
                novelTypeList: [],
                fileList: [],
                previewVisible: false,
                previewImage: ''
            })
            onMounted(()=>{
                getNovelType();
            })
            watch(()=>props.showCreateSeries,(newV,oldV)=>{
                if(newV && props.modalFlag==='edit'){
                    state.formData = {
                        ...state.formData,
                        ...props.seriesInfo,
                    }
                    if(props.seriesInfo.typeCodeList){
                        state.formData.typeCodeList = props.seriesInfo.typeCodeList
                    }
                }else if(newV && props.modalFlag==='create'){
                    state.formData = {
                        seriesName:'',
                        seriesAuthor:'',
                        publicTime:'',
                        typeCodeList: [],
                        seriesImg: '',
                        seriesIntroduce: ''
                    }
                }
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
            const createSeriesRef=ref();
            const rules = {
                seriesName: [
                    {
                        required: true,
                        message: '请填写系列名称'
                    }
                ]
            }
            // 关闭弹窗
            const closeForm = () => {
                createSeriesRef.value.resetFields();
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
                createSeriesRef.value.validate().then(res=>{
                    let formData = new FormData();
                    formData.append("seriesName",res.seriesName);
                    formData.append("seriesAuthor",res.seriesAuthor);
                    formData.append("seriesIntroduce",res.seriesIntroduce);
                    if(res.publicTime){
                        let time = typeof res.publicTime === 'string' ?res.publicTime : res.publicTime.format('YYYY-MM-DD')
                        formData.append("publicTime",time);
                    }
                    formData.append("typeCodeList",res.typeCodeList);
                    if(state.fileList.length>0){
                        formData.append("imgFile",state.fileList[0].originFileObj);
                    }
                    if(props.modalFlag==='create'){
                        api.novelApi.createSeries(formData).then(res=>{
                            util.success("创建系列成功");
                            route.push({
                                name: 'SeriesInfo',
                                query: {
                                    seriesId: res.seriesId,
                                }
                            })
                        })
                    }else {
                        formData.append("seriesId",props.seriesInfo.seriesId)
                        api.novelApi.updateSeries(formData).then(res=>{
                            state.formData.typeCodeList=[]
                            state.fileList = []
                            util.success("修改成功")
                            content.emit('success')
                        }).catch(err=>{})
                    }
                }).catch(err=>{
                    console.log(err);
                })
            }
            return{
                ...toRefs(state),
                closeForm,
                createSeriesRef,
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