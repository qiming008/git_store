<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <tabs></tabs>
  </div>
</template>

<script>
import tabs from '@/components/tabs/tabs'
import axios from 'axios'
import { Toast } from 'vant'

export default {
  data(){
    return{
    }
  },
  mounted(){
  },
  methods:{
  },
  components:{
    tabs
  }
}
</script>

<style lang="stylus" scoped>
</style>

