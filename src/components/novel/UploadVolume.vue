<template>
    <a-modal
            v-model:visible="showUploadModal"
            title="上传分卷"
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
                    <a-button type="primary" @click="showSingleFile(true)">单文件上传</a-button>
                    <a-button style="margin-left: 10px" type="primary" @click="showBatchFile(true)">批量上传</a-button>
                </a-col>
            </a-row>
        </div>
    </a-modal>
    <a-modal
            v-model:visible="showSingleModal"
            title="单分卷上传"
            :footer="null"
            @cancel="showSingleFile(false)"
            style="text-align: center"
    >
    </a-modal>
    <a-modal
            v-model:visible="showBatchModal"
            title="批量上传"
            :footer="null"
            @cancel="showBatchFile(false)"
            style="text-align: center"
    >
    </a-modal>
</template>

<script>
    import {reactive,toRefs} from 'vue'
    import {} from 'ant-design-vue'
    import api from '../../api/api'
    import util from '../../utils/util'

    export default {
        name: "UploadVolume",
        props: {
            showUploadModal: {
                type: Boolean,
                default: false,
            }
        },
        setup(props,content){
            const state = reactive({
                showSingleModal: false,
                showBatchModal: false,
            })

            const showSingleFile = (flag) => {
                state.showSingleModal = flag
            }
            const showBatchFile = (flag) => {
                state.showBatchModal = flag
            }

            const closeForm = () =>{
                content.emit('closeForm',false)
            }
            return{
                ...toRefs(state),
                closeForm,
                showSingleFile,
                showBatchFile,
            }
        }
    }
</script>

<style scoped>

</style>