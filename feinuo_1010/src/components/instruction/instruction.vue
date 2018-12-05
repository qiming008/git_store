<template>
  <transition name="slide">
    <div class="cont">
      <top title_name="菲诺旅居"></top>
      <div class="nr">
        <p>菲诺旅居团长端是专为团长服务的APP，顺应互联网流量红利的周期发展，通过分享和裂变的方式，让您赶上最后的流量红利。</p>
        <p>在团长端中团长可以直接分享链接到朋友圈让目标用户直接报名，并且可以随时查看用户当前的报名与买房状态，团长端还可针对团长进行线上培训，提升团长的专业性，使团长能更快更精准的找到用户。</p> 
        
      </div>
    </div>
  </transition>
</template>


<script type="text/ecmascript-6">
import Top from '@/base/top/top'
export default {
  data() {
    return {
      tit:this.$route.query.tit,
      cont:this.$route.query.cont
    }
  },
  methods: {

  },
  components: {
    Top
  }
}

</script>

<style scoped lang="stylus">
@import '~@/common/stylus/variable'
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
  .cont
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    background-color $color-background-cont
    z-index 100
    overflow-y scroll
    .nr 
      padding 70px 12px 
      font-size $font-size-medium
      color $color-text
      line-height 1.5
    p 
      margin-top 10px
</style>