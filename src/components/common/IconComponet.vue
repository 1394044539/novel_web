<template>
    <component :is="$antIcons[name]"/>
</template>

<script>
    export default {
        name: "IconComponet",
        setup(props,content){
            return {
                name: props.name
            }
        }
    }
</script>

<style scoped>

</style>