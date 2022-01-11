<template>
    <div>
        <h2>公告页面</h2>
        <div></div>
    </div>
</template>

<script>
    import { reactive, toRefs} from 'vue'

    export default {
        name: "NoticeList",
        setup(props,content){
            const state = reactive({
                noticeList: []
            })


            return {
                ...toRefs(state)
            }
        }
    }
</script>

<style scoped>

</style>