<template>
    <div class="main-list">
        <div class="main-list-header">
            <div class="custom-ellipsis" style="display: flex;align-items: center;max-width: 350px">
                <a-breadcrumb>
                    <span class="breadcrumb-catalog">刷新<IconComponent name="ReloadOutlined"/></span>
                    <a-breadcrumb-item style="margin-left: 15px" href="javascript:void(0);" class="breadcrumb-catalog">图书列表</a-breadcrumb-item>
                    <a-breadcrumb-item href="javascript:void(0);" class="breadcrumb-catalog">实例之上</a-breadcrumb-item>
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
                <a-button type="primary" shape="round">
                    <icon-component name="FolderAddOutlined"/>创建文件夹
                </a-button>
                <a-button @click="uploadNovelBtn" type="primary" shape="round" style="margin-left: 5px">
                    <icon-component name="PlusSquareOutlined"/>添加小说
                </a-button>
            </div>
        </div>
        <a-divider />
        <div class="main-list-content">
            <div class="novel-list-item" v-for="index in 50" @mouseenter="showTag(true,index)" @mouseleave="showTag(false)">
                <div style="font-size: 12px;color: #9e9e9e;padding-bottom: 8px">上次阅读:2021-12-1 12:00:00</div>
                <a-dropdown :trigger="['contextmenu']" @contextmenu="openNovel">
                    <div :style="{textAlign: 'center',height: '180px',width: '150px',position: 'relative',cursor: 'pointer'}">
                        <div class="item-tag">
                            <transition name="slide-fade">
                                <a-tag v-if="show&&index===mouseIndex" style="border-radius: 5px" color="pink">小说</a-tag>
                            </transition>
                        </div>
                        <div class="item-image">
                            <a-image :preview="false" height="180px" width="150px" :src="require('@/assets/img/notImg.png')" @click="openNovel" />
                        </div>
                    </div>
                    <template #overlay>
                        <a-menu style="width: 100px">
                            <a-menu-item key="3">取消收藏</a-menu-item>
                            <a-menu-item key="2">复制</a-menu-item>
                            <a-menu-item key="3">移动</a-menu-item>
                            <a-menu-item key="3">重命名</a-menu-item>
                            <a-menu-item key="1">下载</a-menu-item>
                            <a-menu-item key="3">删除</a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <div class="novel-list-item-name">实力至上注意的教师</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {reactive,toRefs, watch} from "vue";
    import IconComponent from "../../components/common/IconComponent";
    import '../../common/index.less'
    import { useRouter } from "vue-router";

    export default {
        name: "ListPage",
        components: {IconComponent},
        setup(){
            const state = reactive({
                novelName: '',
                checkAll: true,
                indeterminate: false,
                searchType: ['A','B','C'],
                filterTypeShow: false,
                show: true,
                mouseIndex: -1
            })
            const route = useRouter()

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

            const uploadNovelBtn = () => {
                route.push({
                    name: 'NovelManager'
                })
            }

            return{
                ...toRefs(state),
                onCheckAllChange,
                openNovel,
                showTag,
                uploadNovelBtn,
            }
        }
    }
</script>

<style scoped lang="less">
    .slide-fade-enter-active {
        opacity: 0;
        transition: all .3s ease;
    }
    .slide-fade-enter-to{
        transform: translateX(-5px);
        opacity: 1;
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
        max-height: 500px;
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap
    }

    .breadcrumb-catalog {
        font-size: 14px;
        &:hover {
             cursor: pointer;
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