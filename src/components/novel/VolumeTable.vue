<template>
    <a-modal
            v-model:visible="showVolumeTable"
            :maskClosable="false"
            :title="title"
            :footer="null"
            @cancel="closeForm"
            width="600px"
    >
        <div>
            <a-row>
                <a-col :span="14">
                    <a-button type="primary" @click="showUploadModal(true)">上传</a-button>
                    <a-button style="margin-left: 5px" type="primary">修改</a-button>
                    <a-button style="margin-left: 5px" @click="deleteVolume">删除</a-button>
                </a-col>
                <a-col :span="10" style="text-align: right">
                    <a-button type="primary" @click="showTransferOrder(true)">修改排序</a-button>
                </a-col>
            </a-row>
            <div style="height: 350px;overflow-y: auto;margin-top: 20px">
                <a-table size="small"
                         :row-selection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
                         :pagination="false"
                         :data-source="volumeListData"
                         :columns="columns"
                         bordered>
                </a-table>
            </div>
        </div>
        <TransferOrder
                :novelVolumeList="volumeListData"
                :showTransfer="showTransfer"
                @closeForm="showTransferOrder"
                @success="successOrder"
        />
        <UploadVolume
                :showUploadModal="showUpload"
                @closeForm="showUploadModal"
                @success="reloadPage"
        />
    </a-modal>
</template>

<script>
    import {reactive, toRefs, watch,createVNode} from "vue";
    import api from '../../api/api'
    import util from '../../utils/util'
    import TransferOrder from "./TransferOrder";
    import UploadVolume from "./UploadVolume";
    import {Modal} from "ant-design-vue";
    import { QuestionCircleOutlined } from '@ant-design/icons-vue';

    export default {
        name: "VolumeTable",
        components: {UploadVolume, TransferOrder},
        props: {
            showVolumeTable:{
                type: Boolean,
                default: false
            },
            novelInfo: Object,
        },
        setup(props,content){
            const state = reactive({
                volumeListData: [],
                title: '分卷列表',
                selectedRowKeys: [],
                selectedRows: [],
                showTransfer: false,
                showUpload: false,
            })
            const onSelectChange = (selectedRowKeys,selectedRows) => {
                state.selectedRows=selectedRows
                state.selectedRowKeys=selectedRowKeys
            }
            const closeForm = () => {
                content.emit("closeForm",false)
            }
            watch(()=>props.showVolumeTable,(newV,oldV)=>{
                if(newV){
                    getVolumeList()
                }
            })
            const getVolumeList = () => {
                let param = { novelId: props.novelInfo.novelId}
                state.title = props.novelInfo.novelName + " 分卷列表"
                api.novelApi.getVolumeList(param).then(res=>{
                    state.volumeListData = res
                })
            }

            const columns = [
                {
                    title: '分卷名',
                    key: 'volumeName',
                    dataIndex: 'volumeName',
                },
            ]
            const showTransferOrder = (flag) =>{
                state.showTransfer = flag
            }
            const successOrder = () => {
                showTransferOrder(false)
                getVolumeList()
            }
            const showUploadModal = (flag) => {
                state.showUpload = flag
            }
            const reloadPage = () => {
                showUploadModal(false)
                getVolumeList()
            }
            // 删除分卷
            const deleteVolume = () => {
                if(state.selectedRowKeys.length===0){
                    util.info("请选择要删除的分卷")
                    return
                }
                Modal.confirm({
                    title: '确认删除',
                    content: '是否确认删除选中分卷（相关数据会一并删除）',
                    icon:createVNode(QuestionCircleOutlined),
                    okText: '确认',
                    cancelText: '取消',
                    onOk(){
                        return new Promise((resolve, reject) => {
                            let selectedRows = state.selectedRows.map(e=>e.volumeId);
                            api.novelApi.deleteVolume(selectedRows).then(res=>{
                                util.success("删除成功")
                                getVolumeList()
                                resolve()
                            })
                        })
                    }
                })
            }

            return{
                ...toRefs(state),
                closeForm,
                onSelectChange,
                columns,
                showTransferOrder,
                successOrder,
                showUploadModal,
                reloadPage,
                deleteVolume,
            }
        }
    }
</script>

<style scoped>

</style>