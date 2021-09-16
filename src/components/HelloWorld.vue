<template>
  <div class="hello">
    <a-button type="primary">{{value}}<HomeOutlined /></a-button>
    <a-input v-model:value="value" placeholder="Basic usage" />
  </div>
</template>

<script>

  import {ref} from 'vue'

  export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup(){
    let value=ref(1)

    return{
      value
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
