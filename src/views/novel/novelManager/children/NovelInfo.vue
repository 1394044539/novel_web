<template>
    <div>{{novelInfo}}</div>
</template>

<script>
    import { useRouter } from 'vue-router'
    import {onMounted,ref,reactive,toRefs} from "vue";
    import api from "../../../../api/api";

    export default {
        name: "NovelInfo",
        setup(){
            const router = useRouter();
            const state=reactive({
                novelInfo: {},
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
            return {
                ...toRefs(state),
            }
        }
    }
</script>

<style scoped>

</style>