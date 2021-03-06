<template>
    <div style="padding: 0 10%">
        <div v-html="item" v-for="(item,index) in content.context"></div>
    </div>
</template>

<script>
    import {reactive, toRefs, onMounted, onBeforeUnmount, createVNode} from 'vue'
    import {useRouter} from 'vue-router'
    import api from "../../../api/api";
    import constant from '../../../common/constant'
    import '../../../common/index.less'
    import util from "../../../utils/util";

    export default {
        name: "ChapterContent",
        setup(props, content) {
            const state = reactive({
                content: {},
                needSave: true,
            })
            let route = useRouter()
            let query = route.currentRoute.value.query
            let params = route.currentRoute.value.params
            let timer;
            onMounted(async () => {
                await getChapterContent()
                await checkVisitModel()
                //每30秒执行一次
                timer = setInterval(() => {
                    saveHistory()
                }, 1000 * 30)
            })
            onBeforeUnmount(() => {
                if (timer) {
                    clearInterval(timer)
                }
                if(state.needSave){
                    saveHistory();
                }
            })
            //校验模式
            const checkVisitModel = async () => {
                if (params.visit === 'mark'){
                    showAlert('已为您跳转到书签进度','点我返回顶部',()=>{
                        jumpScroll(0)
                    })
                    return
                }
                await api.novelApi.getHistory({chapterId: query.chapterId}).then(res => {
                    if(!res){
                        return
                    }
                    if (params.visit === 'continue') {
                        //继续阅读，展示是否回到开头
                        jumpScroll(params.percentage)
                        showAlert('已为您跳转到最新进度','点我返回顶部',()=>{
                            jumpScroll(0)
                        })
                    } else if (params.visit === 'restart') {
                        //从头阅读，展示是否回到上一次
                        showAlert('上次阅读到['+res.chapterName+']','点我跳转',()=>{
                            state.needSave = false
                            route.replace({
                                path: "/refresh",
                                query: {
                                    chapterId:res.lastChapterId
                                },
                            })
                        })
                    } else {
                        //正常点击进入，如果有阅读进度，如果有，且是当前章节，则自动跳转，不是当前章节弹出提示框询问是否继续上次阅读
                        if (res.lastChapterId === query.chapterId) {
                            jumpScroll(res.recordPercentage)
                            showAlert('已为您跳转到最新进度','点我返回顶部',()=>{
                                jumpScroll(0)
                            })
                        }else {
                            showAlert('上次阅读到['+res.chapterName+']','点我跳转',()=>{
                                state.needSave = false
                                route.replace({
                                    path: "/refresh",
                                    query: {
                                        chapterId:res.lastChapterId
                                    },
                                })
                            })
                        }
                    }
                })
            }
            const showAlert = (content1,content2,callFunction) => {
                util.message({
                    content: createVNode("div", {}, [
                        createVNode("span", {}, content1),
                        createVNode("a", {
                            href: 'javascript:void(0);', onclick: ()=>{callFunction()}
                        }, content2)
                    ]),
                    duration: 5
                })
            }

            const jumpScroll = (y) =>{
                let topY = document.body.scrollHeight * y
                window.scrollTo({
                    left:0,
                    top: topY,
                    behavior: "smooth"
                });
            }
            // 获取内容
            const getChapterContent = async () => {
                let param = {chapterId: query.chapterId}
                await api.novelApi.getChapterContent(param).then(res => {
                    state.content = res
                })
            }

            //保存历史记录
            const saveHistory = () => {
                let allHeight = parseInt(document.body.scrollHeight);
                let nowHeight = window.pageYOffset
                let recordPercentage = constant.method.div(nowHeight, allHeight, 6);
                let param = {
                    lastChapterId: query.chapterId,
                    recordType: '0',
                    recordPercentage
                }
                api.novelApi.saveHistory(param)
            }

            return {
                ...toRefs(state)
            }
        }
    }
</script>

<style scoped>

</style>