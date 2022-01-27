<template>
    <div class="content-div" style="padding: 0 10%">
        <div>
            <a-descriptions bordered :labelStyle="{minWidth: '120px'}" :contentStyle="{minWidth: '200px'}">
                <template #title>
                    <div style="display: flex;justify-content: space-between">
                        <div style="padding-left: 15px">系列详情</div>
<!--                        <div style="display:table-cell;" @click="goBack">-->
<!--                            <component class="switchIcon" title="返回" :is="$antIcons['RollbackOutlined']"/>-->
<!--                        </div>-->
                        <div>
                            <a-button v-if="!collectionInfo" type="primary" @click="addCollection">加入书架</a-button>
                            <a-button v-if="collectionInfo" @click="deleteCollection">取消收藏</a-button>
                            <a-button style="margin-left: 5px" type="primary" @click="downloadSeries">全部下载</a-button>
                            <a-button style="margin-left: 5px" type="primary" @click="createSeries">编辑</a-button>
                            <a-button style="margin-left: 5px" type="primary" @click="deleteSeries">删除</a-button>
                        </div>
                    </div>
                </template>
                <a-descriptions-item label="系列名"><span style="font-weight: bold">{{seriesInfo.seriesName}}</span></a-descriptions-item>
                <a-descriptions-item label="作者名">{{seriesInfo.seriesAuthor||'未知'}}</a-descriptions-item>
                <a-descriptions-item label="发布时间">{{seriesInfo.publicTime||'未知'}}</a-descriptions-item>
                <a-descriptions-item label="系列类型">{{getNovelType(seriesInfo.typeList)}}</a-descriptions-item>
                <a-descriptions-item label="总字数">{{seriesInfo.totalWord||'未知'}}</a-descriptions-item>
                <a-descriptions-item label="分卷数">{{seriesInfo.novelList?seriesInfo.novelList.length:0}}</a-descriptions-item>
                <a-descriptions-item label="封面信息">
                    <a-image
                            :width="150"
                            :src="'/img/'+seriesInfo.seriesImg"
                            :fallback="require('@/assets/img/notImg.png')"
                    />
                </a-descriptions-item>
                <a-descriptions-item label="描述">
                    <div class="custom-seven-ellipsis" style="max-width: 300px">
                        <a-tooltip placement="leftTop">
                            <template #title>{{seriesInfo.seriesDesc||'-'}}</template>
                            {{seriesInfo.seriesDesc||'-'}}
                        </a-tooltip>
                    </div>
                </a-descriptions-item>
                <a-descriptions-item label="介绍">
                    <div class="custom-seven-ellipsis" style="max-width: 300px">
                        <a-tooltip placement="leftTop">
                            <template #title>{{seriesInfo.seriesIntroduce||'-'}}</template>
                            {{seriesInfo.seriesIntroduce||'-'}}
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
                <a-list v-if="switchModel" :grid="{ gutter: 24, column: 4 }" :data-source="seriesInfo.novelList">
                    <template #renderItem="{ item }">
                        <div style="padding: 5px">
                            <a-card @click="jumpNovelInfo(item)" :hoverable='true' :bodyStyle="{padding: '10px',textAlign: 'center'}">
                                {{item.novelName}}
                            </a-card>
                        </div>
                    </template>
                </a-list>
                <a-list v-if="!switchModel" :grid="{ gutter: 24, column: 1 }" :data-source="seriesInfo.novelList">
                    <template #renderItem="{ item,index }">
                        <div style="padding: 5px">
                            <a-card @click="jumpNovelInfo(item)" :hoverable='true' :bodyStyle="{padding: '10px'}">
                                {{'第'+(index+1)+'卷 '}}{{item.novelName}}
                            </a-card>
                        </div>
                    </template>
                </a-list>
            </div>
        </div>
        <UploadNovel
            :showUploadModal="showUploadModal"
            :series-info="seriesInfo"
            @closeForm="showUpload(false)"
            @success="reloadPage"
        />
        <TransferOrder
            :novelList="seriesInfo.novelList"
            :showTransfer="showTransfer"
            @closeForm="showTransferOrder"
            @success="successOrder"
        />
        <DeleteNovel
            :novelList="seriesInfo.novelList"
            :showDelete="showDelete"
            @closeForm="showDeleteForm"
            @success="successOrder"
        />
        <CreateSeries :show-create-series="showCreateSeries" :modal-flag="modalFlag" :series-info="seriesInfo"
                     @closeForm="createSeries"
                     @success="successCall"/>
    </div>
