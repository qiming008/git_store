<template>
  <transition name="slide">
    <div class="cont" v-if="shadow_show">
      <div class="bg_pay" v-if="pay_show">
        <p class="pay_tit van-hairline--bottom">
          <van-icon name="close"  class="close_icon" @click="close()"/>
          <span>确认付款</span>
        </p>
        <p class="price">￥{{price}}</p>
        <p class="pay_type">
          支付方式
        </p>
        <van-radio-group v-model="radio">
          <van-cell-group :border="border_line">
            <van-cell title="微信支付" icon="wechat" clickable @click="radio = '1'">
              <van-radio name="1" />
            </van-cell>
            <!-- <van-cell title="单选框 2" clickable @click="radio = '2'">
              <van-radio name="2" />
            </van-cell> -->
          </van-cell-group>
        </van-radio-group>
        <div class="hf_btn" @click="pay()">立即支付</div>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
import axios from 'axios'
import { Toast } from 'vant'
import { Icon } from 'vant'
import { mapGetters } from 'vuex'
export default{
  props:{
    price:{
      default:0.00
    },
    id:{
      type:Number,
      default:0.00
    },
    pay_show:{
      type:Boolean,
      default:false
    },
    shadow_show:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      radio: '1',
      border_line:false
    }
  },
  mounted(){
    
  },
  computed:{
    ...mapGetters(['wx'])
  },
  methods:{
    close(){
      this.$emit('close_pay')
    },
    pay:function(){
      if(this.wx==0){
        Toast('当前手机未安装微信客户端')
        return
      }
      this.$emit('pay')
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
  transform: translate3d(0, 100%, 0);
}
.cont 
  position: fixed
  top: 0
  bottom: 0
  width: 100%
  z-index  101
  background-color rgba(0,0,0,.4)
  .bg_pay 
    background-color $color-background
    position absolute
    bottom 0
    left 0
    width 100%
    padding-bottom 85px
    .pay_tit 
      font-size $font-size-medium-x
      line-height 50px
      text-align center
      width 100%
      .van-icon 
        position absolute
        padding 12px
        left 0
        top 2px
    .price 
      font-size 38px
      text-align center
      margin 40px 0 40px
    .pay_type 
      font-size $font-size-medium
      margin-left 20px
      color $color-text-readonly
    .van-cell-group 
      margin-top 6px
      .van-cell
        color #6d6d6d
        margin-right 20px
    .hf_btn
      width 90%
      background linear-gradient(to right,$color-text-button-left,$color-text-button-right)
      background -webkit-linear-gradient(to right,$color-text-button-left,$color-text-button-right)
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