<template>
    <a-layout style="min-height: 100%">
        <a-layout-header class="header" :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
            <div class="logo" @click="jumpMain">没有名字的系统</div>
            <div style="display: flex">
                <div style="margin-right: 25px">
                    <a-breadcrumb style="line-height: 64px">
                        <template #separator><span style="color: #ffffff">|</span></template>
                        <a-breadcrumb-item href="javascript:void(0);">
                            <span>
                                <a-dropdown placement="bottomCenter">
                                    <a style="color: #ffffff;font-size: 16px" @mouseenter="getHistoryList('0')" @click.prevent>历史</a>
                                    <template #overlay>
                                      <a-menu style="margin-top: 20px">
                                        <a-menu-item v-for="item in markList">
                                          <span @click.native="alert('测试')">1st menu item</span>
                                        </a-menu-item>
                                      </a-menu>
                                    </template>
                                </a-dropdown>
                            </span>
                        </a-breadcrumb-item>
                        <a-breadcrumb-item href="javascript:void(0);">
                            <a-dropdown placement="bottomCenter">
                                <a style="color: #ffffff;font-size: 16px" @click.prevent @mouseenter="getHistoryList('1')">书签</a>
                                <template #overlay>
                                    <a-menu style="margin-top: 20px">
                                        <a-menu-item v-for="item in markList">
                                            <span @click.native="alert('测试')">1st menu item</span>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </a-breadcrumb-item>
                    </a-breadcrumb>
                </div>
                <a-dropdown placement="bottomCenter">
                    <a class="ant-dropdown-link" @click.prevent>
                        <span style="margin-right: 15px">
                            {{ $store.state.userName }}
                        </span>
                        <a-badge :count="0">
                            <a-avatar shape="square">
                                <template #icon>
                                    <UserOutlined/>
                                </template>
                            </a-avatar>
                        </a-badge>
                    </a>
                    <template #overlay>
                        <a-menu @click="handleMenuClick">
                            <a-menu-item key="MyNovel">
                                <AppstoreOutlined />
                                小说管理
                            </a-menu-item>
                            <a-menu-item key="InfoSetting">
                                <SettingOutlined />
                                个人信息
                            </a-menu-item>
                            <a-menu-divider/>
                            <a-menu-item key="logout">
                                <LogoutOutlined/>
                                退出登录
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </a-layout-header>
        <a-layout-content :style="{ marginTop: '64px',paddingBottom: '40px',paddingTop: '20px',paddingLeft: '180px',paddingRight: '180px'}">
            <router-view/>
        </a-layout-content>
        <a-layout-footer class="main-footer">
            <div class="main-footer-span">
                <icon-component @click="showFeedback('1')" style="margin-right: 3px" name="QuestionCircleOutlined"/><span @click="showFeedback('1')">意见反馈</span>
                <icon-component @click="showFeedback('0')" style="margin-right: 3px" name="InfoCircleOutlined"/><span @click="showFeedback('0')">bug反馈</span>
                <icon-component @click="jumpNotice()" style="margin-right: 3px" name="AlignLeftOutlined"/><span @click="jumpNotice()">公告</span>
            </div>
            <div>
                @一只小NPC&nbsp;QQ:1394044539
            </div>
        </a-layout-footer>
    </a-layout>
    <FeedbackModal
        :feedback-show="feedbackShow"
        :feedback-type="feedbackType"
        @closeForm="closeFeedback"
    />
    <a-modal
            v-model:visible="showNotice"
            :maskClosable="false"
            title="新公告"
            :footer="null"
            @cancel="closeForm"
            width="600px"
    >
        <div style="text-align: center">
            <h2>{{notice.noticeTitle}}</h2>
            <div>
                {{notice.noticeContent}}
            </div>
        </div>
        {{notice.content}}
    </a-modal>
</template>

<script>
    import { createVNode,reactive,toRefs,onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    import IconComponent from "../../components/common/IconComponent";
    import { QuestionCircleOutlined } from '@ant-design/icons-vue';
    import {Modal} from "ant-design-vue";
    import api from "../../api/api"
    import util from "../../utils/util"
    import FeedbackModal from "../../components/system/FeedbackModal";

    export default {
        name: "MainPage",
        components: {FeedbackModal, IconComponent,QuestionCircleOutlined},
        setup(){
            const state=reactive({
                historyList: [],
                markList: [],
                feedbackShow: false,
                feedbackType: '',
                showNotice: false,
                notice: {}
            })
            const route = useRouter()
            const store = useStore()
            onMounted(()=>{
                getOpenNotice();
            })
            const getOpenNotice = () => {
                api.sysApi.getOpenNotice().then(res=>{
                    if(res){
                        state.showNotice = true
                        state.notice = res
                    }
                })
            }

            const jumpMain = () => {
                route.push("/mainPage")
            }
            //右上角用户信息部分
            const getHistoryList = (type) => {
                let param = {
                    page: 1,
                    pageSize: 5,
                    recordType: type
                }
                api.novelApi.getHistoryList(param).then(res=>{
                    if(type === '0'){
                        state.historyList = res.records
                    }else if(type === '1'){
                        state.markList = res.records
                    }
                })
            }
            const handleMenuClick = ({key}) => {
                if (key === 'logout') {
                    util.confirm('退出','确认退出登录？',()=>{
                        return new Promise((resolve, reject) => {
                                //请求后台
                                api.userApi.logout().then(res => {
                                    util.success("退出成功！")
                                    localStorage.clear()
                                    store.commit('clearStore')
                                    resolve()
                                }).catch(err => {
                                    reject()
                                })
                            }).then(() => {
                                route.push({name: 'Login'})
                            }).catch(() => {
                            });
                    })
                }else {
                    route.push({
                        name: key
                    })
                }
            }

            const showFeedback = (type) => {
                state.feedbackShow = true
                state.feedbackType = type
            }

            const closeFeedback = () => {
                state.feedbackShow = false
            }

            const jumpNotice = () => {
                route.push("noticeList")
            }

            const closeForm = () => {
                state.showNotice = false
            }

            return{
                ...toRefs(state),
                handleMenuClick,
                jumpMain,
                getHistoryList,
                showFeedback,
                closeFeedback,
                jumpNotice,
                closeForm,
            }
        }
    }
</script>

<style scoped lang="less">

    .header{
        display: flex;
        justify-content: space-between;
    }

    .logo {
        width: 120px;
        height: 32px;
        line-height: 32px;
        margin: 16px 24px 16px 0;
        background: rgba(255, 255, 255, 0.3);
        color: #fff;
        text-align: center;
        letter-spacing: 2px;
        font-weight: bold;
        cursor: pointer;
    }

    .ant-row-rtl .logo {
        float: right;
        margin: 16px 0 16px 24px;
    }

    .main-footer{
        display: flex;
        justify-content: space-between;
        text-align: center;
        position: fixed;
        clear: both;
        width: 100%;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #ffffff;
        height: 40px;
        padding-top: 8px;

        .main-footer-span{
            span{
                cursor: pointer;
                margin-right: 10px;
                font-size: 16px;
                color: #999999;
            }
        }
    }


</style>