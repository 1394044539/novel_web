<template>
    <div class="content-div">
        <div>
            <a-row>
                <a-col :span="10" style="text-align: center">
                    <a-image
                        :width="150"
                        :src="'/img/'+volumeInfo.volumeImg"
                        :fallback="require('@/assets/img/notImg.png')"
                    />
                </a-col>
                <a-col :span="14">
                    <h2>{{volumeInfo.volumeName}}</h2>
                    <a-row>
                        <a-col :span="12"><p><span style="color: grey">总字数：</span>{{volumeInfo.totalWord}}</p></a-col>
                        <a-col :span="12"><p><span style="color: grey">发布时间：</span>{{volumeInfo.publicTime}}</p></a-col>
                    </a-row>
                    <a-row>
                        <div style="min-height: 90px">
                            <span style="color: grey">简介：</span>
<!--                            <a-tooltip arrowPointAtCenter placement="bottomRight">-->
<!--                                <template #title>{{volumeInfo.volumeDesc}}</template>-->
                            <p :title="volumeInfo.volumeDesc" style="text-indent:2em;padding-right: 20%;font-size: 12px" class="custom-three-ellipsis">{{volumeInfo.volumeDesc}}</p>
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
                            <a-button type="primary" @click="updateVolume(true)">编辑</a-button>
                            <a-button style="margin-left: 5px" @click="deleteVolume">删除</a-button>
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
                <a-list v-if="switchModel" :grid="{ gutter: 24, column: 4 }" :data-source="volumeInfo.chapterList">
                    <template #renderItem="{ item }">
                        <div style="padding: 5px">
                            <a-card @click="jumpChapter(item)" :hoverable='true' :bodyStyle="{padding: '10px',textAlign: 'center'}">
                                {{item.chapterName}}
                            </a-card>
                        </div>
                    </template>
                </a-list>
                <a-list v-if="!switchModel" :grid="{ gutter: 24, column: 1 }" :data-source="volumeInfo.chapterList">
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
        <UpdateVolume
            :show-update-volume="showUpdateForm"
            :volume-info="volumeInfo"
            @closeForm="updateVolume"
            @success="updateCall"
        />
    </div>
</template>

<script>
    import { reactive,toRefs,toRaw,onMounted,createVNode } from 'vue'
    import { useRouter } from 'vue-router'
    import { Modal } from 'ant-design-vue'
    import api from "../../../../api/api";
    import util from "../../../../utils/util"
    import '../../../../common/index.less'
    import { QuestionCircleOutlined } from '@ant-design/icons-vue';
    import UpdateVolume from "../../../../components/novel/UpdateVolume";

    export default {
        name: "VolumeInfo",
        components: {UpdateVolume},
        setup(props,content){
            const state = reactive({
                volumeInfo: {},
                switchModel: false,
                readModel: false,
                showUpdateForm: false,
                collectionInfo: {},
            })
            const route = useRouter()
            let query = route.currentRoute.value.query
            onMounted(()=>{
                getVolumeInfo()
                getCollection()
            })
            const getVolumeInfo = () => {
                let param = { volumeId: query.volumeId }
                api.novelApi.getVolumeInfo(param).then(res=>{
                    state.volumeInfo = res
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
                    debugger
                    if(route.currentRoute.value.name==="VolumeInfo2"){
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
            const deleteVolume = () => {
                Modal.confirm({
                    title: '确认删除',
                    content: '是否确认删除当前分卷（相关数据会一并删除）',
                    icon:createVNode(QuestionCircleOutlined),
                    okText: '确认',
                    cancelText: '取消',
                    onOk(){
                        let volumeIds = []
                        volumeIds.push(query.volumeId)
                        api.novelApi.deleteVolume(volumeIds).then(res=>{
                            util.success("删除成功")
                            route.push({
                                path: '/main/novelInfo',
                                query: {
                                    novelId: query.novelId,
                                }
                            })
                        })
                    }
                })
            }

            // 编辑
            const updateVolume = (flag) => {
                state.showUpdateForm = flag
            }

            // 编辑回调
            const updateCall = () => {
                updateVolume(false)
                getVolumeInfo()
            }

            // 加入收藏
            const addCollection = () =>{
                let param = {
                    collectionType: '0', //分卷
                    volumeId: state.volumeInfo.volumeId,
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
                    id: query.volumeId,
                    collectionType: '0', //分卷
                }
                api.novelApi.getCollection(param).then(res=>{
                    state.collectionInfo=res
                })
            }

            return{
                ...toRefs(state),
                jumpChapter,
                deleteVolume,
                updateVolume,
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