</template>

<script>
    import { useRouter } from 'vue-router'
    import {onMounted, reactive, toRefs, provide} from "vue";
    import api from "../../../../api/api";
    import '../../../../common/index.less'
    import UploadNovel from "../../../../components/novel/UploadNovel";
    import TransferOrder from "../../../../components/novel/TransferOrder";
    import DeleteNovel from "../../../../components/novel/DeleteNovel";
    import util from "../../../../utils/util";
    import CreateSeries from "../../../../components/novel/CreateSeries";

    export default {
        name: "SeriesInfo",
        components: {CreateSeries, DeleteNovel, TransferOrder, UploadNovel},
        setup(){
            const router = useRouter();
            const seriesId = router.currentRoute.value.query.seriesId;
            const state=reactive({
                seriesInfo: {},
                switchModel: false,
                showUploadModal: false,
                showTransfer: false,
                showDelete: false,
                showCreateSeries: false,
                modalFlag: 'edit',
                collectionInfo: {},
            })
            onMounted(()=>{
                initSeriesData();
                getCollection();
            })
            provide("seriesId",seriesId)
            const initSeriesData = () => {
                api.novelApi.getSeriesData({seriesId:seriesId}).then(res=>{
                    state.seriesInfo = res
                })
            }
            // 获取信息
            const getCollection = () => {
                let param={
                    id: seriesId,
                    collectionType: '1', //系列
                }
                api.novelApi.getCollection(param).then(res=>{
                    state.collectionInfo=res
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
            // 分卷列表展示方式
            const switchListModel = () => {
                state.switchModel = !state.switchModel
            }
            //返回
            const goBack = () => {
                router.go(-1)
            }
            // 打开/关闭上传分卷的弹窗
            const showUpload = (flag) => {
                state.showUploadModal = flag
            }
            // 上传分卷信息成功后的回调
            const reloadPage = () => {
                state.showUploadModal = false
                initSeriesData();
            }
            // 跳转分卷信息
            const jumpNovelInfo = (novel) => {
                if(router.currentRoute.value.name==="SeriesInfo2"){
                    router.push({
                        path: '/mainPage/novelInfo',
                        query:{
                            novelId: novel.novelId,
                        }
                    })
                }else {
                    const { href } = router.resolve({
                        path: '/main/novelInfo',
                        query:{
                            novelId: novel.novelId,
                        }
                    })
                    window.open(href, '_blank');
                }
            }
            // 打开/关闭小说弹窗
            const showTransferOrder = (flag) => {
                state.showTransfer = flag
            }
            // 打开/关闭删除小说
            const showDeleteForm = (flag) => {
                state.showDelete = flag
            }
            // 排序/删除弹窗成功回调
            const successOrder = () => {
                showTransferOrder(false)
                showDeleteForm(false)
                initSeriesData()
            }
            // 删除系列信息
            const deleteSeries = () => {
                util.confirm('确认删除','是否删除系列（小说、章节等信息将一并删除）',()=>{
                    let ids = [seriesId];
                    api.novelApi.deleteSeries(ids).then(res=>{
                        util.success("删除成功")
                        router.push({
                            name: 'Main',
                        })
                    })
                })
            }
            // 加入收藏
            const addCollection = () =>{
                let param = {
                    collectionType: '1', //系列
                    seriesId,
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
            // 弹出/关闭编辑弹窗
            const createSeries = (flag) => {
                state.showCreateSeries = flag
            }
            // 编辑回调
            const successCall = () => {
                createSeries(false)
                initSeriesData()
            }
            //下载
            const downloadSeries = () => {
                let param = {
                    collectionType: '1',
                    seriesId: seriesId
                }
                api.novelApi.download(param)
            }

            return {
                ...toRefs(state),
                getNovelType,
                switchListModel,
                goBack,
                showUpload,
                reloadPage,
                jumpNovelInfo,
                showTransferOrder,
                successOrder,
                showDeleteForm,
                deleteSeries,
                createSeries,
                successCall,
                addCollection,
                deleteCollection,
                downloadSeries,
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