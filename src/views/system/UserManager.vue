<template>
    <div>
        <a-tabs v-model:activeKey="activeKey" style="text-align: center">
            <a-tab-pane key="userInfo" tab="用户信息">
                <UserInfoTab />
            </a-tab-pane>
            <a-tab-pane key="regInfo" tab="注册信息">
                <RegInfoTab />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
    import {reactive,toRefs} from "vue";
    import UserInfoTab from "../../components/user/manager/UserInfoTab";
    import RegInfoTab from "../../components/user/manager/RegInfoTab";

    export default {
        name: "UserManager",
        components: {RegInfoTab, UserInfoTab},
        setup(props,content){
            const state = reactive({
                activeKey: 'userInfo'
            })

            return {
                ...toRefs(state)
            }
        }
    }
</script>

<style scoped>

</style>