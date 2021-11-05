<template>
    <div class="content-div">
        <div>
            <a-descriptions bordered :labelStyle="{minWidth: '120px'}" :contentStyle="{minWidth: '200px'}">
                <template #title>
                    <div style="display: flex;justify-content: space-between">
                        <div style="padding-left: 15px">小说详情</div>
<!--                        <div style="display:table-cell;" @click="goBack">-->
<!--                            <component class="switchIcon" title="返回" :is="$antIcons['RollbackOutlined']"/>-->
<!--                        </div>-->
                        <div>
                            <a-button type="primary">加入书架</a-button>
                            <a-button style="margin-left: 5px" type="primary">全部下载</a-button>
                            <a-button style="margin-left: 5px" type="primary">编辑</a-button>
                            <a-button style="margin-left: 5px" type="primary" @click="deleteNovel">删除</a-button>
                        </div>
                    </div>
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
                    <div class="custom-seven-ellipsis">
                        <a-tooltip placement="leftTop">
                            <template #title>{{novelInfo.novelIntroduce||'-'}}</template>
                            {{novelInfo.novelIntroduce||'-'}}
                        </a-tooltip>
                    </div>
                </a-descriptions-item>
            </a-descriptions>
        </div>
        <div style="background-color: #f4f4f4;margin-top: 24px">
            <div class="title-volume-list">
                <a-row>
                    <a-col :span="12">
                        <span>小说分卷信息</span>
                        <component v-if="switchModel" class="switchIcon" @click="switchListModel" :is="$antIcons['AppstoreOutlined']"/>
                        <component v-if="!switchModel" class="switchIcon" @click="switchListModel" :is="$antIcons['BarsOutlined']"/>
                    </a-col>
                    <a-col :span="12" style="text-align: right">
                        <a-button size="small" @click="showUpload(true)">上传分卷</a-button>
                        <a-button style="margin-left: 5px" size="small" @click="showTransferOrder(true)">调整排序</a-button>
                        <a-button style="margin-left: 5px" size="small" @click="showDeleteForm(true)">删除分卷</a-button>
                    </a-col>
                </a-row>
            </div>
            <div style="margin-left: 12px;margin-right: 12px;overflow-y: auto;overflow-x: hidden;max-height: 500px">
                <a-list v-if="switchModel" :grid="{ gutter: 24, column: 4 }" :data-source="novelInfo.novelVolumeList">
                    <template #renderItem="{ item }">
                        <div style="padding: 5px">
                            <a-card @click="jumpVolumeInfo(item)" :hoverable='true' :bodyStyle="{padding: '10px',textAlign: 'center'}">
                                {{item.volumeName}}
                            </a-card>
                        </div>
                    </template>
                </a-list>
                <a-list v-if="!switchModel" :grid="{ gutter: 24, column: 1 }" :data-source="novelInfo.novelVolumeList">
                    <template #renderItem="{ item,index }">
                        <div style="padding: 5px">
                            <a-card @click="jumpVolumeInfo(item)" :hoverable='true' :bodyStyle="{padding: '10px'}">
                                {{'第'+(index+1)+'卷 '}}{{item.volumeName}}
                            </a-card>
                        </div>
                    </template>
                </a-list>
            </div>
        </div>
        <UploadVolume
            :showUploadModal="showUploadModal"
            @closeForm="showUpload(false)"
            @success="reloadPage"
        />
        <TransferOrder
            :novelVolumeList="novelInfo.novelVolumeList"
            :showTransfer="showTransfer"
            @closeForm="showTransferOrder"
            @success="successOrder"
        />
        <DeleteVolume
            :novelVolumeList="novelInfo.novelVolumeList"
            :showDelete="showDelete"
            @closeForm="showDeleteForm"
            @success="successOrder"
        />
    </div>
</template>

<script>
    import { useRouter } from 'vue-router'
    import {onMounted, ref, reactive, toRefs, provide, createVNode} from "vue";
    import api from "../../../../api/api";
    import '../../../../common/index.less'
    import UploadVolume from "../../../../components/novel/UploadVolume";
    import TransferOrder from "../../../../components/novel/TransferOrder";
    import DeleteVolume from "../../../../components/novel/DeleteVolume";
    import {Modal} from "ant-design-vue";
    import util from "../../../../utils/util";
    import { QuestionCircleOutlined } from '@ant-design/icons-vue';

    export default {
        name: "NovelInfo",
        components: {DeleteVolume, TransferOrder, UploadVolume},
        setup(){
            const router = useRouter();
            const state=reactive({
                novelInfo: {},
                switchModel: false,
                showUploadModal: false,
                showTransfer: false,
                showDelete: false,
            })
            onMounted(()=>{
                initNovelData();
            })
            provide("novelId",router.currentRoute.value.query.novelId)
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
            const goBack = () => {
                router.go(-1)
            }
            const showUpload = (flag) => {
                state.showUploadModal = flag
            }
            const reloadPage = () => {
                state.showUploadModal = false
                initNovelData();
            }
            const jumpVolumeInfo = (volume) => {
                const { href } = router.resolve({
                    path: '/main/volumeInfo',
                    query:{
                        novelId: volume.novelId,
                        volumeId: volume.volumeId
                    }
                })
                window.open(href, '_blank');
            }
            const showTransferOrder = (flag) => {
                state.showTransfer = flag
            }
            const showDeleteForm = (flag) => {
                state.showDelete = flag
            }
            const successOrder = () => {
                showTransferOrder(false)
                showDeleteForm(false)
                initNovelData()
            }
            const deleteNovel = () => {
                Modal.confirm({
                    title: '确认删除',
                    content: '是否删除小说（分卷、章节等信息将一并删除）',
                    icon:createVNode(QuestionCircleOutlined),
                    okText: '确认',
                    cancelText: '取消',
                    onOk(){
                        let ids = [router.currentRoute.value.query.novelId];
                        api.novelApi.deleteNovel(ids).then(res=>{
                            util.success("删除成功")
                            router.push({
                                name: 'Main',
                            })
                        })
                    }
                })
            }

            return {
                ...toRefs(state),
                getNovelType,
                switchListModel,
                goBack,
                showUpload,
                reloadPage,
                jumpVolumeInfo,
                showTransferOrder,
                successOrder,
                showDeleteForm,
                deleteNovel,
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