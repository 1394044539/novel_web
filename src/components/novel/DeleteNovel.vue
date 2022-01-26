<template>
    <a-modal
            v-model:visible="showDelete"
            :maskClosable="false"
            title="删除小说"
            :footer="null"
            @cancel="closeForm"
            width="600px"
    >
        <div style="height: 500px;overflow-y: auto">
            <a-table size="small"
                     :row-selection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
                     :pagination="false"
                     :data-source="novelList"
                     :columns="columns"
                     bordered>
            </a-table>
            <a-row style="text-align: center;margin-top: 20px">
                <a-col :span="24">
                    <a-button @click="closeForm">取消</a-button>
                    <a-button :loading="loadingSuccess" :disabled="selectedRowKeys.length===0" style="margin-left: 15px" type="primary" @click="confirmDelete">确定</a-button>
                </a-col>
            </a-row>
        </div>
    </a-modal>
</template>

<script>
    import {createVNode, reactive, toRefs} from 'vue'
    import { Modal } from 'ant-design-vue'
    import api from '../../api/api'
    import util from '../../utils/util'
    import { QuestionCircleOutlined } from '@ant-design/icons-vue';

    export default {
        name: "DeleteNovel",
        props: {
            showDelete: {
                type: Boolean,
                default: false,
            },
            novelList: {
                type: Array,
                default: [],
            }
        },
        setup(props,content){
            const state = reactive({
                selectedRowKeys: [],
                selectedRows: [],
                loadingSuccess: false,
            })
            const closeForm= () => {
                content.emit("closeForm",false)
            }
            const success = () => {
                content.emit("success")
            }

            const columns = [
                {
                    title: '小说名',
                    dataIndex: 'novelName',
                    key: 'novelName',
                },
                {
                    title: '上传时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                },
            ]
            const onSelectChange = (selectedRowKeys,selectedRows) => {
                state.selectedRows=selectedRows
                state.selectedRowKeys=selectedRowKeys
            }

            const confirmDelete = () =>{
                util.confirm('确认删除','是否确认删除选中小说（相关数据会一并删除）',()=>{
                    state.loadingSuccess = true
                    let selectedRows = state.selectedRows.map(e=>e.novelId);
                    api.novelApi.deleteNovel(selectedRows).then(res=>{
                        util.success("删除成功")
                        state.loadingSuccess = false
                        content.emit("success")
                    })
                })
            }

            return{
                ...toRefs(state),
                closeForm,
                success,
                columns,
                onSelectChange,
                confirmDelete,
            }
        }
    }
</script>

<style scoped>

</style>