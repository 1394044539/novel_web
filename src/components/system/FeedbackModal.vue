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
        </a-modal>
    </div>
</template>

<script>
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

            const closeForm = () => {
                content.emit("closeForm")
            }
            return{
                closeForm
            }
        }
    }
</script>

<style scoped>

</style>