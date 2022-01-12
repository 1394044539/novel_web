<template>
    <div class="main-list">
        <div class="main-list-header">
            <div class="custom-ellipsis" style="display: flex;align-items: center;width: 350px">
                <a-breadcrumb>
                    <span class="breadcrumb-catalog" @click="reFlush">刷新<IconComponent name="ReloadOutlined"/></span>
                    <a-breadcrumb-item @click="jumpBreadcrumbMain()" style="margin-left: 15px" href="javascript:void(0);" class="breadcrumb-catalog">收藏列表</a-breadcrumb-item>
                    <a-breadcrumb-item @click="jumpBreadcrumbMain(item,index)" v-for="(item,index) in breadcrumbList" href="javascript:void(0);" class="breadcrumb-catalog">{{item.catalogName}}</a-breadcrumb-item>
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
                <a-button type="primary" shape="round" @click="addCatalog(true)">
                    <icon-component name="FolderAddOutlined"/>创建文件夹
                </a-button>
                <a-button @click="uploadNovelBtn" type="primary" shape="round" style="margin-left: 5px">
                    <icon-component name="PlusSquareOutlined"/>添加小说
                </a-button>
            </div>
        </div>
        <a-divider />
        <a-spin :spinning="loading">
            <div class="main-list-content">
                <div class="novel-list-item" v-for="(item,index)  in collectionList" @mouseenter="showTag(true,index)" @mouseleave="showTag(false)">
                    <div v-if="item.collectionType==='0'" style="font-size: 12px;color: #9e9e9e;padding-bottom: 8px">上次阅读:{{item.updateTime}}</div>
                    <div v-if="item.collectionType==='1'" style="font-size: 12px;color: #9e9e9e;padding-bottom: 8px">上次阅读到</div>
                    <div v-if="item.collectionType==='2'" style="font-size: 12px;color: #9e9e9e;padding-bottom: 8px">上次操作:{{item.updateTime}}</div>
                    <a-dropdown :trigger="['contextmenu']">
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
                                         @click="openNovel(item)" />
                                <a-image
                                        v-else
                                        :preview="false" height="180px" width="150px"
                                        :src="require('@/assets/img/catalog.png')"
                                        @click="intoCatalog(item)" />
                            </div>
                        </div>
                        <template #overlay>
                            <a-menu style="width: 100px">
<!--                                <a-menu-item key="copy" @click.native="copyCollection(item)">复制</a-menu-item>-->
                                <a-menu-item key="move" @click.native="moveCollection(item)">移动</a-menu-item>
                                <a-menu-item v-if="item.collectionType==='2'" key="rename" @click.native="renameCatalog(true,item)">重命名</a-menu-item>
                                <a-menu-item v-if="item.collectionType!=='2'" key="deleteCollection" @click.native="deleteCollection(item)">取消收藏</a-menu-item>
                                <a-menu-item v-if="item.collectionType==='2'" key="deleteCatalog" @click.native="deleteCatalog(item)">删除</a-menu-item>
                                <a-menu-item key="download" @click.native="download(item)">下载</a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                    <div class="novel-list-item-name">{{item.catalogName}}</div>
                </div>
            </div>
        </a-spin>
        <CreateCatalog
            :modal-flag="modalFlagCatalog"
            :show-create-catalog="showCreateCatalog"
            :chose-catalog="choseCatalog"
            :now-catalog="nowCatalog"
            @closeForm="addCatalog"
            @success="catalogSuccess"
        />
        <CatalogTree 
            :collectionInfo="choseCatalog"
            :showTree="showTree"
            :treeType="treeType"
            @closeForm="closeCollection"
            @successCall="closeCollection"
        />
    </div>
</template>

