<template>
    <div/>
</template>

<script>
    export default {
        name: "Refresh",
        beforeRouteEnter(to, from, next) {
            next((xq) => {
                xq.$router.replace({
                    name: from.name,
                    params: to.params,
                    query: to.query,
                })
            })
        }
    }
</script>

<style scoped>

</style>