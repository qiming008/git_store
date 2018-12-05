<template>
  <div class="cont">
    <top title_name="账号管理"></top>
    <div class="zhanghao">
      <img src="./icon.png" alt="">
      <p>{{tel}}</p>
      <div class="btn" @click="update_tel">更换手机号</div>
    </div>
    <transition name="slide">
      <router-view class="Router"></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import Top from "@/base/top/top";
import { Dialog } from 'vant';
import { mapActions } from 'vuex'
export default{
  data(){
    return {
      tel:this.$route.query.tel
    }
  },
  mounted(){
  },
  methods:{
    update_tel() {
      this.$router.push({path: '/edit_tel'})
    }
  },
  components:{
    Top
  }
}


</script>


<style scoped lang="stylus">
@import '~@/common/stylus/variable';
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}
.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
.cont
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: $color-background-cont;
  overflow-y: scroll;
  z-index: 10;
  .zhanghao
    margin-top 60px
    padding-top 100px
    text-align center
    img
      width 63px
    p
      line-height 70px
      color #6d6d6d
      font-size $font-size-large
  .btn
    width 80%
    height 44px
    line-height 44px
    text-align center
    color #fff
    background $color-button
    background $color-button-webkit
    margin 0 auto
    border-radius 44px
</style>
