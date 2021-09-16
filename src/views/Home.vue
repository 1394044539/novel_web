<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>


  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { HomeOutlined } from '@ant-design/icons-vue'
import {ref} from 'vue'
export default {
  name: 'Home',
  components: {
    HelloWorld,
    HomeOutlined
  },
  setup(){
    const value=ref(3)

    return{
      value:value
    }
  }
}
</script>
