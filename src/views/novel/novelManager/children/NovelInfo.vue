<template>
    <div class="content-div">
        <div>
            <a-descriptions bordered :labelStyle="{minWidth: '120px'}" :contentStyle="{minWidth: '200px'}">
                <template #title>
                    <div style="padding-left: 15px">小说详情</div>
                </template>
                <a-descriptions-item label="小说名"><span style="font-weight: bold">{{novelInfo.novelName}}</span></a-descriptions-item>
                <a-descriptions-item label="作者名">{{novelInfo.novelAuthor||'未知'}}</a-descriptions-item>
                <a-descriptions-item label="发布时间">{{novelInfo.publicTime||'未知'}}</a-descriptions-item>
                <a-descriptions-item label="小说类型">{{getNovelType(novelInfo.typeList)}}</a-descriptions-item>
                <a-descriptions-item label="总字数">{{novelInfo.totalWord||'未知'}}</a-descriptions-item>
                <a-descriptions-item label="分卷数">{{novelInfo.novelVolumeList?novelInfo.novelVolumeList.length:0}}</a-descriptions-item>
                <a-descriptions-item label="封面信息">
                    <a-image
                            :width="150"
                            :src="'/img/'+novelInfo.novelImg"
                            :fallback="require('@/assets/img/notImg.png')"
                    />
                </a-descriptions-item>
                <a-descriptions-item label="描述">
                    {{novelInfo.novelDesc||'-'}}
                </a-descriptions-item>
                <a-descriptions-item label="介绍">
                    {{novelInfo.novelIntroduce||'-'}}
                </a-descriptions-item>
            </a-descriptions>
        </div>
        <div style="background-color: #f4f4f4;margin-top: 24px">
            <div class="title-volume-list">
                <span>小说分卷信息</span>
                <component v-if="switchModel" class="switchIcon" @click="switchListModel" :is="$antIcons['AppstoreOutlined']"/>
                <component v-if="!switchModel" class="switchIcon" @click="switchListModel" :is="$antIcons['BarsOutlined']"/>
            </div>
            <div style="margin-left: 12px;margin-right: 12px;overflow-y: auto;overflow-x: hidden;max-height: 500px">
                <a-list v-if="switchModel" :grid="{ gutter: 24, column: 4 }" :data-source="novelInfo.novelVolumeList">
                    <template #renderItem="{ item }">
                        <div style="padding: 5px">
                            <a-card :hoverable='true' :bodyStyle="{padding: '10px',textAlign: 'center'}">
                                {{item.volumeName}}
                            </a-card>
                        </div>
                    </template>
                </a-list>
                <a-list v-if="!switchModel" :grid="{ gutter: 24, column: 1 }" :data-source="novelInfo.novelVolumeList">
                    <template #renderItem="{ item,index }">
                        <div style="padding: 5px">
                            <a-card :hoverable='true' :bodyStyle="{padding: '10px'}">
                                {{'第'+(index+1)+'卷 '}}{{item.volumeName}}
                            </a-card>
                        </div>
                    </template>
                </a-list>
            </div>
        </div>

    </div>
</template>

<script>
    import { useRouter } from 'vue-router'
    import {onMounted,ref,reactive,toRefs} from "vue";
    import api from "../../../../api/api";
    import '../../../../common/index.less'

    export default {
        name: "NovelInfo",
        setup(){
            const router = useRouter();
            const state=reactive({
                novelInfo: {},
                switchModel: false
            })
            onMounted(()=>{
                initNovelData();
            })
            const initNovelData = () => {
                const routeValue = router.currentRoute.value
                api.novelApi.getNovelData({novelId:routeValue.query.novelId}).then(res=>{
                    state.novelInfo = res
                })
            }
            const getNovelType = (typeList) => {
                let value=''
                if(typeList){
                    typeList.forEach(e=>{
                        value += e.paramName+','
                    })
                    value = value.substring(0, value.lastIndexOf(','));
                }
                return value||'其他'
            }
            const switchListModel = () => {
                state.switchModel = !state.switchModel
            }
            return {
                ...toRefs(state),
                getNovelType,
                switchListModel,
            }
        }
    }
</script>

<style scoped>
    .title-volume-list{
        font-weight: bold;
        font-size: 16px;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding:15px 15px 10px 15px;
    }

    .switchIcon{
        margin-left: 10px;
        cursor: pointer;
    }
</style>