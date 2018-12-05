<template>
  <transition name="fade">
    <div class="order_detail">
      <top :title_name="'订单详情'" :arrow="true" to="/order"></top>
      <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh" v-if="detail && detail.order"> -->
        <div class="detail_box" v-if="detail.order" :class="{'detail_padd':(time > 0 && detail.order.status === 0) || detail.order.status < 4}">
          <!-- 主订单状态 -->
          <div v-if="rk == 0">
            <div class="order_state" v-if="detail.order.status === 0">
              <h1 class="tit">{{time > 0 ? '等待买家付款' : '交易关闭'}}</h1>
              <p class="desc">{{time > 0 ? time1 + '内未付款，订单将自动取消' : '超时未支付'}}</p>
            </div>
            <div class="order_state" v-else-if="detail.order.status === 1">
              <h1 class="tit">等待管家接单</h1>
              <p class="desc">如果管家在付款后24小时内未接单，将自动退款给您</p>
            </div>
            <div class="order_state" v-else-if="detail.order.status === 2">
              <h1 class="tit">等待管家发货</h1>
              <p class="desc">如果管家在接单后3天内未发货，将自动退款给您</p>
            </div>
            <div class="order_state" v-else-if="detail.order.status === 3 && detail.count === 0">
              <h1 class="tit">待收货</h1>
              <p class="desc">管家发货15天后自动确认收货</p>
            </div>
            <div class="order_state" v-else-if="detail.order.status === 4">
              <h1 class="tit">交易成功</h1>
            </div>
            <div class="order_state" v-else-if="detail.order.status === 10">
              <h1 class="tit">交易关闭</h1>
            </div>
            <div class="order_state" v-else-if="detail.count > 0">
              <h1 class="tit">待收货</h1>
              <p class="desc">您有商品已发起退款申请，详情查看订单->退款订单</p>
            </div>
          </div>
          <!-- 子订单状态 -->
          <div v-else-if="rk == 1">
            <div class="order_state" v-if="refundInfo.orderRefund.status === 0 && refundInfo.orderRefund.suo === 0">
              <h1 class="tit">退款申请中</h1>
              <p class="desc">在您发起退款后，管家3天内若不处理该订单，平台将自动退款给您</p>
            </div>
            <div class="order_state" v-else-if="refundInfo.orderRefund.status === 2 && refundInfo.orderRefund.suo === 0">
              <h1 class="tit">管家拒绝退款</h1>
              <p class="desc">您可申请客服介入，否则自被拒绝时起15天后将自动确认收货</p>
            </div>
            <div class="order_state" v-else-if="refundInfo.orderRefund.status === 0 && refundInfo.orderRefund.suo === 1">
              <h1 class="tit">已申请客服介入</h1>
              <p class="desc">如客服在介入后3天内未处理，将自动退款给您</p>
            </div>
           <div class="order_state" v-else-if="refundInfo.orderRefund.status === 2 && refundInfo.orderRefund.suo === 2">
              <h1 class="tit">客服拒绝退款</h1>
              <p class="desc">订单将继续进行，15天后将自动确认收货</p>
            </div>
            <div class="order_state" v-else-if="refundInfo.orderRefund.status === 1">
              <h1 class="tit">退款中</h1>
            </div>
            <div class="order_state" v-else-if="refundInfo.orderRefund.status === 3">
              <h1 class="tit">交易关闭</h1>
              <p class="desc">退款成功</p>
            </div>
            <div class="order_state" v-else-if="refundInfo.orderRefund.status === 10">
              <h1 class="tit">交易关闭</h1>
            </div>
          </div>
          <div class="info_box" v-if="detail.userAddress">
            <h1 class="tit">配送信息</h1>
            <div class="info">
              <span class="info_l">收&nbsp;&nbsp;货&nbsp;&nbsp;人</span>
              <p class="info_r">{{detail.userAddress.name}}</p>
            </div>
            <div class="info">
              <span class="info_l">联系方式</span>
              <p class="info_r">{{detail.userAddress.tel}}</p>
            </div>
            <div class="info">
              <span class="info_l">收货地址</span>
              <p class="info_r">{{detail.userAddress.area}}{{detail.userAddress.address}}</p>
            </div>
            <div class="info" v-if="detail.order.note">
              <span class="info_l">备&emsp;&emsp;注</span>
              <p class="info_r beizhu_txt">{{detail.order.note}}</p>
            </div>
          </div>
          <div class="shop_box">
            <h1 class="tit">管家小店（{{detail.userAddress.buluo_name}}）</h1>
            <ul>
              <li v-for="item in detail.orderLineList" :key="item.orderLine.id">
                <div class="item">
                  <div class="shopimg" :style="{'background-image':'url('+item.orderLine.img_url+')'}"></div>
                  <div class="shopinfo">
                    <h1 class="shop_tit">{{item.orderLine.goods_name}}</h1>
                    <div class="guige_box">
                      <span class="num" v-if="(rk == 0 && detail.order.status === 3) || (rk == 1 && item.orderRefund.status <= 2)">x{{item.orderLine.count}}</span>
                      <span>{{item.orderLine.norms}}</span>
                    </div>
                    <div class="price_box" v-if="rk==0">
                      
                      <span class="price">￥{{item.orderLine.price}}</span>
                      <span class="num" v-if="detail.order.status !== 3">x{{item.orderLine.count}}</span>
                      <span class="tuikuan_btn" @click="refund_one(item.orderLine)" v-else-if=" detail.order.status === 3 && item.orderLine.state == 0 ">申请退款</span>

                      <!--退款完成-->
                      <span class="tuikuan_btn—btn" v-else-if=" item.orderRefund.status==3" >退款完成</span>

                      <span class="tuikuan_btn" @click="kefu(item.orderRefund.id)" v-else-if="item.orderRefund && item.orderRefund.status==2 && item.orderRefund.suo==0">客服介入</span>
                      <!--客服同意-->
                      <span class="tuikuan_btn—btn" v-else-if=" detail.order.status === 3 && item.orderRefund.suo==1" >同意退款</span>

                      <span class="tuikuan_btn" @click="cancel_refund(item.orderRefund.id)" v-else-if="detail.order.status === 3 && item.orderRefund && item.orderRefund.status==0">取消退款</span>
                      <!--管家同意-->
                      <span class="tuikuan_btn—btn" v-else-if=" detail.order.status === 3 && item.orderRefund.status==1" >同意退款</span>
                      
                    </div>
                    <div class="price_box" v-else-if="rk==1">
                      <span class="price">￥{{item.orderLine.price}}</span>
                      <!--退款完成-->
                      <span class="tuikuan_btn—btn" v-if=" item.orderRefund.status==3" >退款完成</span>
                      <span class="tuikuan_btn" @click="kefu(item.orderRefund.id)" v-else-if="item.orderRefund.status === 2 && item.orderRefund.suo === 0">客服介入</span>
                      <!--客服同意-->
                      <span class="tuikuan_btn—btn" v-else-if=" detail.order.status === 3 && item.orderRefund.suo==1">同意退款</span>
                      <span class="tuikuan_btn" @click="cancel_refund(item.orderRefund.id)" v-else-if="item.orderRefund.status==0">取消退款</span>
                      <!--管家同意-->
                      <span class="tuikuan_btn—btn" v-else-if=" detail.order.status === 3 && item.orderRefund.suo==1">同意退款</span>
                      <span class="num" v-else>x{{item.orderLine.count}}</span>
                    </div>
                  </div>
                </div>
                <p class="tit1">备注<span class="info" v-html="!item.note?'暂无备注':item.note"></span></p>
              </li>
            </ul>
            <div class="total_box">
              <span>共{{count}}件商品</span>
              <i>合计：</i>
              <span class="price">￥{{detail.order.pay_price}}</span>
            </div>
          </div>
          <div class="tuikuan_box" v-if="detail.count>0 || rk === 1">
            <div class="tit">退款流程</div>
            <van-swipe class="van_swipe">
              <van-swipe-item class="van_swipe_item" v-for="item in detail.orderLineList" v-if="item.refundRecord.length>0" :key="item.id">
                <div class="shop">
                  <div class="shopimg" :style="{'background-image':'url('+item.orderLine.img_url+')'}"></div>
                  <div class="shopinfo">
                    <h1 class="shop_tit">{{item.orderLine.goods_name}}</h1>
                    <div class="guige_box">
                      <span>{{item.orderLine.norms}}</span>
                    </div>
                  </div>
                </div>
                <div class="liucheng" v-for="(item1,index) in item.refundRecord" :key="item1.id">
                  <div class="liucheng_l">
                    <div class="circle" v-if="index==0">
                      <div class="circle_inner"></div>
                    </div>
                    <div class="circle1" v-else></div>
                    <div class="shuxian" v-if="index!=(item.refundRecord.length-1)"></div>
                  </div>
                  <div class="liucheng_r">
                    <p>{{item1.title}}</p>
                    <p class="desc" v-html="item1.detail"></p>
                    <p>{{item1.create_time}}</p>
                  </div>
                </div>
              </van-swipe-item>
            </van-swipe>
          </div>
          <div class="info_box">
            <div class="tit">订单信息</div>
            <div class="info">
              <span class="info_l">订单编号</span>
              <p class="info_r">{{detail.order.order_code}}</p>
            </div>
            <div class="info">
              <span class="info_l">下单时间</span>
              <p class="info_r">{{detail.order.addtime}}</p>
            </div>
            <div class="info" v-if="detail.order.pay_time">
              <span class="info_l">支付方式</span>
              <p class="info_r">{{detail.order.pay_type===0?'微信支付':detail.order.pay_type===1?'支付宝':'余额支付'}}</p>
            </div>
            <div class="info" v-if="detail.order.pay_time">
              <span class="info_l">支付时间</span>
              <p class="info_r">{{detail.order.pay_time}}</p>
            </div>
            <div class="info" v-if="detail.order.jiedantime">
              <span class="info_l">接单时间</span>
              <p class="info_r">{{detail.order.jiedantime}}</p>
            </div>
            <div class="info" v-if="detail.order.shipmentstime">
              <span class="info_l">发货时间</span>
              <p class="info_r">{{detail.order.shipmentstime}}</p>
            </div>
            <div class="info" v-if="detail.order.status==4">
              <span class="info_l">收货时间</span>
              <p class="info_r">{{detail.order.caozuotime}}</p>
            </div>
            <div class="info" v-if="detail.order.status==4||detail.order.status==10">
              <span class="info_l">结束时间</span>
              <p class="info_r">{{detail.order.caozuotime}}</p>
            </div>
          </div>
        </div>
      <!-- </van-pull-refresh> -->
      <div style="background-color:#fff;z-index:100" v-if="detail && detail.order && rk == 0 ">
        <div class="btn_box" v-if="time > 0 && detail.order.status === 0">
          <div class="gray_btn" @click="cancel_order">取消订单</div>
          <div class="org_btn" @click="zhifu">立即支付</div>
        </div>
        <div class="btn_box" v-if="detail.order.status === 1 || detail.order.status === 2">
          <div class="org_btn" @click="refund_all">申请退款</div>
        </div>
        <div class="btn_box" v-if="detail.order.status === 3">
          <div class="org_btn" @click="confirm_goods">确认收货</div>
        </div>
      </div>
      <div style="background-color:#fff;z-index:100" v-else-if="detail && detail.order && rk == 1 ">
        <div class="btn_box">
          <div class="org_btn" @click="regoods(detail.orderLineList)">退货</div>
        </div>
      </div>
      <pay :price="price" :shadow_show="shadow_show" :pay_show="pay_show" :id="id" @pay="pay" @close_pay="close_pay"></pay>
      <router-view/>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import top from '@/base/top/top'
