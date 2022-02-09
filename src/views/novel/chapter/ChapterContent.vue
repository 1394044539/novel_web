<template>
    <div style="padding: 0 10%">
        <div v-html="item" v-for="(item,index) in content.context"></div>
    </div>
</template>

<script>
    import { reactive,toRefs,onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import api from "../../../api/api";
    import constant from '../../../common/constant'
    import '../../../common/index.less'

    export default {
        name: "ChapterContent",
        setup(props,content){
            const state = reactive({
                content: []
            })
            let route = useRouter()
            let query = route.currentRoute.value.query
            onMounted(()=>{
                getChapterContent()
                saveHistory()
            })
            const getChapterContent = () => {
                let param = { chapterId: query.chapterId }
                api.novelApi.getChapterContent(param).then(res=>{
                    state.content = res
                })
            }

            //保存历史记录
            const saveHistory = () => {
                let allHeight=parseInt(document.body.scrollHeight);
                let nowHeight=window.pageYOffset
                let recordPercentage = constant.method.getPercent(nowHeight,allHeight);
                let param={
                    lastChapterId: query.chapterId,
                    recordType: '0',
                    recordPercentage
                }
                debugger
                console.log(param);
                api.novelApi.saveHistory(param)
            }

            return{
                ...toRefs(state)
            }
        }
    }
</script>

<style scoped>

</style>