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
                            <p :title="volumeInfo.volumeDesc" style="text-indent:2em;padding-right: 20%" class="custom-two-ellipsis">{{volumeInfo.volumeDesc}}</p>
<!--                            </a-tooltip>-->
                        </div>
                    </a-row>
                    <a-row type="flex" justify="space-between">
                        <a-col>
                            <a-button type="primary">开始阅读/重头阅读</a-button>
                            <a-button type="primary" style="margin-left: 5px">继续阅读</a-button>
                        </a-col>
                        <a-col style="text-align: right">
                            <a-button type="primary">编辑</a-button>
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
                        <a-checkbox v-model:checked="readModel"><span style="">小框口阅读模式</span></a-checkbox>
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
    </div>
</template>

<script>
    import { reactive,toRefs,toRaw,onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import api from "../../../../api/api";
    import '../../../../common/index.less'

    export default {
        name: "VolumeInfo",
        setup(props,content){
            const state = reactive({
                volumeInfo: {},
                switchModel: false,
                readModel: false
            })
            const route = useRouter()
            let query = route.currentRoute.value.query
            onMounted(()=>{
                getVolumeInfo()
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
                    let { href } = route.resolve({
                        path: '/main/chapterContent',
                        query:{
                            chapterId:chapter.chapterId
                        }
                    })
                    window.open(href, '_blank');
                }
            }

            return{
                ...toRefs(state),
                jumpChapter
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