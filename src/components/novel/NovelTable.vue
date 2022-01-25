<template>
    <a-modal
            v-model:visible="showNovelTable"
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
                    <a-button style="margin-left: 5px" @click="deleteNovel">删除</a-button>
                </a-col>
                <a-col :span="10" style="text-align: right">
                    <a-button type="primary" @click="showTransferOrder(true)">修改排序</a-button>
                </a-col>
            </a-row>
            <div style="height: 350px;overflow-y: auto;margin-top: 20px">
                <a-table size="small"
                         :row-selection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
                         :pagination="false"
                         :data-source="novelListData"
                         :columns="columns"
                         bordered>
                </a-table>
            </div>
        </div>
        <TransferOrder
                :novelList="novelListData"
                :showTransfer="showTransfer"
                @closeForm="showTransferOrder"
                @success="successOrder"
        />
        <UploadNovel
                :showUploadModal="showUpload"
                :seriesInfo="seriesInfo"
                @closeForm="showUploadModal"
                @success="reloadPage"
        />
    </a-modal>
</template>

<script>
    import {reactive, toRefs, watch} from "vue";
    import api from '../../api/api'
    import util from '../../utils/util'
    import TransferOrder from "./TransferOrder";
    import UploadNovel from "./UploadNovel";

    export default {
        name: "NovelTable",
        components: {UploadNovel, TransferOrder},
        props: {
            showNovelTable:{
                type: Boolean,
                default: false
            },
            seriesInfo: Object,
        },
        setup(props,content){
            const state = reactive({
                novelListData: [],
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
            watch(()=>props.showNovelTable,(newV,oldV)=>{
                if(newV){
                    getNovelList()
                }
            })
            const getNovelList = () => {
                let param = { seriesId: props.seriesInfo.seriesId}
                state.title = props.seriesInfo.seriesName + " 小说列表"
                api.novelApi.getNovelList(param).then(res=>{
                    state.novelListData = res
                })
            }

            const columns = [
                {
                    title: '小说名',
                    key: 'novelName',
                    dataIndex: 'novelName',
                },
            ]
            const showTransferOrder = (flag) =>{
                state.showTransfer = flag
            }
            const successOrder = () => {
                showTransferOrder(false)
                getNovelList()
            }
            const showUploadModal = (flag) => {
                state.showUpload = flag
            }
            const reloadPage = () => {
                showUploadModal(false)
                getNovelList()
            }
            // 删除小说
            const deleteNovel = () => {
                if(state.selectedRowKeys.length===0){
                    util.info("请选择要删除的小说")
                    return
                }
                util.confirm('确认删除','是否确认删除选中小说（相关数据会一并删除）',()=>{
                    return new Promise((resolve, reject) => {
                        let selectedRows = state.selectedRows.map(e=>e.novelId);
                        api.novelApi.deleteNovel(selectedRows).then(res=>{
                            util.success("删除成功")
                            getNovelList()
                            resolve()
                        })
                    })
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
                deleteNovel,
            }
        }
    }
</script>

<style scoped>

</style>