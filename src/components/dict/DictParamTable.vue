<template>
    <div>
        <a-modal
                v-model:visible="showParamTable"
                :maskClosable="false"
                :title="title"
                :footer="null"
                @cancel="closeForm"
                width="600px"
        >
            <a-table size="small"
                     :pagination="false"
                     :data-source="dictParamData"
                     :columns="columns"
                     bordered>
            </a-table>
        </a-modal>
    </div>
</template>

<script>
    import {reactive, toRefs, watch} from "vue";
    import api from '../../api/api'

    export default {
        name: "DictParamTable",
        props: {
            showParamTable: {
                type: Boolean,
                default: false,
            },
            dictId: String
        },
        setup(props,content){
            const state=reactive({
                dictParamData: [],
                title: '子项列表',
            })
            // 监听字典id的变化
            watch(() => props.dictId, (newV, oldV) => {
                if(newV){
                    let param = {dictId: newV}
                    api.sysApi.getDictInfo(param).then(res=>{
                        state.dictParamData = res.paramList
                        state.title = res.dictName+state.title
                    })
                }
            })
            // 子项字典表头
            const columns = [
                {
                    title: '参数编码',
                    dataIndex: 'paramCode',
                    key: 'paramCode',
                },{
                    title: '参数名称',
                    dataIndex: 'paramName',
                    key: 'paramName',
                },{
                    title: "参数值",
                    dataIndex: "paramValue",
                    key: 'paramValue',
                },{
                    title: "排序",
                    dataIndex: "paramOrder",
                    key: "paramOrder",
                }
            ]
            const closeForm = () => {
                state.title='子项列表';
                state.dictParamData=[];
                content.emit('closeForm',false)
            }
            return{
                ...toRefs(state),
                closeForm,
                columns,
            }
        }
    }
</script>

<style scoped>

</style>