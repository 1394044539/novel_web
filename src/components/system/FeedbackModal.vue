<template>
    <div>
        <a-modal
                v-model:visible="feedbackShow"
                :maskClosable="false"
                :title="feedbackType==='0'?'bug反馈':'意见反馈'"
                :footer="null"
                @cancel="closeForm"
                width="600px"
        >
            <div>
                <a-form :model="formData"
                        ref="formRef"
                        :rules="rules">
                    <a-row>
                        <a-col :span="24">
                            <a-form-item name="feedbackTitle">
                                <a-input allowClear v-model:value="formData.feedbackTitle" placeholder="输入标题" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="24">
                            <a-form-item name="feedbackContent">
                                <a-textarea allowClear v-model:value="formData.feedbackContent" placeholder="输入内容" :rows="8" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row style="text-align: center">
                        <a-col :span="24">
                            <a-button type="primary" @click="submit">提交反馈</a-button>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import {reactive,toRefs,ref } from 'vue'
    import util from '../../utils/util'
    import api from '../../api/api'

    export default {
        name: "FeedbackModal",
        props:{
            feedbackType:String,
            feedbackShow:{
                type:Boolean,
                default: false,
            }
        },
        setup(props,content){
            const state = reactive({
                formData: {
                    feedbackTitle: '',
                    feedbackContent: '',
                },
            })
            const formRef = ref();
            const rules = {
                feedbackTitle:[
                    {
                        required: true,
                        message: '请输入标题',
                    }
                ],
                feedbackContent:[
                    {
                        required: true,
                        message: '请输入内容',
                    }
                ]
            }

            const submit = () => {
                formRef.value.validate().then(()=>{
                    let title = props.feedbackType==='1'?'提交意见反馈':'提交bug反馈'
                    let content = props.feedbackType==='1'?'是否提交意见反馈？':'是否提交bug反馈？'
                    util.confirm(title,content,()=>{
                        let param = {
                            ...state.formData,
                            feedbackType: props.feedbackType,
                            handleStatus: '0'
                        }
                        api.sysApi.addFeedback(param).then(res=>{
                            util.success("提交成功！感谢您的对系统的帮助")
                            closeForm()
                        })
                    })
                })
            }

            const closeForm = () => {
                state.formData = {
                    title: '',
                    content: '',
                }
                content.emit("closeForm")
            }
            return{
                ...toRefs(state),
                formRef,
                rules,
                closeForm,
                submit
            }
        }
    }
</script>

<style scoped>

</style>