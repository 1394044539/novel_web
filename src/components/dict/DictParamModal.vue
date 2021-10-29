<template>
    <div>
        <a-modal
                v-model:visible="showParamModal"
                :title="title"
                :footer="null"
                @cancel="closeForm"
                width="600px"
        >
            <a-form :model="dictParamFormData"
                    ref="dictParamFormRef"
                    :rules="paramRules"
            >
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="参数编码" name="paramCode" :label-col="{span: 8}">
                            <a-input allowClear v-model:value="dictParamFormData.paramCode" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="参数名称" name="paramName" :label-col="{span: 8}">
                            <a-input allowClear v-model:value="dictParamFormData.paramName" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="参数值" name="paramValue" :label-col="{span: 8}">
                            <a-input allowClear v-model:value="dictParamFormData.paramValue" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="参数排序" name="paramOrder" :label-col="{span: 8}">
                            <a-input-number allowClear v-model:value="dictParamFormData.paramOrder" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24">
                        <a-form-item label="描述" name="paramDesc" :label-col="{span: 4}">
                            <a-textarea
                                    showCount
                                    allowClear
                                    :maxlength=500
                                    :autoSize="{ minRows: 3, maxRows: 3 }"
                                    v-model:value="dictParamFormData.paramDesc"
                                    :rows="3"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row >
                    <a-col :span="24" style="text-align: center">
                        <a-button type="primary" size="small" @click="insertParam">保存</a-button>
                        <a-button style="margin-left: 5px" size="small" @click="closeForm">取消</a-button>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import {ref, reactive, toRefs, toRaw} from "vue";

    export default {
        name: "DictParamModal",
        props: {
            showParamModal: {
                type: Boolean,
                default: false,
            },
            title: String,
        },
        setup(props,content){
            const state = reactive({
                dictParamFormData: {
                    paramCode: '',
                    paramName: '',
                    paramValue: '',
                    paramOrder: '',
                    paramDesc: '',
                }
            })

            const paramRules = {
                paramCode: [
                    {
                        required: true,
                        pattern: '^[a-z,A-Z,_,0-9]{1,30}$',
                        message: '参数编码必须是1-30位字母数字加下划线组合'
                    }
                ],
                paramName: [
                    {
                        required: true,
                        message: '请输入参数名称'
                    },
                    {
                        min: 1,
                        max: 30,
                        message: '参数名称长度请限制在1-30位',
                    }
                ],
                paramValue: [
                    {
                        required: true,
                        message: '请输入参数值'
                    },
                    {
                        min: 1,
                        max: 30,
                        message: '参数值长度请限制在1-30位',
                    }
                ],
                paramOrder: [
                    {
                        required: true,
                        message: '请选择顺序'
                    }
                ]
            }

            const dictParamFormRef = ref();

            const insertParam = () => {
                dictParamFormRef.value.validate().then(()=>{
                    content.emit("submitParam",toRaw(state.dictParamFormData))
                    dictParamFormRef.value.resetFields();
                })

            }
            const closeForm = () => {
                dictParamFormRef.value.resetFields();
                content.emit("closeForm",false)
            }

            return{
                ...toRefs(state),
                closeForm,
                dictParamFormRef,
                insertParam,
                paramRules
            }
        }
    }
</script>

<style scoped>

</style>