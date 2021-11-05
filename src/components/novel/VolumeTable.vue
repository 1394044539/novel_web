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
                    <a-button type="primary">上传</a-button>
                    <a-button style="margin-left: 5px" type="primary">修改</a-button>
                    <a-button style="margin-left: 5px">删除</a-button>
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
    </a-modal>
</template>

<script>
    import {reactive, toRefs, watch} from "vue";
    import api from '../../api/api'
    import TransferOrder from "./TransferOrder";

    export default {
        name: "VolumeTable",
        components: {TransferOrder},
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
                showTransfer: false
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

            return{
                ...toRefs(state),
                closeForm,
                onSelectChange,
                columns,
                showTransferOrder,
                successOrder,
            }
        }
    }
</script>

<style scoped>

</style>