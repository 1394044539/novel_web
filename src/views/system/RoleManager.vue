<template>
    <div>
        <a-tabs v-model:activeKey="activeKey" style="text-align: center">
            <a-tab-pane key="roleManager" tab="角色管理">
                <RoleManagerTab />
            </a-tab-pane>
            <a-tab-pane key="permissionManager" tab="权限管理">
                <h2>暂无此功能</h2>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
    import {reactive,toRefs} from "vue";
    import RoleManagerTab from "../../components/user/role/RoleManagerTab";

    export default {
        name: "RoleManager",
        components: {RoleManagerTab},
        setup(props,content){
            const state=reactive({
                activeKey: 'roleManager'
            })

            return{
                ...toRefs(state)
            }
        }
    }
</script>

<style scoped>

</style>