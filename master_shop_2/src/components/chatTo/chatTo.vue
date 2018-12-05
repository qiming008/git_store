<template>
  <transition name="slide">
    <div class="cont">
      <top :title_name="'管家小店'" :chat="false"></top>
      <div class="text_box">
        <textarea v-model="val" placeholder="说点什么吧~"></textarea>
      </div>
      <div class="hf_btn" @click="qd">确定</div>
    </div>
  </transition>
</template>


<script>
import top from "@/base/top/top"
import axios from 'axios'
import { Toast } from 'vant'

export default{
  data(){
    return{
      val:''
    }
  },
  methods: {
    qd(){
      var that = this
      axios.get(``)
      .then(function (res) {
        if(res.data.code==200){
          that.$router.go(-1)
        }else{
          Toast(res.data.errdes);
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    }
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
  background-color #f5f5f5
  overflow-y scroll
  z-index 200
  .text_box
    margin-top 60px
    padding 10px
    textarea 
      background-color $color-background
      width 100%
      border solid 1px #dfdfdf
      min-height 350px
      box-sizing border-box
      padding 10px 
      font-size $font-size-medium
      border-radius 6px
  .hf_btn
    width 90%
    background linear-gradient(left,$color-text-button-left,$color-text-button-right)
    line-height 42px
    color $color-text-button
    text-align center 
    border-radius 50px
    position fixed
    bottom 16px
    left 50%
    margin-left -45%
    z-index 100


</style>