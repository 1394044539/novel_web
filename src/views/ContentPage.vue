<template>
    <div>
        <div v-html="item" v-for="(item,index) in content.context"></div>
    </div>
</template>

<script>
    import { reactive,toRefs,onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import api from "../api/api";
    import '../common/index.less'

    export default {
        name: "ContentPage",
        setup(props,content){
            const state = reactive({
                content: []
            })
            let route = useRouter()
            let query = route.currentRoute.value.query
            onMounted(()=>{
                getChapterContent()
            })
            const getChapterContent = () => {
                let param = { chapterId: query.chapterId }
                api.novelApi.getChapterContent(param).then(res=>{
                    document.title = res.chapterName
                    state.content = res
                })
            }

            return{
                ...toRefs(state)
            }
        }
    }
</script>

<style scoped>

</style>