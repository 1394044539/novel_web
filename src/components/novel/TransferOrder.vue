<template>
    <div>
        <a-modal
            v-model:visible="showTransfer"
            :maskClosable="false"
            title="排序"
            :footer="null"
            @cancel="closeForm"
            width="600px"
        >
            <p>请按顺序调整新规则，且需要全部选完</p>
            <a-transfer
                    :data-source="mockData"
                    :listStyle="{width: '250px'}"
                    :titles="['原排序', '结果排序']"
                    :locale="{itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '请输入搜索内容' }"
                    :target-keys="targetKeys"
                    :selected-keys="selectedKeys"
                    :render="item => item.title"
                    @change="handleChange"
                    @selectChange="handleSelectChange"
                    @scroll="handleScroll"
            />
            <a-row style="text-align: center;margin-top: 20px">
                <a-col :span="24">
                    <a-button @click="closeForm">取消</a-button>
                    <a-button @click="reOrder" style="margin-left: 15px" type="primary" :disabled="mockData.length!==targetKeys.length">确定</a-button>
                </a-col>
            </a-row>
        </a-modal>
    </div>
</template>

<script>
    import { reactive,toRefs,watch,toRaw } from 'vue'
    import api from '../../api/api'
    import util from '../../utils/util'

    export default {
        name: "TransferOrder",
        props: {
            showTransfer: {
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
                mockData: [],
                targetKeys: [],
                selectedKeys: [],
            })

            watch(()=>props.showTransfer,(newV,oldV)=>{
                if(newV){
                    state.mockData=[]
                    props.novelList.forEach((item,index)=>{
                        state.mockData.push({
                            key: item.novelId,
                            title: item.novelName,
                            description: item.novelName,
                            disabled: false,
                        })
                    })
                }
            })
            const handleChange = (nextTargetKeys, direction, moveKeys) => {
                if(direction==='left'){
                    state.targetKeys = nextTargetKeys;
                }else {
                    state.targetKeys.push(...toRaw(moveKeys));
                }
            };

            const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
                state.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
            };

            const handleScroll = (direction, e) => {
            };
            // 关闭当前弹窗
            const closeForm = () => {
                state.targetKeys=[]
                state.selectedKeys=[]
                content.emit("closeForm",false)
            }
            const reOrder = () =>{
                let param = {
                    novelIdList: state.targetKeys
                }
                api.novelApi.updateOrder(param).then(res=>{
                    util.success("修改成功")
                    state.targetKeys=[]
                    state.selectedKeys=[]
                    content.emit("success")
                })
            }

            return{
                ...toRefs(state),
                handleChange,
                handleSelectChange,
                handleScroll,
                closeForm,
                reOrder,
            }
        }
    }
</script>

<style scoped>

</style>