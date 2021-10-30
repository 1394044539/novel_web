<template>
    <div>
        <a-table :pagination="pagination" :columns="columns" :data-source="regInfoData">
            <template #registerStatus="{text,record,index}">
                {{getRegisterStatus(text)}}
            </template>
            <template #registerMessage="{text,record,index}">
                <a-tooltip>
                    <template #title>{{text}}</template>
                    <div class="custom-three-ellipsis">{{text}}</div>
                </a-tooltip>
            </template>
            <template #remark="{text,record,index}">
                <a-tooltip>
                    <template #title>{{text}}</template>
                    <div class="custom-three-ellipsis">{{text}}</div>
                </a-tooltip>
            </template>
            <template #action="{text,record,index}">
                <a-button v-if="record.registerStatus==='0'" size="small" type="primary" @click="createRegInfo(record)">生成注册信息</a-button>
                <a-button v-if="record.registerStatus==='1'" size="small" type="primary" @click="showRegisterInfo(true,record)">查看注册消息</a-button>
                <a-button v-if="record.registerStatus==='3'" size="small" type="primary" @click="createRegInfo(record)" >重新生成注册信息</a-button>
            </template>
        </a-table>
        <a-modal
                v-model:visible="showRegister"
                title="注册信息"
                :footer="null"
                @cancel="showRegisterInfo(false)"
                width="600px"
        >
            <div style="text-align: center">
                <div>手机号"{{regData.phone}}”的注册信息为</div>
                <div style="margin: 5px 10%">
                    <a-alert :message="regData.remark" type="info" />
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import {reactive,toRefs,onMounted,createVNode} from 'vue'
    import api from '../../../api/api'
    import util from '../../../utils/util'
    import {Modal} from "ant-design-vue";
    import { QuestionCircleOutlined } from '@ant-design/icons-vue';
    import '../../../common/index.less'

    export default {
        name: "RegInfoTab",
        setup(props,content){
            const state=reactive({
                page: '1',
                pageSize: '10',
                regInfoData: [],
                showRegister: false,
                regData: {}
            })

            onMounted(()=>{
                getRegInfoList()
            })

            const getRegInfoList= () => {
                let param = {
                    page: state.page,
                    pageSize: state.pageSize
                }
                api.userApi.getApplyRegisterList(param).then(res=>{
                    state.regInfoData=res.records
                })
            }

            const columns = [
                {
                    title: '申请手机',
                    dataIndex: 'phone',
                    key: 'phone',
                    align: 'center',
                    width: 150
                },
                {
                    title: '申请消息',
                    dataIndex: 'registerMessage',
                    key: 'registerMessage',
                    align: 'center',
                    width: 200,
                    slots: {customRender: 'registerMessage'}
                },
                {
                    title: '注册信息',
                    dataIndex: 'remark',
                    key: 'remark',
                    align: 'center',
                    width: 200,
                    slots: {customRender: 'remark'}
                },
                {
                    title: '申请状态',
                    dataIndex: 'registerStatus',
                    key: 'registerStatus',
                    align: 'center',
                    width: 100,
                    slots: {customRender: "registerStatus"}
                },
                {
                    title: '过期时间',
                    dataIndex: 'expireTime',
                    key: 'expireTime',
                    align: 'center',
                    width: 150
                },
                {
                    title: '注册用户账号',
                    dataIndex: 'accountName',
                    key: 'accountName',
                    align: 'center',
                    width: 150
                },
                {
                    title: '注册用户名称',
                    dataIndex: 'userName',
                    key: 'userName',
                    align: 'center',
                    width: 150
                },
                {
                    title: '用户注册时间',
                    dataIndex: 'userCreateTime',
                    key: 'userCreateTime',
                    align: 'center',
                    width: 150
                },
                {
                    title: '申请日期',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    align: 'center',
                    width: 150
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 200,
                    align: 'center',
                    slots: {
                        customRender: 'action',
                    },
                }
            ]
            const pagination = {
                current: state.page,
                pageSize: state.pageSize,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],//每页中显示的数据
                showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                onShowSizeChange: (current, pageSize) => {}, // 改变每页数量时更新显示
                onChange:(page,pageSize)=> {},//点击页码事件
            }

            // 0：待审批，1：已发送，2：已注册；3：已作废
            const getRegisterStatus = (flag) => {
                switch (flag) {
                    case '0':
                        return '待审批';
                    case '1':
                        return '已发送';
                    case '2':
                        return '已注册';
                    case '3':
                        return '已作废';
                    default:
                        return '未知';
                }
            }
            // 创建注册信息或生成发送
            const createRegInfo = (data) => {
                Modal.confirm({
                    title: '创建注册信息',
                    content: '是否生成注册信息',
                    icon:createVNode(QuestionCircleOutlined),
                    okText: '确认',
                    cancelText: '取消',
                    onOk(){
                        api.userApi.createRegInfo({registerId:data.registerId}).then(res=>{
                            util.success("发送成功")
                            getRegInfoList()
                        })
                    },
                })
            }

            // 打开弹窗
            const showRegisterInfo = (flag,data={}) => {
                state.showRegister = flag
                state.regData = data
            }

            return{
                ...toRefs(state),
                columns,
                pagination,
                getRegisterStatus,
                createRegInfo,
                showRegisterInfo,
            }
        }
    }
</script>

<style scoped>

</style>