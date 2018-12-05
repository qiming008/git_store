<template>
  <transition name="fade">
    <div class="refund">
      <top :title_name="'申请退款原因'" :arrow="true"></top>
      
      <div class="refund_box" v-if="info">
        <div class="shop">
          <div class="shopimg" :style="{'background-image':'url('+info.img_url+')'}"></div>
          <div class="shopinfo">
            <h1 class="shop_tit">{{info.goods_name}}</h1>
            <div class="guige_box">
              <span>{{info.norms}}</span>
            </div>
            <div class="price_box">
              <span class="price">￥{{info.price}}</span>
              <span class="num">x{{info.count}}</span>
            </div>
          </div>
        </div>
        <div class="tkmoney"><span>退款金额：</span><span class="money_yang">￥{{money}}</span></div>
        <!-- <p class="desc">*最多可退￥{{info.price*info.count}}</p> -->
        <p class="tit">请输入退款原因</p>
        <textarea v-model="reason"></textarea>
        <div class="btn_box" @click="sure">提交</div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import top from '@/base/top/top'
import { Toast } from 'vant'
import axios from 'axios'
export default {
  data() {
    return {
      info: this.$route.query.info,
      money: this.$route.query.info.price*this.$route.query.info.count, // 输入框金额
      reason: ''
    }
  },
  methods: {
    sure() { // 确认退款
      let money = this.money
      let reason = this.reason.replace(/\s*/g, '')
      if (money > this.info.price * this.info.count) {
        Toast(`退款金额不能大于${this.info.price * this.info.count}`)
      } else if (reason === '') {
        Toast('请输入退款原因')
      } else {
        axios.get(`/api/order/refund/up?order_line_id=${this.info.id}&liyou=${reason}&price=${money}`)
        .then((res) => {
          if(res.data.code===200){
            this.$router.back()
          }else{
            Toast(res.data.msg)
          }
        })
        .catch((error) => {
          Toast('网络异常')
          console.log(error)
        })
      }
    }
  },
  components: {
    top
  }
}
</script>

<style scoped lang="stylus">
  @import '~@/common/stylus/variable'
  .fade-enter-active,.fade-leave-active
    transition all 0.3s
  .fade-enter,.fade-leave-to
    transform translate3d(100%,0,0)
  .refund
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    z-index 999
    background $color-background
    overflow-y auto
    -webkit-overflow-scrolling touch
    .refund_box
      margin-top 60px
      padding 0 28px
      color $color-text
      background $color-background
      border-radius 5px
      .shop
        display flex
        align-items center
        padding 25px 0
        .shopimg
          width 90px
          height 90px
          margin-right 20px
          background-repeat no-repeat
          background-position center center
          background-size contain
        .shopinfo
          flex 1
          min-width 0
          .shop_tit
            line-height 22px
            font-size $font-size-medium
            margin-bottom 10px
            display -webkit-box !important
            overflow hidden
            text-overflow ellipsis
            word-break break-all
            -webkit-box-orient vertical
            -webkit-line-clamp 2
          .guige_box
            margin-bottom 15px
            font-size $font-size-medium
            color $color-text-r
          .price_box
            display flex
            align-items center
            justify-content space-between
            .price
              font-size $font-size-medium-x
              color $color-order-highlight
            .num
              font-size $font-size-medium
      .tkmoney
        display flex
        align-items center
        width 100%
        height 35px
        margin-bottom 8px
        box-sizing border-box
        border-radius 5px
        font-size $font-size-medium
        .money_yang
          color $color-order-highlight
        input
          flex 1
          min-width 0
          height 100%
          color $color-order-highlight
      .desc
        line-height 14px
        margin-bottom 12px
        font-size $font-size-small
        color $color-btn-2
      .tit
        line-height 50px
        font-size $font-size-medium
      textarea
        width 100%
        height 120px
        resize none
        padding 12px
        line-height 1.5
        box-sizing border-box
        border 1px solid #f5f5f5
        font-size $font-size-medium
        border-radius 5px
      .btn_box
        width 100%
        height 44px
        line-height 44px
        text-align center
        margin-top 65px
        color $color-text-button
        font-size $font-size-medium-x
        border-radius 22px
        background linear-gradient(to right, $color-btn-1 , $color-order-highlight)
</style>
