<template>
    <div>
        <QuickUpload :quickUploadModal="quickUploadModal" @closeForm="closeForm"/>
        <a-button @click="openTest">测试</a-button>
    </div>
</template>

<script>
    import QuickUpload from "../../components/novel/QuickUpload";
    import {ref} from "vue";
    export default {
        name: "MyNovel",
        components: {QuickUpload},
        setup(props, context) {
            const closeForm = () => {
                quickUploadModal.value = false
            }
            const openTest = () => {
                quickUploadModal.value = true
            }
            let quickUploadModal=ref(false)
            return {
                quickUploadModal,
                closeForm,
                openTest
            }
        }
    }
</script>

<style scoped>

</style>