<template>
    <a-layout style=" height: 100vh;">
        <a-layout-header class="header">
            <div class="logo">没有名字的系统</div>
            <div style="float: right">
                <a-dropdown placement="bottomCenter" :overlay-style="{paddingTop:'20px'}">
                    <a class="ant-dropdown-link" @click.prevent>
                        <span style="margin-right: 15px">
                            {{ $store.state.userName }}
                        </span>
                            <a-badge :count="0">
                                <a-avatar shape="square">
                                    <template #icon><UserOutlined /></template>
                                </a-avatar>
                            </a-badge>
                        </a>
                    <template #overlay>
                        <a-menu @click="handleMenuClick">
                            <a-menu-divider />
                            <a-menu-item key="logout">
                                <LogoutOutlined />
                                退出登录
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </a-layout-header>
        <a-layout>
            <a-layout-sider width="200" style="background: #fff" v-model:collapsed="collapsed" collapsible>
                <a-menu
                        theme="dark"
                        mode="inline"
                        v-model:selectedKeys="selectedKeys"
                        v-model:openKeys="openKeys"
                        :style="{ height: '100%', borderRight: 0 }"
                        @click="switchMenu"
                >
                    <a-sub-menu key="Novel">
                        <template #title>
                            <user-outlined/>
                            <span>小说模块</span>
                        </template>
                        <a-menu-item key="MyNovel">我的书架</a-menu-item>
                        <a-menu-item key="NovelManager">小说管理</a-menu-item>
                        <a-menu-item key="UploadRecord">上传记录</a-menu-item>
                        <a-menu-item key="MarkList">书签列表</a-menu-item>
                        <a-menu-item key="HistoryRecord">历史记录</a-menu-item>
<!--                        <a-menu-item key="6">分享记录</a-menu-item>-->
                    </a-sub-menu>
                    <a-sub-menu key="UserCenter">
                        <template #title>
                            <laptop-outlined/>
                            <span>个人中心</span>
                        </template>
                        <a-menu-item key="DynamicInfo">动态信息</a-menu-item>
                    </a-sub-menu>
                    <a-sub-menu key="UserSetting">
                        <template #title>
                            <notification-outlined/>
                            <span>个人设置</span>
                        </template>
                        <a-menu-item key="InfoSetting">信息设置</a-menu-item>
                        <a-menu-item key="SafeSetting">安全设置</a-menu-item>
                    </a-sub-menu>
                    <a-sub-menu v-if="$store.getters.isAdmin" key="SystemSetting">
                        <template #title>
                            <notification-outlined/>
                            <span>系统设置</span>
                        </template>
                        <a-menu-item key="AdminCenter">管理员中心</a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </a-layout-sider>
            <a-layout style="padding: 0 24px 24px">
                <a-breadcrumb style="margin: 16px 0">
                    <a-breadcrumb-item>Home</a-breadcrumb-item>
                    <a-breadcrumb-item>List</a-breadcrumb-item>
                    <a-breadcrumb-item>App</a-breadcrumb-item>
                </a-breadcrumb>
                <a-layout-content
                        :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px'}"
                >
                    <router-view/>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-layout>
</template>

<script>
    import {UserOutlined, LaptopOutlined, NotificationOutlined,LogoutOutlined,QuestionCircleOutlined} from '@ant-design/icons-vue';
    import {createVNode, ref} from 'vue';
    import { Modal } from 'ant-design-vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'
    import api from '../api/api'
    import util from '../utils/util'

    export default {
        name: "Main",
        components: {
            UserOutlined,
            LaptopOutlined,
            NotificationOutlined,
            LogoutOutlined,
            QuestionCircleOutlined
        },
        setup() {
            const store = useStore()
            const router = useRouter();

            //右上角用户信息部分
            const handleMenuClick=({key})=>{
                if(key==='logout'){
                    Modal.confirm({
                        title:"退出",
                        content:"确认退出登录？",
                        icon:createVNode(QuestionCircleOutlined),
                        okText: '确认',
                        cancelText: '取消',
                        onOk(){
                            return new Promise((resolve, reject) => {
                                //请求后台
                                api.userApi.logout().then(res=>{
                                    util.success("退出成功！")
                                    localStorage.clear()
                                    store.commit('clearStore')
                                    resolve()
                                }).catch(err=>{reject()})
                            }).then(()=>{
                                router.push({name:'Login'})
                            }).catch(() => {});
                        }
                    });
                }
            }

            //切换菜单
            const switchMenu = e =>{
                //切换路由
                router.push({name:e.key})
            }


            return {
                selectedKeys: ref(['MyNovel']),
                collapsed: ref(false),
                openKeys: ref(['Novel']),
                userName: ref(localStorage.getItem("userName")),
                handleMenuClick,
                switchMenu
            };
        }
    }
</script>

<style>
    .logo {
        float: left;
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

    .site-layout-background {
        background: #fff;
    }

    .layout {
        min-height: 100%;
    }
</style>