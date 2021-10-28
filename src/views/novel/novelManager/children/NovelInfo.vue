<template>
    <div>{{novelInfo}}</div>
</template>

<script>
    import { useRouter } from 'vue-router'
    import {onMounted,ref,reactive} from "vue";
    import api from "../../../../api/api";

    export default {
        name: "NovelInfo",
        setup(){
            const router = useRouter();
            onMounted(()=>{
                initNovelData();
            })
            let novelInfo=reactive({novelId:''});
            const initNovelData = () => {
                const routeValue = router.currentRoute.value
                api.novelApi.getNovelData({novelId:routeValue.query.novelId}).then(res=>{
                    novelInfo.novelId = res.novelId
                })
            }
            return {
                novelInfo,
            }
        }
    }
</script>

<style scoped>

</style>