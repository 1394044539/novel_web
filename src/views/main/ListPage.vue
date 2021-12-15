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
                                        <a-checkbox value="1">小说</a-checkbox>
                                    </a-menu-item>
                                    <a-menu-item>
                                        <a-checkbox value="0">分卷</a-checkbox>
                                    </a-menu-item>
                                    <a-menu-item>
                                        <a-checkbox value="2">目录</a-checkbox>
                                    </a-menu-item>
                                </a-checkbox-group>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
                <a-input allowClear v-model:value="searchForm.catalogName" placeholder="请输入小说名" />
                <a-button style="margin-left: 3px" type="primary" @click="getCollectionList">查询</a-button>
            </div>
            <div>
                <a-button type="primary" shape="round" @click="addCatalog(true,'create')">
                    <icon-component name="FolderAddOutlined"/>创建文件夹
                </a-button>
                <a-button @click="uploadNovelBtn" type="primary" shape="round" style="margin-left: 5px">
                    <icon-component name="PlusSquareOutlined"/>添加小说
                </a-button>
            </div>
        </div>
        <a-divider />
        <div class="main-list-content">
            <div class="novel-list-item" v-for="(item,index)  in collectionList" @mouseenter="showTag(true,index)" @mouseleave="showTag(false)">
                <div v-if="item.collectionType==='0'" style="font-size: 12px;color: #9e9e9e;padding-bottom: 8px">上次阅读:{{item.updateTime}}</div>
                <div v-if="item.collectionType==='1'" style="font-size: 12px;color: #9e9e9e;padding-bottom: 8px">上次阅读到</div>
                <div v-if="item.collectionType==='2'" style="font-size: 12px;color: #9e9e9e;padding-bottom: 8px">上次操作:{{item.updateTime}}</div>
                <a-dropdown :trigger="['contextmenu']" @contextmenu="openNovel">
                    <div :style="{textAlign: 'center',height: '180px',width: '150px',position: 'relative',cursor: 'pointer'}">
                        <div class="item-tag">
                            <transition name="slide-fade">
                                <a-tag v-if="show&&index===mouseIndex" style="border-radius: 5px" color="pink">
                                    {{item.collectionType==='0'?'分卷':item.collectionType==='1'?'小说':'文件夹'}}
                                </a-tag>
                            </transition>
                        </div>
                        <div class="item-image">
                            <a-image
                                    v-if="item.collectionType!=='2'"
                                    :preview="false" height="180px" width="150px"
                                     :src="'/img/'+item.imgPath"
                                     :fallback="require('@/assets/img/photo.png')"
                                     @click="openNovel" />
                            <a-image
                                    v-else
                                    :preview="false" height="180px" width="150px"
                                    :src="require('@/assets/img/catalog.png')"
                                    @click="openNovel" />
                        </div>
                    </div>
                    <template #overlay>
                        <a-menu style="width: 100px">
                            <a-menu-item key="copy" @click.native="copyCollection(item)">复制</a-menu-item>
                            <a-menu-item key="move" @click.native="moveCollection(item)">移动</a-menu-item>
                            <a-menu-item v-if="item.collectionType==='2'" key="rename" @click.native="renameCatalog(item)">重命名</a-menu-item>
                            <a-menu-item v-if="item.collectionType!=='2'" key="deleteCollection" @click.native="deleteCollection(item)">取消收藏</a-menu-item>
                            <a-menu-item v-if="item.collectionType==='2'" key="deleteCatalog" @click.native="deleteCatalog(item)">删除</a-menu-item>
                            <a-menu-item key="download" @click.native="download(item)">下载</a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <div class="novel-list-item-name">{{item.catalogName}}</div>
            </div>
        </div>
        <CreateCatalog
            :modal-flag="modalFlagCatalog"
            :show-create-catalog="showCreateCatalog"
            :catalog-name="choseCatalogName"
            :now-catalog="nowCatalog"
            @closeForm="addCatalog"
            @success="catalogSuccess"
        />
    </div>
</template>

<script>
    import {reactive,toRefs, watch,onMounted} from "vue";
    import IconComponent from "../../components/common/IconComponent";
    import '../../common/index.less'
    import { useRouter } from "vue-router";
    import api from "../../api/api";
    import CreateCatalog from "../../components/novel/CreateCatalog";

    export default {
        name: "ListPage",
        components: {CreateCatalog, IconComponent},
        setup(){
            const state = reactive({
                checkAll: true,
                indeterminate: false,
                searchType: ['1','0','2'],
                filterTypeShow: false,
                show: true,
                mouseIndex: -1,
                collectionList: [],
                searchForm: {
                    catalogName: '',
                    typeList: [],
                    parentId: '',
                },
                showCreateCatalog: false,
                modalFlagCatalog: 'create',
                choseCatalogName: '',
                nowCatalog: {}
            })
            // 路由
            const route = useRouter()
            onMounted(()=>{
                getCollectionList()
            })
            // 获取收藏列表
            const getCollectionList = () =>{
                let param = {
                    ...state.searchForm,
                    typeList: state.searchType,
                }
                api.novelApi.getCollectionList(param).then(res=>{
                    state.collectionList = res
                })
            }
            /** 中间搜索框 **/
            const onCheckAllChange = e => {
                state.checkAll = e.target.checked;
                state.searchType = state.checkAll ? ['1','0','2'] : []
            }
            watch(()=>state.searchType,(newV, oldV)=>{
                if(newV.length===3){
                    state.checkAll = true
                }else if(newV.length===0){
                    state.checkAll = false
                }
            })
            /** 右上角按钮 **/
            // 添加目录
            const addCatalog = (flag=false,modalFlag='') => {
                state.modalFlagCatalog=modalFlag
                state.showCreateCatalog=flag
            }
            // 回调
            const catalogSuccess = () => {
                addCatalog(false)
                getCollectionList()
            }
            // 上传小说
            const uploadNovelBtn = () => {
                route.push({
                    name: 'NovelManager'
                })
            }

            /** 小说内容 **/
            const openNovel = () => {
                console.log("hhh")
            }
            const showTag = (show,index=-1) => {
                state.show = show
                state.mouseIndex = index
            }

            /** 右键菜单 **/
            // 取消收藏
            const deleteCollection = (collection) => {
                debugger
            }
            // 复制收藏
            const copyCollection = (collection) => {

            }
            // 移动收藏
            const moveCollection = (collection) => {

            }
            // 重命名文件夹
            const renameCatalog = (collection) => {

            }
            // 下载
            const download = (collection) => {

            }
            // 删除目录
            const deleteCatalog = () => {

            }

            return{
                ...toRefs(state),
                onCheckAllChange,
                openNovel,
                showTag,
                uploadNovelBtn,
                deleteCollection,
                copyCollection,
                moveCollection,
                renameCatalog,
                download,
                deleteCatalog,
                getCollectionList,
                addCatalog,
                catalogSuccess,
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