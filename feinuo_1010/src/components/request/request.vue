<template>
  <transition name="slide">
    <div class="cont">
      <top :title_name="'菲诺旅居'"></top>
      <img src="./tijiao.png" alt="" class="tj_img">
      <p>申请已提交<br/>
        工作人员会尽快与您联系，请您耐心等待</p>
    </div>
  </transition>
</template>

<script>
import top from '@/base/top/top'

  export default{
    data(){
      return {
        
      }
    },
    components:{
      top
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
.cont 
  height 100%
  overflow hidden
.tj_img 
  width 106px
  height 94px
  margin 160px auto 25px
  transform:translate(10px,0)
  display block
p 
  color $color-button
  text-align center 
  line-height 1.5
</style>
