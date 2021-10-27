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
                                    <a-select-option value="shanghai">Zone one</a-select-option>
                                    <a-select-option value="beijing">Zone two</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="封面" name="novelImg" :label-col="{span: 4}">
                                <a-input v-model:value="formData.novelImg" />
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
    import {reactive, ref} from "vue";
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
            //获取路由
            const route = useRouter();
            let formData = reactive({
                novelName:'',
                novelAuthor:'',
                publicTime:'',
                typeCodeList: [],
                novelImg: '',
                novelIntroduce: ''
            })
            const createNovelRef=ref();
            // 关闭弹窗
            const closeForm = () => {
                createNovelRef.value.resetFields();
                formData.typeCodeList=[]
                content.emit("closeForm");
            }
            // 提交表单
            const createNovel = () => {
                createNovelRef.value.validate().then(res=>{
                    let formData = new FormData();
                    formData.append("novelName",res.novelName);
                    formData.append("novelAuthor",res.novelAuthor);
                    formData.append("publicTime",res.publicTime?res.publicTime.format('YYYY-MM-DD'):'');
                    formData.append("typeCodeList",res.typeCodeList);
                    formData.append("novelImg",res.novelImg);
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
                formData,
                closeForm,
                createNovelRef,
                createNovel,
            }
        }
    }
</script>

<style scoped>

</style>