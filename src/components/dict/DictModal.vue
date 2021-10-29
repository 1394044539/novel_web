<template>
    <div>
        <a-modal
                v-model:visible="showModal"
                :maskClosable="false"
                :title="title"
                :footer="null"
                @cancel="closeForm"
                width="600px"
        >
            <a-form :model="dictFormData"
                    ref="dictFormRef"
                    :rules="rules"
            >
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="字典编码" name="dictCode" :label-col="{span: 8}">
                            <a-input allowClear v-model:value="dictFormData.dictCode" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="字典名称" name="dictName" :label-col="{span: 8}">
                            <a-input allowClear v-model:value="dictFormData.dictName" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="字典类型" name="dictType" :label-col="{span: 8}">
                            <a-select
                                v-model:value="dictFormData.dictType"
                                placeholder="请选择字典类型"
                            >
                                <a-select-option value="0">字符串</a-select-option>
                                <a-select-option value="1">开关</a-select-option>
                                <a-select-option value="2">集合</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row v-if="dictFormData.dictType==='0'">
                    <a-col :span="24">
                        <a-form-item label="字典值" name="dictValue" :label-col="{span: 4}">
                            <a-input allowClear v-model:value="dictFormData.dictValue" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row v-if="dictFormData.dictType==='1'">
                    <a-col :span="12">
                        <a-form-item label="字典值" name="dictSwitch" :label-col="{span: 8}">
                            <a-switch
                                checked-children="开"
                                un-checked-children="关"
                                v-model:checked="dictFormData.dictSwitch"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row v-if="dictFormData.dictType==='2'" style="padding: 5px 5px 5px 0;background-color: #f5f6f7;margin-bottom: 5px">
                    <a-col :span="24" style="height: 30px">
                        <a-form-item label="字典参数" :label-col="{span: 4}">
                            <a-button type="primary" size="small" style="margin-left: 10px" @click="openDictParamModal(true,'addDictParam','新增参数')">新增</a-button>
                            <a-button type="primary" size="small" style="margin-left: 5px" @click="updateDictParamModal">修改</a-button>
                            <a-button size="small" style="margin-left: 5px" @click="deleteParam">删除</a-button>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-table :row-selection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
                                 size="small"
                                 :pagination="false"
                                 :data-source="dictParamData"
                                 :columns="columns"
                                 bordered>
                        </a-table>
                        <DictParamModal
                            :showParamModal="showDictParamModal"
                            :title="dictParamModalTitle"
                            :dictParamModalFlag = "dictParamModalFlag"
                            :dictParam="dictParam"
                            @closeForm = openDictParamModal
                            @submitParam = insertParam
                            @editParam=editParam
                        />
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24">
                        <a-form-item label="描述" name="dictDesc" :label-col="{span: 4}">
                            <a-textarea
                                    showCount
                                    allowClear
                                    :maxlength=500
                                    :autoSize="{ minRows: 3, maxRows: 3 }"
                                    v-model:value="dictFormData.dictDesc"
                                    :rows="3"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24" style="text-align: center">
                        <a-button type="primary" @click="insertDict">提交</a-button>
                        <a-button style="margin-left: 5px" @click="closeForm">取消</a-button>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import { ref,reactive,toRefs,toRaw,watch,createVNode } from 'vue'
    import DictParamModal from "./DictParamModal";
    import api from '../../api/api'
    import util from "../../utils/util";
    import {Modal} from "ant-design-vue";
    import { QuestionCircleOutlined } from '@ant-design/icons-vue';

    export default {
        name: "DictModal",
        components: {DictParamModal,QuestionCircleOutlined},
        props: {
            showModal: {
                type: Boolean,
                default: false,
            },
            title: String,
            updateDictId: String,
            modalFlag: String,
        },
        setup(props,content){
            const state = reactive({
                dictFormData: {
                    dictCode: '',
                    dictName: '',
                    dictValue: '',
                    dictType: '0',
                    dictSwitch: true,
                    dictDesc: '',
                },
                dictParamData: [],
                selectedRowKeys: [],
                selectedRows: [],
                showDictParamModal: false,
                dictParamModalFlag: '',
                dictParamModalTitle: '',
                dictParam: {},
            })
            //监听
            watch(()=>props.showModal,(newV,oldV)=>{
                if(newV){
                    if(props.modalFlag==='editDict'){
                        api.sysApi.getDictInfo({dictId:props.updateDictId}).then(res=>{
                            state.dictFormData = {
                                ...res
                            }
                            // 编辑开关
                            if(res.dictType==='1'){
                                state.dictFormData.dictSwitch = res.dictValue === '1'
                                state.dictFormData.dictValue = ''
                            }
                            // 编辑集合
                            if(res.dictType==='2'){
                                state.dictFormData.dictSwitch = true
                                res.paramList.forEach((value,index)=>{
                                    state.dictParamData.push({
                                        ...value,
                                        index
                                    })
                                })
                            }
                        })
                    }
                }else {
                    dictFormRef.value.resetFields();
                    state.dictParamData= []
                }
            })


            // 当前表单ref
            const dictFormRef=ref();
            // 当前表单校验
            const rules = {
                dictCode: [
                    {
                        required: true,
                        pattern: '^[a-z,A-Z,_]{1,30}$',
                        message: '字典编码必须是1-30位字母加下划线组合'
                    }
                ],
                dictName: [
                    {
                        required: true,
                        message: '请输入字典名称'
                    },
                    {
                        min: 1,
                        max: 30,
                        message: '字典名称长度请限制在1-30位',
                    }
                ],
                dictValue: [
                    {
                        required: true,
                        message: '请输入字典值',
                        validator: checkDictValue,
                    }
                ],
                dictSwitch: [
                    {
                        required: true,
                    }
                ]
            }
            let checkDictValue = async (rule, value) => {
                if(state.dictFormData.dictType==='0'){
                    if(value.length<1 || value.length>30){
                        return Promise.reject('字典值请限制在1-30位');
                    }
                }
                return Promise.resolve();
            }
            // 插入字典
            const insertDict = () => {
                dictFormRef.value.validate().then(()=>{
                    let param = {
                        ...toRaw(state.dictFormData)
                    }
                    if(state.dictFormData.dictType==='1'){
                        param.dictValue = param.dictSwitch?"1":"0"
                    }
                    if(state.dictFormData.dictType==='2'){
                        param.dictValue = ''
                        param.paramList = state.dictParamData
                    }
                    if(props.modalFlag==='addDict'){
                        api.sysApi.addDict(param).then(res=>{
                            dictFormRef.value.resetFields();
                            state.dictParamData=[];
                            content.emit("success")
                        })
                    }else if(props.modalFlag==='editDict'){
                        api.sysApi.updateDict(param).then(res=>{
                            dictFormRef.value.resetFields();
                            state.dictParamData=[];
                            content.emit("success")
                        })
                    }

                })
            }

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
            // 多选框
            const onSelectChange = (selectedRowKeys,selectedRows) => {
                state.selectedRowKeys = selectedRowKeys
                state.selectedRows = selectedRows
            }
            // 打开子项添加弹框
            const openDictParamModal = (showFlag,modalFlag='',modalTitle='') => {
                state.showDictParamModal = showFlag
                state.dictParamModalFlag = modalFlag
                state.dictParamModalTitle = modalTitle
            }
            // 修改子项
            const updateDictParamModal = ()=>{
                if(state.selectedRowKeys.length !== 1){
                    util.info("请勾选大类进行修改")
                }else {
                    state.dictParam=state.selectedRows[0]
                    openDictParamModal(true,'editDictParam','修改参数')
                }
            }
            // 子项添加回调方法
            const insertParam = (dictParam) => {
                let param = {
                    ...dictParam,
                    index: state.dictParamData.length
                }
                state.dictParamData.push(param)
                state.selectedRows = []
                state.selectedRowKeys = []
                openDictParamModal(false)
            }
            // 修改子项回调
            const editParam = (dictParam) => {
                let param = {
                    ...dictParam,
                }
                state.dictParamData.splice(dictParam.index,1,param)
                state.selectedRows = []
                state.selectedRowKeys = []
                openDictParamModal(false)
            }
            // 删除子项列表
            const deleteParam = () => {
                if(state.selectedRowKeys.length===0){
                    util.info('请选择要删除的参数')
                }else {
                    Modal.confirm({
                        title: '确认删除',
                        content: '是否删除选中子项',
                        icon:createVNode(QuestionCircleOutlined),
                        okText: '确认',
                        cancelText: '取消',
                        onOk(){
                            let arr=state.dictParamData
                            state.selectedRows.forEach(e=>{
                                delete arr[e.index]
                            })
                            let index=0;
                            let newArr=[];
                            arr.forEach((value,i)=>{
                                newArr.push({
                                    ...value,
                                    index:index
                                })
                                index++
                            })
                            state.dictParamData = newArr
                            state.selectedRowKeys = []
                            state.selectedRows = []
                        }
                    });
                }
            }

            // 关闭当前弹窗
            const closeForm = () => {
                dictFormRef.value.resetFields();
                state.dictParamData=[]
                content.emit("closeForm",false,props.modalFlag,props.title)
            }


            return{
                ...toRefs(state),
                closeForm,
                dictFormRef,
                columns,
                onSelectChange,
                openDictParamModal,
                updateDictParamModal,
                deleteParam,
                insertParam,
                editParam,
                insertDict,
                rules
            }
        }
    }
</script>

<style scoped>

</style>