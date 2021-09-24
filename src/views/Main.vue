<template>
    <a-layout style=" height: 100vh;">
        <a-layout-header class="header">
            <div class="logo">没有名字的系统</div>
            <div style="float: right">
                <a-dropdown placement="bottomCenter" :overlay-style="{paddingTop:'20px'}">
                    <a class="ant-dropdown-link" @click.prevent>
                        <span style="margin-right: 15px">
                            {{ userName }}
                        </span>
                            <a-badge :count="0">
                                <a-avatar shape="square">
                                    <template #icon><UserOutlined /></template>
                                </a-avatar>
                            </a-badge>
                        </a>
                    <template #overlay>
                        <a-menu @click="handleMenuClick">
                            <a-menu-item key="1">
                                1st menu item
                            </a-menu-item>
                            <a-menu-item key="2">
                                2nd menu item
                            </a-menu-item>
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
                        v-model:selectedKeys="selectedKeys2"
                        v-model:openKeys="openKeys"
                        :style="{ height: '100%', borderRight: 0 }"
                >
                    <a-sub-menu key="sub1">
                        <template #title>
                            <user-outlined/>
                            <span>subnav 1</span>
                        </template>
                        <a-menu-item key="1">option1</a-menu-item>
                        <a-menu-item key="2">option2</a-menu-item>
                        <a-menu-item key="3">option3</a-menu-item>
                        <a-menu-item key="4">option4</a-menu-item>
                    </a-sub-menu>
                    <a-sub-menu key="sub2">
                        <template #title>
                            <laptop-outlined/>
                            <span>subnav 2</span>
                        </template>
                        <a-menu-item key="5">option5</a-menu-item>
                        <a-menu-item key="6">option6</a-menu-item>
                        <a-menu-item key="7">option7</a-menu-item>
                        <a-menu-item key="8">option8</a-menu-item>
                    </a-sub-menu>
                    <a-sub-menu key="sub3">
                        <template #title>
                            <notification-outlined/>
                            <span>subnav 3</span>
                        </template>
                        <a-menu-item key="9">option9</a-menu-item>
                        <a-menu-item key="10">option10</a-menu-item>
                        <a-menu-item key="11">option11</a-menu-item>
                        <a-menu-item key="12">option12</a-menu-item>
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
                                    resolve()
                                }).catch(err=>{reject()})
                            }).then(()=>{
                                //todo 路由跳转
                            }).catch(() => {});
                        }
                    });
                }
            }


            return {
                selectedKeys1: ref(['2']),
                selectedKeys2: ref(['1']),
                collapsed: ref(false),
                openKeys: ref(['sub1']),
                userName: ref(localStorage.getItem("userName")),
                handleMenuClick
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