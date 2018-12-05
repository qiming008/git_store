<template>
  <transition name="slide">
    <div class="cont1">
      <top title_name="分销规则"></top>
      <p class="tit" v-html="tit"></p>
      <div class="nr" v-html="cont"></div>
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
  .cont1
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    background-color $color-background-cont
    z-index 100
    overflow-y scroll
    .tit 
      padding 80px 12px 18px
      font-size $font-size-medium-x
      font-weight bold
    .nr 
      padding 0 12px 
      
</style>