<script>
    import {reactive,toRefs, watch,onMounted,createVNode} from "vue";
    import { Modal } from 'ant-design-vue'
    import IconComponent from "../../components/common/IconComponent";
    import { QuestionCircleOutlined } from '@ant-design/icons-vue';
    import '../../common/index.less'
    import { useRouter } from "vue-router";
    import api from "../../api/api";
    import util from "../../utils/util";
    import CreateCatalog from "../../components/novel/CreateCatalog";
    import CatalogTree from "../../components/novel/CatalogTree.vue"

    export default {
        name: "ListPage",
        components: {CreateCatalog, IconComponent,CatalogTree},
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
                choseCatalog: {},
                nowCatalog: {},
                loading: false,
                breadcrumbList: [],
                showTree: false,
                treeType: '',
            })
            // 路由
            const route = useRouter()
            onMounted(()=>{
                getCollectionList()
            })
            // 获取收藏列表
            const getCollectionList = () =>{
                state.loading=true
                let param = {
                    ...state.searchForm,
                    typeList: state.searchType,
                }
                api.novelApi.getCollectionList(param).then(res=>{
                    state.collectionList = res
                    state.loading=false
                })
            }
            /** 中间搜索框 **/
            //刷新面包屑
            const reFlush = () => {
                getCollectionList()
            }
            //全选
            const onCheckAllChange = e => {
                if(state.searchType.length<3){
                    state.searchType = ['1','0','2']
                    state.checkAll = true
                }else {
                    state.searchType = []
                    state.checkAll = false
                }
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
            const addCatalog = (flag=false) => {
                state.modalFlagCatalog='create'
                state.showCreateCatalog=flag
            }
            // 回调
            const catalogSuccess = () => {
                addCatalog(false)
                getCollectionList()
            }
            // 上传小说
            const uploadNovelBtn = () => {
                util.confirm('上传小说','上传小说需要进入小说列表上传，是否跳转？',()=>{
                    route.push({
                        name: 'NovelManager'
                    })
                })
                // Modal.confirm({
                //     title: "上传小说",
                //     content: "上传小说需要进入小说列表上传，是否跳转？",
                //     icon: createVNode(QuestionCircleOutlined),
                //     okText: '确认',
                //     cancelText: '取消',
                //     onOk() {
                //         route.push({
                //             name: 'NovelManager'
                //         })
                //     }
                // });
            }

            /** 小说内容 **/
            const openNovel = (item) => {
                if(item.collectionType==='0'){
                    // 分卷
                    route.push({
                        path: '/mainPage/volumeInfo',
                        query:{
                            novelId: item.novelId,
                            volumeId: item.volumeId
                        }
                    })
                }else if(item.collectionType==='1'){
                    // 系列
                    route.push({
                        path: '/mainPage/novelInfo',
                        query: {
                            novelId: item.novelId,
                        }
                    })
                }
            }
            const showTag = (show,index=-1) => {
                state.show = show
                state.mouseIndex = index
            }
            const intoCatalog = (catalog) => {
                state.nowCatalog = catalog
                state.searchForm.parentId = catalog.collectionId
                state.breadcrumbList.push(catalog)
                getCollectionList()
            }
            const jumpBreadcrumbMain = (item,index) => {
                if(item){
                    state.nowCatalog = item
                    state.searchForm.parentId = item.collectionId
                    state.breadcrumbList = state.breadcrumbList.slice(0,index+1)
                }else {
                    state.nowCatalog = {}
                    state.breadcrumbList = []
                    state.searchForm.parentId = ''
                }
                getCollectionList()
            }
            /** 右键菜单 **/
            // 取消收藏
            const deleteCollection = (collection) => {
                    Modal.confirm({
                        title: "取消收藏",
                        content: "是否确定取消收藏？",
                        icon: createVNode(QuestionCircleOutlined),
                        okText: '确认',
                        cancelText: '取消',
                        onOk() {
                            let param = {
                                collectionId: collection.collectionId,
                            }
                            api.novelApi.deleteCollection(param).then(res=>{
                                util.success("取消成功")
                                getCollectionList();
                            })
                        }
                    });
            }
            // 复制收藏
            const copyCollection = (collection) => {
                state.showTree = true
                state.treeType = 'copy'
                state.choseCatalog = collection
            }
            const closeCollection = (flag) => {
                state.showTree = false
                if(flag){
                    getCollectionList()
                }
            }
            // 移动收藏
            const moveCollection = (collection) => {
                state.showTree = true
                state.treeType = 'move'
                state.choseCatalog = collection
            }
            // 重命名文件夹
            const renameCatalog = (flag,collection) => {
                state.modalFlagCatalog='edit'
                state.showCreateCatalog=flag
                state.choseCatalog = collection
            }
            // 下载
            const download = (collection) => {
                let param = {
                    ...collection
                }
                api.novelApi.download(param)
            }
            // 删除目录
            const deleteCatalog = (collection) => {
                util.confirm("删除目录","是否确定删除目录(目录下的记录会一并删除)？",()=>{
                    let param = {
                        collectionId: collection.collectionId,
                        collectionType: '2',
                    }
                    api.novelApi.deleteCollection(param).then(res=>{
                        util.success("删除成功")
                        getCollectionList();
                    })
                })
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
                reFlush,
                intoCatalog,
                jumpBreadcrumbMain,
                closeCollection,
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

    /*.main-list{*/
    /*    margin-top: 20px;*/
    /*    padding: 0 180px;*/
    /*}*/

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