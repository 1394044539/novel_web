<template>
  <a-config-provider :locale="locale">
    <div id="nav">
      <router-view/>
    </div>
  </a-config-provider>
</template>
<script setup>
  import locale from 'ant-design-vue/es/locale/zh_CN'
</script>
<style>
#app {
/*  font-family: Avenir, Helvetica, Arial, sans-serif;*/
/*  -webkit-font-smoothing: antialiased;*/
/*  -moz-osx-font-smoothing: grayscale;*/
/*  text-align: center;*/
/*  color: #2c3e50;*/
  height: 100%;
}

#nav {
  height: 100%;
}
</style>
