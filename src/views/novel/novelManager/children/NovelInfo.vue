<template>
    <div class="content-div" style="padding: 0 10%">
        <div>
            <a-row>
                <a-col :span="10" style="text-align: center">
                    <a-image
                        :width="150"
                        :src="'/img/'+novelInfo.novelImg"
                        :fallback="require('@/assets/img/notImg.png')"
                    />
                </a-col>
                <a-col :span="14">
                    <h2>{{novelInfo.novelName}}</h2>
                    <a-row>
                        <a-col :span="12"><p><span style="color: grey">总字数：</span>{{novelInfo.totalWord}}</p></a-col>
                        <a-col :span="12"><p><span style="color: grey">发布时间：</span>{{novelInfo.publicTime}}</p></a-col>
                    </a-row>
                    <a-row>
                        <div style="min-height: 90px">
                            <span style="color: grey">简介：</span>
<!--                            <a-tooltip arrowPointAtCenter placement="bottomRight">-->
<!--                                <template #title>{{novelInfo.novelDesc}}</template>-->
                            <p :title="novelInfo.novelDesc" style="text-indent:2em;padding-right: 20%;font-size: 12px" class="custom-three-ellipsis">{{novelInfo.novelDesc}}</p>
<!--                            </a-tooltip>-->
                        </div>
                    </a-row>
                    <a-row type="flex" justify="space-between">
                        <a-col>
                            <a-button type="primary">开始阅读/重头阅读</a-button>
                            <a-button type="primary" style="margin-left: 5px">继续阅读</a-button>
                            <a-button v-if="!collectionInfo" type="primary" @click="addCollection" style="margin-left: 5px">加入书架</a-button>
                            <a-button v-if="collectionInfo" @click="deleteCollection" style="margin-left: 5px">取消收藏</a-button>
                        </a-col>
                        <a-col style="text-align: right">
                            <a-button type="primary" @click="updateNovel(true)">编辑</a-button>
                            <a-button style="margin-left: 5px" @click="deleteNovel">删除</a-button>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <div style="background-color: #f4f4f4;margin-top: 24px">
            <div class="title-volume-list">
                <a-row>
                    <a-col :span="12" style="font-weight: bold;font-size: 16px;">
                        <span>小说章节列表</span>
                        <component v-if="switchModel" class="switchIcon" @click="()=>switchModel=!switchModel" :is="$antIcons['AppstoreOutlined']"/>
                        <component v-if="!switchModel" class="switchIcon" @click="()=>switchModel=!switchModel" :is="$antIcons['BarsOutlined']"/>
                    </a-col>
                    <a-col :span="12" style="text-align: right">
                        <a-checkbox v-model:checked="readModel"><span style="">小框口模式阅读</span></a-checkbox>
                    </a-col>
                </a-row>
            </div>
            <div style="margin-left: 12px;margin-right: 12px;overflow-y: auto;overflow-x: hidden;max-height: 500px">
                <a-list v-if="switchModel" :grid="{ gutter: 24, column: 4 }" :data-source="novelInfo.chapterList">
                    <template #renderItem="{ item }">
                        <div style="padding: 5px">
                            <a-card @click="jumpChapter(item)" :hoverable='true' :bodyStyle="{padding: '10px',textAlign: 'center'}">
                                {{item.chapterName}}
                            </a-card>
                        </div>
                    </template>
                </a-list>
                <a-list v-if="!switchModel" :grid="{ gutter: 24, column: 1 }" :data-source="novelInfo.chapterList">
                    <template #renderItem="{ item,index }">
                        <div style="padding: 5px">
                            <a-card @click="jumpChapter(item)" :hoverable='true' :bodyStyle="{padding: '10px'}">
                                {{'第'+(index+1)+'章 '}}{{item.chapterName}}
                            </a-card>
                        </div>
                    </template>
                </a-list>
            </div>
        </div>
        <updateNovel
            :show-update-novel="showUpdateForm"
            :novel-info="novelInfo"
            @closeForm="updateNovel"
            @success="updateCall"
        />
    </div>
</template>

<script>
    import { reactive,toRefs,onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import api from "../../../../api/api";
    import util from "../../../../utils/util"
    import '../../../../common/index.less'
    import updateNovel from "../../../../components/novel/UpdateNovel";

    export default {
        name: "NovelInfo",
        components: {updateNovel},
        setup(props,content){
            const state = reactive({
                novelInfo: {},
                switchModel: false,
                readModel: false,
                showUpdateForm: false,
                collectionInfo: {},
            })
            const route = useRouter()
            let query = route.currentRoute.value.query
            onMounted(()=>{
                getNovelInfo()
                getCollection()
            })
            const getNovelInfo = () => {
                let param = { novelId: query.novelId }
                api.novelApi.getNovelInfo(param).then(res=>{
                    state.novelInfo = res
                })
            }
            const jumpChapter = (chapter) => {
                if(state.readModel){
                    let { href } = route.resolve({
                        path: '/novel/contentPage',
                        query:{
                            chapterId:chapter.chapterId
                        }
                    })
                    window.open(href,chapter.chapterName,
                        'width=665,height=515,top=100, left=100,menubar=no,toolbar=no,status=no,scrollbars=yes')
                }else {
                    if(route.currentRoute.value.name==="NovelInfo2"){
                        route.push({
                            path: '/mainPage/chapterContent',
                            query:{
                                chapterId:chapter.chapterId
                            }
                        })
                    }else {
                        let {href} = route.resolve({
                            path: '/main/chapterContent',
                            query: {
                                chapterId: chapter.chapterId
                            }
                        })
                        window.open(href, '_blank');
                    }
                }
            }

            //删除
            const deleteNovel = () => {
                util.confirm('确认删除','是否确认删除当前小说（相关数据会一并删除）',()=>{
                    api.novelApi.deleteNovel([query.novelId]).then(res=>{
                        util.success("删除成功")
                        route.push({
                            path: '/main/seriesInfo',
                            query: {
                                seriesId: state.novelInfo.seriesId,
                            }
                        })
                    })
                })
            }

            // 编辑
            const updateNovel = (flag) => {
                state.showUpdateForm = flag
            }

            // 编辑回调
            const updateCall = () => {
                updateNovel(false)
                getNovelInfo()
            }

            // 加入收藏
            const addCollection = () =>{
                let param = {
                    collectionType: '0', //小说
                    novelId: state.novelInfo.novelId,
                }
                api.novelApi.addCollection(param).then(res=>{
                    util.success("收藏成功")
                    getCollection();
                })
            }
            // 取消收藏
            const deleteCollection = () => {
                let param = {
                    collectionId: state.collectionInfo.collectionId,
                }
                api.novelApi.deleteCollection(param).then(res=>{
                    util.success("取消成功")
                    getCollection();
                })
            }
            // 获取信息
            const getCollection = () => {
                let param={
                    id: query.novelId,
                    collectionType: '0', //小说
                }
                api.novelApi.getCollection(param).then(res=>{
                    state.collectionInfo=res
                })
            }

            return{
                ...toRefs(state),
                jumpChapter,
                deleteNovel,
                updateNovel,
                updateCall,
                addCollection,
                deleteCollection,
            }
        }
    }
</script>

<style scoped>
    .title-volume-list{
        white-space: nowrap;
        text-overflow: ellipsis;
        padding:15px 15px 10px 15px;
    }

    .switchIcon{
        margin-left: 10px;
        cursor: pointer;
    }
</style>