<template>
    <a-layout style="min-height: 100%">
        <a-layout-header class="header" :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
            <div class="logo">没有名字的系统</div>
            <div style="display: flex">
                <div style="margin-right: 25px">
                    <a-breadcrumb style="line-height: 64px">
                        <template #separator><span style="color: #ffffff">|</span></template>
                        <a-breadcrumb-item href="javascript:void(0);">
                            <span>
                                <a-dropdown placement="bottomCenter">
                                    <a style="color: #ffffff;font-size: 16px" @click.prevent>历史</a>
                                    <template #overlay>
                                      <a-menu style="margin-top: 20px">
                                        <a-menu-item>
                                          <span>1st menu item</span>
                                        </a-menu-item>
                                      </a-menu>
                                    </template>
                                </a-dropdown>
                            </span>
                        </a-breadcrumb-item>
                        <a-breadcrumb-item href="javascript:void(0);">
                            <a-dropdown placement="bottomCenter">
                                <a style="color: #ffffff;font-size: 16px" @click.prevent>书签</a>
                                <template #overlay>
                                    <a-menu style="margin-top: 20px">
                                        <a-menu-item>
                                            <span>1st menu item</span>
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
        <a-layout-content :style="{ marginTop: '64px',paddingBottom: '40px' }">
            <router-view/>
        </a-layout-content>
        <a-layout-footer class="main-footer">
            <div class="main-footer-span">
                <icon-component style="margin-right: 3px" name="QuestionCircleOutlined"/><span>意见反馈</span>
                <icon-component style="margin-right: 3px" name="InfoCircleOutlined"/><span>bug反馈</span>
                <icon-component style="margin-right: 3px" name="AlignLeftOutlined"/><span>公告</span>
            </div>
            <div>
                @一只小NPC&nbsp;QQ:1394044539
            </div>
        </a-layout-footer>
    </a-layout>
</template>

<script>
    import { createVNode,reactive,toRefs } from 'vue'
    import { useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    import IconComponent from "../../components/common/IconComponent";
    import { QuestionCircleOutlined } from '@ant-design/icons-vue';
    import {Modal} from "ant-design-vue";
    import api from "../../api/api"
    import util from "../../utils/util"

    export default {
        name: "MainPage",
        components: {IconComponent,QuestionCircleOutlined},
        setup(){
            const state=reactive({
            })
            const route = useRouter()
            const store = useStore()
            //右上角用户信息部分
            const handleMenuClick = ({key}) => {
                if (key === 'logout') {
                    Modal.confirm({
                        title: "退出",
                        content: "确认退出登录？",
                        icon: createVNode(QuestionCircleOutlined),
                        okText: '确认',
                        cancelText: '取消',
                        onOk() {
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
                        }
                    });
                }else {
                    route.push({
                        name: key
                    })
                }
            }

            return{
                ...toRefs(state),
                handleMenuClick,
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