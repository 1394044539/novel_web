<template>
    <a-modal
            v-model:visible="showUpdateModal"
            :maskClosable="false"
            title="修改小说"
            :footer="null"
            @cancel="closeForm"
            width="600px"
    >
        {{novelInfo}}
        <a-button @click="updateNovelSubmit">提交</a-button>
    </a-modal>
</template>

<script>
    import {computed, reactive, toRefs,watch} from 'vue'
    import util from '../../utils/util'

    export default {
        name: "UpdateNovel",
        props: {
            showUpdateModal: {
                type: Boolean,
                default: false,
            },
            novelInfo: Object
        },
        setup(props,content){
            const state = reactive({
                novelInfoForm: {}
            })
            watch(()=>props.showUpdateModal,(newV,oldV)=>{
                if(newV){
                    state.novelInfoForm = props.novelInfo
                }
            })
            const updateNovelSubmit = () => {
                console.log(state.novelInfoForm)
                util.success("修改成功！")
                success()
            }

            const closeForm = () => {
                content.emit('closeForm',false)
            }
            const success = () => {
                content.emit('success')
            }
            return{
                ...toRefs(state),
                closeForm,
                success,
                updateNovelSubmit
            }
        }
    }
</script>

<style scoped>

</style>