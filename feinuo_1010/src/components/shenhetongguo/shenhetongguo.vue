<template>
  <transition name="slide">
    <div class="cont">
      <top :title_name="'审核通过'"></top>
      <img src="./tijiao.png" alt="" class="tj_img">
      <p>您已审核通过，等待公司审核<br/>
        请尽快完善客户信息，助您审核通过</p>
      <div class="btn" @click="go_item">完善客户信息</div>
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
    methods:{
      go_item(){
        this.$router.replace({path: `/home/client/${this.$route.query.id}`, query: {userid: this.$route.query.id}})
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
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color #fff
  overflow hidden
  z-index 999
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
  .btn 
    width 150px
    line-height 30px
    color $color-button-green
    border solid 1px $color-button-green
    font-size $font-size-medium
    border-radius 50px
    text-align center
    margin 20px auto
</style>
