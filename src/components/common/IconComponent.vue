<template>
    <component :is="$antIcons[name]"/>
</template>

<script>
    export default {
        name: "IconComponent",
        props:{
          name: String
        },
        setup(props,content){
        }
    }
</script>

<style scoped>

</style>