<template>
  <transition name="slide">
    <div class="cont" v-show="talktoyou">
      
      <div class="talk_box">
        <div class="talk_img" :style="'background-image:url('+bg_img+')'"></div>
        <div class="talk_box_box">
          <img src="./toyou.png" alt="" class="toyou">
          <p>{{talkcontent}}</p>
        </div>
        
      </div>
      <div class="close" @click="close">
        <van-icon name="close"  class="close_icon"/>
      </div>
    </div>
  </transition>
</template>

<script>
import top from "@/base/top/top"
import axios from 'axios'
import { Toast } from 'vant'
import { Icon } from 'vant'

export default{
  props:{
    talktoyou: {
      type: Boolean,
      default: true
    },
    talkcontent:{
      type: String,
      default: '管家很懒~'
    }
  },
  data(){
    return{
      bg_img:require('./talk.png')
    }
  },
  mounted(){
  },
  methods:{
    close(){
      this.$emit('close')
    }
  }
}

</script>


<style lang="stylus" scoped>
@import '~@/common/stylus/variable'
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}
.slide-enter, .slide-leave-to {
  transform: translate3d(0, -100%, 0);
}
.cont 
  position: fixed
  top: 0
  bottom: 0
  width: 100%
  z-index  99
  background-color rgba(0,0,0,.4)
  display flex
  align-items center
  justify-content center
  flex-direction column
  .talk_box 
    width 300px
    box-sizing border-box
    background-color #f1fafd
    border-radius 4px
    .talk_img 
      background-repeat no-repeat
      background-size contain
      width 100%
      height 0
      padding-top 53%
      z-index 10
      position relative
    .talk_box_box 
      border solid 12px #dcf3f9
      margin-top -12px
      padding-bottom 20px
      z-index 8
      position relative
      p 
        padding 4px 40px 0
        font-size $font-size-medium
        line-height 18px
        margin-bottom 5px
      .toyou 
        width 185px 
        height 26px
        margin 28px auto 10px
        display block
  .close 
    width 40px
    height 40px
    background-color rgba(0,0,0,.3)
    border-radius 50px
    margin 20px auto
    .close_icon 
      font-size 40px
      color $color-background-cont
</style>