import pay from '@/base/pay/pay'
import { Dialog, Toast } from 'vant'
import axios from 'axios'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      id: this.$route.query.id, // 订单详情id
      rk: this.$route.query.rk, // 是否是退款子订单
      detail: '',
      refundInfo: '', //退款订单的信息
      isLoading: false, // 下拉刷新状态
      time:0, // 倒计时秒
      time1: '', // 到时间计算以后的具体时间（00:30:00）
      pay_show:false,
      shadow_show:false,
      buluo: {},
      shop: {},
      kg: 0,
      price:0.00,
      zf_kg:true
    }
  },
  computed: {
    count() {
      let tot = 0
      for (let i = 0; i < this.detail.orderLineList.length; i++) {
        tot += this.detail.orderLineList[i].orderLine.count
      }
      return tot
    }
    // ...mapGetters(['shop', 'buluo'])
  },
  mounted() {
    this.kg= this.$route.query.kg
    this.buluo=JSON.parse(this.$route.query.buluo)
    this.shop=JSON.parse(this.$route.query.shop)
    if(this.kg==1){
      this.id=this.$route.query.id
      // this.rk=this.$route.query.rk
      // this.shadow_show = true
      this.$store.commit('set_buluo', this.buluo)
      this.$store.commit('set_shop', this.shop)
      this.$router.push({path:'/pay_mid',query:{id:this.id}})
    }else{
      this.shadow_show = false
    }
    this.get_detail()
  },
  methods: {
    get_detail() {
      let that = this
      let url = `/api/order/detail?order_id=${this.id}`
      if (this.rk === 1) {
        url = `/api/order/refund/detail?id=${this.id}`
      }
      axios.get(url)
      .then((res) => {
        if(res.data.code===200){
          if (this.rk === 1) {
            that.detail = {}
            that.detail.order = res.data.data.order
            that.detail.userAddress = res.data.data.userAddress
            that.detail.orderLineList = []
            that.detail.orderLineList.push({orderLine: res.data.data.orderline, orderRefund:res.data.data.orderRefund, refundRecord: res.data.data.refundRecordList})
            that.refundInfo = that.detail.orderLineList[0]
          } else {
            that.detail = res.data.data
            if (that.detail.order.status === 0) {
              this.time = this.detail.date
              that.djs()
            }
          }
          that.isLoading = false
        }else{
          Toast(res.data.msg)
        }
      })
      .catch((error) => {
        Toast('网络异常')
        console.log(error)
      })
    },
    onRefresh(){
      clearTimeout(cc)
      var cc = setTimeout(() => {
        this.get_detail()
      }, 500)
    },
    zhifu() {
      this.shadow_show = true     
      this.pay_show = true
      this.price = this.detail.order.pay_price
    },
    pay() { // 待付款立即支付
      if(!this.zf_kg){
        return
      }
      this.zf_kg=false
      let that = this
      let url = window.location.href
      if(url.indexOf('&kg')!=-1){
        url  = window.location.href.replace('&kg=0','&kg=1')
      }else{
        url  = window.location.href + `&kg=1`
      }
      url = encodeURIComponent(url)
      axios.get(`api/order/pay/wechat?id=${this.id}`)
      .then( (res) => {
        that.zf_kg = true
        if(res.data.code==200){
          window.location.href =  res.data.data +`&redirect_url=${url}`
        }else{
          Toast(res.data.msg);
        }
      })
      .catch((error) => {
        Toast('网络异常');
        console.log(error);
        that.zf_kg = true
      })
    },
    close_pay(){
      this.shadow_show=false
    },
    cancel_order() { // 待付款取消订单
      axios.get(`/api/order/clear?order_id=${this.id}`)
      .then((res) => {
        if(res.data.code===200){
          this.get_detail()
        }else{
          Toast(res.data.msg);
        }
      })
      .catch((error) => {
        Toast('网络异常')
        console.log(error)
      })
    },
    refund_all() { // 待接单、待发货申请退款
      Dialog.confirm({
        message: '确认要申请退款吗？'
      }).then(() => {
        // on confirm
        axios.get(`/api/order/refund/all?order_id=${this.id}`)
        .then((res) => {
          if(res.data.code===200){
            this.get_detail()
          }else{
            Toast(res.data.msg);
          }
        })
        .catch((error) => {
          Toast('网络异常')
          console.log(error)
        })
      }).catch(() => {
        // on cancel
      })
    },
    refund_one(item) { //申请退款：待派送单个商品申请退款/用户取消退款申请后再次
      this.$router.push({path: '/refund', query: {info: item}})
    },
    regoods(item) { //申请退货
      this.$router.push({path: '/regoods', query: {info: item}})
    },
    confirm_goods() { // 确认收货
      var str = '是否要确认收货'
      var confirmButtonText = '是'
      var cancelButtonText = '否'
      if (this.detail.count > 0) {
        str = '您还有正在退款的商品，点击确认后，这些商品也将确认收货'
        confirmButtonText = '确认'
        cancelButtonText = '取消'
      }
      Dialog.confirm({
        message: str,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText
      }).then(() => {
        // on confirm
        axios.get(`/api/order/succces?order_id=${this.id}`)
        .then((res) => {
          if(res.data.code===200){
            this.get_detail()
          }else{
            Toast(res.data.msg);
          }
        })
        .catch((error) => {
          Toast('网络异常')
          console.log(error)
        })
      }).catch(() => {
        // on cancel
      })
    },
    kefu(id) { // 申请客服介入
      Dialog.confirm({
        message: '确认申请客服介入吗？一旦客服介入，不可取消退款申请'
      }).then(() => {
        // on confirm
        axios.get(`/api/order/suo?id=${id}`)
        .then((res) => {
          if(res.data.code===200){
            this.get_detail()
          }else{
            Toast(res.data.msg);
          }
        })
        .catch((error) => {
          Toast('网络异常')
          console.log(error)
        })
      }).catch(() => {
        // on cancel
      })
    },
    cancel_refund(id) { // 取消退款：子订单取消
      let that = this
      axios.get(`/api/order/refund/detele?id=${id}`)
      .then((res) => {
        if(res.data.code===200){
          if (that.rk === 0) {
            this.get_detail()
          } else {
            this.$router.back()
          }
        }else{
          Toast(res.data.msg);
        }
      })
      .catch((error) => {
        Toast('网络异常')
        console.log(error)
      })
    },
    djs() { // 代付款状态下订单剩余时间倒计时
      clearInterval(jsq)
      if (this.time <= 0) {
        return
      }
      this.time1 = this.get_time(this.time)
      let jsq = setInterval(() => {
        this.time --
        if (this.time < 0) {
          this.get_detail()
          clearInterval(jsq)
          return
        }
        this.time1 = this.get_time(this.time)
      }, 1000)
    },
    _pad(num, n = 2) { // 补0
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    get_time(t) { // 根据秒计算时分秒
      let m = Math.floor(t / 60)
      let s = t - m * 60
      return `00:${this._pad(m)}:${this._pad(s)}`
    },
    ...mapMutations([
      'set_buluo',
      'set_shop'
    ])
  },
  components: {
    top,
    pay
  },
  watch:{
    $route(to,from){
      if(to.path.indexOf(`/order/${this.id}`)!=-1&&from.path=='/refund'){
        this.get_detail()
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '~@/common/stylus/variable'
  .fade-enter-active,.fade-leave-active
    transition all 0.3s
  .fade-enter,.fade-leave-to
    transform translate3d(100%,0,0)
  .order_detail
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    z-index 99
    background $color-background
    .detail_box
      z-index 99
      padding 0 28px
      position fixed
      bottom 0
      left 0
      right 0
      top 64px
      overflow-y scroll
      -webkit-overflow-scrolling touch
      &.detail_padd
        padding-bottom 50px
      .order_state
        padding 20px 0
        margin-bottom 10px
        color $color-text
        .tit
          line-height 24px
          margin-bottom 5px
          font-size $font-size-medium-x
          font-weight bold
        .desc
          line-height 22px
          font-size $font-size-medium
      .info_box
        padding 10px 0
        margin-bottom 10px
        .tit
          margin-bottom 10px
          line-height 24px
          font-size $font-size-medium-x
          color $color-text
          font-weight bold
        .info
          display flex
          line-height 24px
          margin-bottom 8px
          font-size $font-size-medium
          color $color-text-r
          .info_l
            margin-right 15px
          .info_r
            flex 1
            color $color-text-r
            &.beizhu_txt
              display -webkit-box !important
              overflow hidden
              text-overflow ellipsis
              word-break break-all
              -webkit-box-orient vertical
              -webkit-line-clamp 2
      .shop_box
        padding 10px 0
        margin-bottom 10px
        color $color-text
        .tit
          margin-bottom 25px
          font-size $font-size-medium-x
          font-weight bold
        .item
          display flex
          align-items center
          margin-bottom 25px
          .shopimg
            width 90px
            height 90px
            margin-right 23px
            border-radius 2px
            background-repeat no-repeat
            background-position center center
            background-size contain
          .shopinfo
            flex 1
            min-width 0
            .shop_tit
              line-height 22px
              font-size $font-size-medium
              margin-bottom 4px
              display -webkit-box !important
              overflow hidden
              text-overflow ellipsis
              word-break break-all
              -webkit-box-orient vertical
              -webkit-line-clamp 2
            .guige_box
              margin-bottom 12px
              font-size $font-size-small
              color $color-text-r
              .num
                margin-right 8px
            .price_box
              display flex
              align-items center
              justify-content space-between
              .price
                font-size $font-size-medium-x
                color $color-order-highlight
              .num
                font-size $font-size-medium
              .tuikuan_btn
                padding 4px 10px
                font-size $font-size-small
                border-radius 11px
                box-sizing border-box
                border 1px solid #bababa
                color #bababa
              .tuikuan_btn-btn 
                padding 4px 10px
                font-size $font-size-small
                color $color-btn-1
        .tit1
          margin-bottom 25px
          font-size $font-size-medium
          font-weight bold
          .info
            line-height 24px
            font-size $font-size-medium
            color $color-text-r
            width 100%
            min-height 100px
            margin-left 14px
        .total_box
          text-align right
          line-height 20px
          font-size $font-size-medium
          color $color-text
          i
            font-style normal
            margin-left 20px
          .price
            font-size 20px
            color $color-order-highlight
    .tuikuan_box
      padding 10px 0
      margin-bottom 10px
      color $color-text
      .tit
        margin-bottom 18px
        line-height 24px
        font-size $font-size-medium-x
        color $color-text
        font-weight bold
      .van_swipe
        border 1px solid #f5f5f5
        border-radius 5px
        box-sizing border-box
        .van_swipe_item
          padding 20px
          box-sizing border-box
          .shop
            display flex
            align-items center
            margin-bottom 20px
            .shopimg
              width 55px
              height 55px
              margin-right 12px
              background-repeat no-repeat
              background-position center center
              background-size contain
            .shopinfo
              width 162px
              font-size $font-size-small
              .shop_tit
                line-height 18px
                margin-bottom 10px
                display -webkit-box !important
                overflow hidden
                text-overflow ellipsis
                word-break break-all
                -webkit-box-orient vertical
                -webkit-line-clamp 2
              .guige_box
                color $color-text-r
          .liucheng
            display flex
            .liucheng_l
              width 14px
              display flex
              align-items center
              flex-direction column
              margin-right 25px
              .circle
                width 12px
                height 12px
                border 1px solid $color-text-button-left
                display flex
                align-items center
                justify-content center
                border-radius 50%
                .circle_inner
                  width 6px
                  height 6px
                  border-radius 50%
                  background $color-btn-1
              .circle1
                width 8px
                height 8px
                background #f1f1f1
                border-radius 50%
              .shuxian
                flex 1
                width 1px
                background #f1f1f1
            .liucheng_r
              line-height 14px
              padding-bottom 20px
              color $color-text-readonly
              font-size $font-size-medium
              .desc
                line-height 22px
                margin 4px 0
    .btn_box
      position absolute
      left 0
      bottom 0
      display flex
      align-items center
      justify-content flex-end
      width 100%
      height 50px
      padding 0 28px
      box-sizing border-box
      border-top 1px solid rgba(237,237,237,1)
      background $color-background
      z-index 100
      .gray_btn,.org_btn
        padding 7px 10px
        font-size $font-size-medium
        border-radius 15px
        box-sizing border-box
        &.gray_btn
          margin-right 18px
          border 1px solid #bababa
          color #bababa
        &.org_btn
          border 1px solid $color-btn-1
          color $color-btn-1
</style>
