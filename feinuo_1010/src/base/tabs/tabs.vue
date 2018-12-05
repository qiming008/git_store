<template>
  <van-tabbar v-model="active">
    <van-tabbar-item to='/home/pro_list'>
      <span>首页</span>
      <img :src="props.active?home1:home" alt="" slot="icon" slot-scope="props" class="icon_img">
    </van-tabbar-item>
    <van-tabbar-item to='/home/client'>
      <span>客户</span>
      <img :src="props.active?ld1:ld" alt="" slot="icon" slot-scope="props" class="icon_img">
    </van-tabbar-item>
    <van-tabbar-item to='/home/me'>
      <span>我的</span>
      <img :src="props.active?kh1:kh" alt="" slot="icon" slot-scope="props" class="icon_img">
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      active: 0,
      home:require('@/common/images/home.png'),
      home1:require('@/common/images/home1.png'),
      ld:require('@/common/images/ld.png'),
      ld1:require('@/common/images/ld1.png'),
      kh:require('@/common/images/kh.png'),
      kh1:require('@/common/images/kh1.png')
    }
  },
  watch:{
    $route(){
      var path = this.$route.path
      if(path.indexOf('pro_list')!==-1){
        this.active = 0
      }else if(path.indexOf('client')!==-1){
        this.active = 1
      }else if(path.indexOf('me')!==-1){
        this.active = 2
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
// .van-tabbar--fixed
//   position relative
  .van-tabbar-item--active
    color $color-button-green
.icon_img 
  // width 24px  
  height 24px
</style>
