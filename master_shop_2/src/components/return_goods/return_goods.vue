<template>
  <transition name="fade">
    <div class="refund">
      <top :title_name="'填写退货信息'" :arrow="true"></top>
      
      <div class="refund_box" v-if="info">
        <div class="shop" v-for="item in info">
          <div class="shopimg" :style="{'background-image':'url('+item.orderLine.img_url+')'}"></div>
          <div class="shopinfo">
            <h1 class="shop_tit">{{item.orderLine.goods_name}}</h1>
            <div class="guige_box">
              <span>{{item.orderLine.norms}}</span>
            </div>
            <div class="price_box">
              <span class="price">￥{{item.orderLine.price}}</span>
              <span class="num">x{{item.orderLine.count}}</span>
            </div>
          </div>
        </div>

        <p class="info_p">
          <label>快递公司</label>
          <input type="text" placeholder="请填写快递公司名称" v-model="kdgs">
        </p>
        <p class="info_p">
          <label>快递单号</label>
          <input type="text" placeholder="请填写快递单号" v-model="kddh">
        </p>
        <p class="info_p">
          <label>联系方式</label>
          <input type="text" placeholder="请填写联系方式" v-model="lxfs">
        </p>
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
      kdgs:'',
      kddh:'',
      lxfs:''
    }
  },
  mounted(){
  },
  methods: {
    sure() { // 确认退款
      let _kdgs = this.kdgs.replace(/\s*/g, '')
      let _kddh = this.kddh.replace(/\s*/g, '')
      let _lxfs = this.lxfs.replace(/\s*/g, '')
      if(!(/^1[3456789]\d{9}$/.test(_lxfs))){ 
        Toast("联系方式有误，请重填");  
        return false; 
      }else if(_kdgs===''||_kddh===''){
        Toast('请输入快递公司/单号')
        return
      } 
      axios.get(``)
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
      .info_p
        font-size $font-size-medium
        margin-bottom 40px
        color $color-text
        width 100%
        display flex
        line-height 1.2
        label 
          width 60px
          margin-right 10px
        input 
          flex 1
          min-width 0
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
