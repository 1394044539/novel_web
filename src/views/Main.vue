<template>
    <a-layout>
        <a-layout-header class="header"  :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
            <div class="logo" @click="jumpMain">没有名字的系统</div>
            <div style="float: right">
                <a-dropdown placement="bottomCenter" :overlay-style="{paddingTop:'20px'}">
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
        <a-layout :style="{ marginTop: '64px' }">
            <a-layout-sider :style="{ overflowY: 'auto', height: '100vh', position: 'fixed', left: 0}"  width="200" style="background: #fff" >
                <a-menu
                        theme="dark"
                        mode="inline"
                        v-model:selectedKeys="selectedKeys"
                        v-model:openKeys="openKeys"
                        :style="{ height: '100%', borderRight: 0}"
                        @click="switchMenu"
                        @openChange="openMenu"
                >
                    <a-sub-menu v-for="(menu,index) in menus" :key="menu.key" :title="menu.title">
                        <template #icon>
                            <component :is="$antIcons[menu.icon]"/>
                        </template>
                        <a-menu-item v-for="(subMenu,index) in menu.children" :key="subMenu.key">
                            {{subMenu.title}}
                        </a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </a-layout-sider>
            <a-layout style="margin-left: 200px">
                <a-layout-content
                        :style="{ background: '#fff', padding: '0 24px', margin: 0}"
                >
                    <router-view/>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-layout>
</template>

<script>
    import {ref,computed } from 'vue';
    import {useStore} from 'vuex'
    import {useRouter,} from 'vue-router'
    import api from '../api/api'
    import util from '../utils/util'
    import constant from '../common/constant'

    export default {
        name: "Main",
        setup() {
            const store = useStore()
            const router = useRouter();
            //右上角用户信息部分
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
                            router.push({name: 'Login'})
                        }).catch(() => {
                        });
                    })
                }
            }

            //切换菜单
            const switchMenu = e => {
                //切换路由
                router.push({name: e.key})
            }
            //打开菜单项
            const openMenu = e => {
                //记录到缓存中去
                localStorage.setItem("openKey", JSON.stringify(e))
            }
            const menus = computed(()=>{
                return constant.method.getMenu()
            })
            const jumpMain = () =>{
                router.push({name: 'MainPage'})
            }
            return {
                //目前选择的子菜单，根据路由进行选择
                selectedKeys: ref([router.currentRoute.value.name]),
                //打开的主菜单，从缓存中获取，缓存中有就打开，没有就取默认的novel
                openKeys: ref(localStorage.getItem("openKey") ? JSON.parse(localStorage.getItem("openKey")) : ['Novel']),
                handleMenuClick,
                switchMenu,
                openMenu,
                menus: menus,
                jumpMain
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
        cursor: pointer;
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