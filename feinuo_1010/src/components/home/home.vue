<template>
  <div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <tabs></tabs>
  </div>
</template>


<script>
import tabs from '@/base/tabs/tabs'

export default {
  data(){
    return {

    }
  },
  mounted(){
  },
  components:{
    tabs
  }
}
</script>

<style lang="stylus" scoped>
  // .home_cont
  //   height 100%
  //   display flex
  //   flex-direction column
  //   .home_container
  //     flex 1
    // .home_tabs
//.cont
  // position fixed
  // top 0
  // left 0
  // right 0
  // bottom 0
  // height 100%
</style>
