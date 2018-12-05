<template>
  <transition name="slide">
    <div class="cont">
      <top title_name="信息详情"></top>
      <div class="xx_info">
        <p class="xx_top">
          <span class="tit">{{title}}</span>
          <span class="time">{{time}}</span>
        </p>
        <div class="info_cont" v-html="content"></div>
      </div>
    </div>
  </transition>
</template>

<script>
import top from '@/base/top/top'
import axios from 'axios'
import { Toast } from 'vant'

export default {
  data(){
    return {
      content: this.$route.query.content,
      time: this.$route.query.time,
      title: this.$route.query.title
    }
  },
  mounted(){
    
  },
  components:{
    top
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable'
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
.cont 
  position: fixed
  top: 0
  bottom: 0
  width: 100%
  z-index  99
  background-color $color-background-cont
  .xx_info 
    margin-top 60px
    border-top solid 1px $color-background
    padding 10px
    font-size $font-size-medium
    .xx_top 
      display flex
      justify-content space-between
      margin-bottom 10px
      .time 
        font-size $font-size-small
        color $color-text-little

</style>