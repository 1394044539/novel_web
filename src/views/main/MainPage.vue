<template>
    <a-layout style="height: 100%">
        <a-layout-header class="header" :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
            <div class="logo">没有名字的系统</div>
            <div style="display: flex">
                <div style="margin-right: 25px">
                    <a-breadcrumb style="line-height: 64px">
                        <template #separator><span style="color: #ffffff">|</span></template>
                        <a-breadcrumb-item href="javascript:void(0);">
                            <span >
                                <a-dropdown>
                                    <a style="color: #ffffff;font-size: 16px" @click.prevent>历史记录 <IconComponent :name="'DownOutlined'"/></a>
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
                            <a-dropdown>
                                <a style="color: #ffffff;font-size: 16px" @click.prevent>书签列表 <IconComponent :name="'DownOutlined'"/></a>
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
        <a-layout-content :style="{ marginTop: '64px',paddingBottom: '40px' }">
            <div class="main-list">
                <div class="main-list-header">
                    <div style="display: flex;align-items: center;">
                        <a-breadcrumb>
                            <span class="breadcrumb-catalog">刷新<IconComponent :name="'ReloadOutlined'"/></span>
                            <a-breadcrumb-item style="margin-left: 15px" href="javascript:void(0);" class="breadcrumb-catalog">图书列表</a-breadcrumb-item>
                        </a-breadcrumb>
                    </div>
                    <div style="width: 400px;display: flex">
                        <div style="line-height: 32px;font-size: 16px;margin-right: 5px;cursor: pointer">
                            <a-dropdown v-model:visible="filterTypeShow"
                                        placement="bottomCenter"
                                        :trigger="['click']">
                                <a style="color: unset;font-size: 16px" class="ant-dropdown-link" @click.prevent>
                                    <icon-component name="FilterOutlined" />
                                </a>
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item>
                                            <a-checkbox
                                                    v-model:checked="checkAll"
                                                    :indeterminate = "searchType.length>0&&searchType.length<3"
                                                    @change="onCheckAllChange"
                                            >
                                              全选
                                            </a-checkbox>
                                        </a-menu-item>
                                        <a-menu-divider />
                                        <a-checkbox-group v-model:value="searchType">
                                            <a-menu-item>
                                                <a-checkbox value="A">小说</a-checkbox>
                                            </a-menu-item>
                                            <a-menu-item>
                                                <a-checkbox value="B">分卷</a-checkbox>
                                            </a-menu-item>
                                            <a-menu-item>
                                                <a-checkbox value="C">目录</a-checkbox>
                                            </a-menu-item>
                                        </a-checkbox-group>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </div>
                        <a-input v-model:value="novelName" placeholder="请输入小说名" />
                        <a-button type="primary">查询</a-button>
                    </div>
                    <div>
                        <a-button type="primary" shape="round"><icon-component name="FolderAddOutlined"/> 创建文件夹</a-button>
                        <a-button type="primary" shape="round" style="margin-left: 5px"><icon-component name="UploadOutlined"/>上传小说</a-button>
                    </div>
                </div>
                <a-divider />
                <div class="main-list-content">
                    <div class="novel-list-item" v-for="index in 50" @mouseenter="showTag(true,index)" @mouseleave="showTag(false)">
                        <div style="font-size: 12px;color: #9e9e9e;padding-bottom: 8px">上次阅读:2021-12-1 12:00:00</div>
                        <a-dropdown :trigger="['contextmenu']" @contextmenu="openNovel">
                            <div :style="{textAlign: 'center',height: '180px',width: '150px',position: 'relative'}">
                                <div class="item-tag">
                                    <transition name="slide-fade">
                                        <a-tag v-if="show&&index===mouseIndex" style="border-radius: 5px" color="pink">小说</a-tag>
                                    </transition>
                                </div>
                                <div class="item-image">
                                    <a-image :preview="false" height="180px" width="150px" src="/img/novelImg/0fb57067a64f446882b66ca8dc9c81bc/dagong.jpg" @click="openNovel" />
                                </div>
                            </div>
                            <template #overlay>
                                <a-menu style="width: 100px">
                                    <a-menu-item key="1">下载</a-menu-item>
                                    <a-menu-item key="2">复制</a-menu-item>
                                    <a-menu-item key="3">移动</a-menu-item>
                                    <a-menu-item key="3">重命名</a-menu-item>
                                    <a-menu-item key="3">删除</a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                        <div class="novel-list-item-name">实力至上注意的教师</div>
                    </div>
                </div>
            </div>
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
    import { reactive,toRefs,watch } from 'vue'
    import IconComponent from "../../components/common/IconComponent";

    export default {
        name: "MainPage",
        components: {IconComponent},
        setup(){
            const state=reactive({
                selectedKeys: '',
                novelName: '',
                checkAll: true,
                indeterminate: false,
                searchType: ['A','B','C'],
                filterTypeShow: false,
                show: true,
                mouseIndex: -1
            })
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
                                router.push({name: 'Login'})
                            }).catch(() => {
                            });
                        }
                    });
                }
            }

            const onCheckAllChange = e => {
                state.checkAll = e.target.checked;
                state.searchType = state.checkAll ? ['A','B','C'] : []
            }
            watch(()=>state.searchType,(newV, oldV)=>{
                if(newV.length===3){
                    state.checkAll = true
                }else if(newV.length===0){
                    state.checkAll = false
                }
            })

            const openNovel = () => {
                console.log("hhh")
            }

            const showTag = (show,index=-1) => {
                state.show = show
                state.mouseIndex = index
            }

            return{
                ...toRefs(state),
                handleMenuClick,
                onCheckAllChange,
                openNovel,
                showTag,
            }
        }
    }
</script>

<style scoped lang="less">
    .slide-fade-enter-active {
        opacity: 0;
        transition: all .3s ease;
    }
    .slide-fade-enter-to
        /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(-5px);
        opacity: 1;
    }

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

    .main-list{
        margin-top: 20px;
        padding: 0 180px;
    }

    .main-list-header{
        display: flex;
        justify-content: space-between;
    }

    .main-list-content{
        max-height: 700px;
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap
    }

    .breadcrumb-catalog {
        font-size: 16px;
        &:hover {
             cursor: pointer;
         }
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

    .novel-list-item{
        width: 20%;
        margin-bottom: 25px;
        overflow-y: auto;
    }

    .item-tag{
        position: absolute;
        top: -5px;
        right: -10px;
        z-index: 2;
    }

    .item-image{
        &:hover{
            transition-duration: .3s;
            box-shadow:0 0 10px #000;
        }
    }

    .novel-list-item-name{
        margin-top: 5px;
        font-size: 15px;
        color: #333333;
    }
</style>