<template>
    <div>{{novelId}}</div>
</template>

<script>
    import { useRouter } from 'vue-router'

    export default {
        name: "NovelInfo",
        setup(){
            const router = useRouter();
            const routeValue = router.currentRoute.value
            return {
                novelId: routeValue.query.novelId
            }
        }
    }
</script>

<style scoped>

</style>