<template>
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <div class="no_list" v-if="cont.length < 1 && finished==true"></div>
    <ul>
      <van-list :loading="loading"
        :finished="finished"
        @load="onLoad"
        :offset="100"
      >
      <li @click="go_info(item)" v-for="item in cont">
        <p class="shop_name">
          <span class="shop_name_l">管家小店（{{item.order.buluo_name}}）</span>
          <!-- <span class="shop_name_r" v-if="item.order.status==0">待付款</span>
          <span class="shop_name_r" v-else-if="item.order.status==1">待接单</span>
          <span class="shop_name_r" v-else-if="item.order.status==2">待发货</span>
          <span class="shop_name_r" v-else-if="item.order.status==3">待收货</span>
          <span class="shop_name_r" v-else-if="item.order.status==10">交易关闭</span>
          <span class="shop_name_r" v-else>已完成</span> -->
          <span class="shop_name_r" v-if="item.orderRefund.suo==1">客服介入中</span>
          <span class="shop_name_r" v-else-if="item.orderRefund.suo==2">客服拒绝退款</span>
          <!-- <p class="goods_status" v-else-if="item.orderRefund.suo==3">退款成功</p> -->
          <span class="shop_name_r" v-else-if="(item.orderRefund.suo==0||item.orderRefund.suo==3)&&item.orderRefund.status==0">退款申请中</span>
          <span class="shop_name_r" v-else-if="(item.orderRefund.suo==0||item.orderRefund.suo==3)&&item.orderRefund.status==1">退款中</span>
          <span class="shop_name_r" v-else-if="(item.orderRefund.suo==0||item.orderRefund.suo==3)&&item.orderRefund.status==2">管家拒绝退款</span>
          <span class="shop_name_r" v-else-if="(item.orderRefund.suo==0||item.orderRefund.suo==3)&&item.orderRefund.status==3">退款成功</span>
          <span class="shop_name_r" v-else-if="(item.orderRefund.suo==0||item.orderRefund.suo==3)&&item.orderRefund.status==10">退款关闭</span>
        </p>
        <div class="goods_info">
          <div class="bg_img" v-lazy:background-image="item.orderline.img_url"></div>
          <div class="goods_info_box">
            <p class="goods_name">{{item.orderline.goods_name}}</p>
            <p class="goods_type van-ellipsis">{{item.orderline.norms}}</p>

            <p class="goods_price">
              <span class="goods_price_l">￥{{item.orderline.price}}</span>
              <span class="goods_price_r">x {{item.orderline.count}}</span>
            </p>
            <p class="goods_all">退款：<span>￥{{item.orderRefund.price}}</span></p>
            <div class="goods_btn_box" v-if="(item.orderRefund.suo==0||item.orderRefund.suo==3)&&item.orderRefund.status==0">
              <div class="goods_btn_clear goods_btn" @click="qxtk(item.orderRefund.id)">取消退款</div>
            </div>
          </div>
        </div>
      </li>
      </van-list>
    </ul>
  </van-pull-refresh>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { Toast } from 'vant'
import { Dialog } from 'vant'

export default{
  data(){
    return{
      loading: false,
      finished: false,
      isLoading: false,
      cont:[],
      page: 1,
      load_length:0
    }
  },
  props:{
    active:{
      type: Number,
      defalut:0
    },
    num:{
      type: Number,
      defalut:0
    }
  },
  computed:{
    ...mapGetters(['buluo'])
  },
  mounted(){
    this.get_orderList(1)
  },
  methods:{
    get_orderList(p){
      var that = this
      axios.get(`/api/order/refund/list?uid=${this.buluo.uid}&page=${p}`)
      .then(function (res) {
        if(res.data.code==200){
          if(res.data.data.list.length < 1){
            that.finished = true
          }else{
            if(p==1){
              that.cont = []
            }
            that.cont.push.apply(that.cont,res.data.data.list)
          }
          that.loading = false
          that.isLoading = false
        }else{
          Toast(res.data.msg);
        }
      })
      .catch(function (error) {
        Toast('网络异常')
        console.log(error)
      })
    },
    go_info(item){
      this.$emit('select',item)
    },
    onLoad(){
      clearTimeout(cc)
      this.load_length = this.cont.length
      this.loading = true
      var cc = setTimeout(() => {
        this.get_orderList(this.page)
        this.page ++
      }, 500)
    },
    onRefresh(){
      clearTimeout(cc)
      var cc = setTimeout(() => {
        this.finished = false
        this.page = 1
        this.load_length = 0
        this.get_orderList(this.page)
        this.isLoading = true
        this.loading = false
      }, 500)
    },
    qxtk(id){
      var that = this
      axios.get(`/api/order/refund/detele?id=${id}`)
      .then(function (res) {
        if(res.data.code==200){
          Toast.success('操作成功')
        }else{
          Toast(res.data.msg);
        }
      })
      .catch(function (error) {
        Toast('网络异常')
        console.log(error)
      })
    }
  },
  watch:{
    $route(){
      if(this.$route.path.indexOf('order')!=-1 && this.$route.path.length == 6){
        this.finished = false
        this.page = 1
        this.cont = []
        this.load_length = 0
        this.onLoad()
        this.isLoading = false
        this.loading = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
@import '../../common/stylus/mixin.styl'
.none
  width 100%
  height 402px
  background-color $color-background
  img 
    width 151px
    height 174px
    margin:114px auto 0
    display block
i 
  font-style normal
ul 
  padding 18px
  width 100%
  margin-bottom 60px
  background-color $color-background
  -webkit-overflow-scrolling touch
  min-height 400px
  box-sizing border-box
  li 
    width 100%
    overflow hidden
    color $color-text
    .shop_name 
      font-size $font-size-medium-x
      display flex
      justify-content space-between
      align-items flex-start
      margin-bottom 24px
      line-height 20px
      .shop_name_l
        font-weight bold
      .shop_name_r 
        font-size $font-size-medium
        color $color-order-highlight
    .goods_info 
      display flex
      justify-content space-between
      margin-bottom 30px
      align-items center
      .bg_img 
        width 100px 
        height 100px
        margin-right 10px
        background-size contain
        background-position center
        background-repeat no-repeat
        border-radius 2px
      .goods_info_box
        flex 1
        min-width 0
        .goods_name 
          font-size $font-size-medium
          line-height 18px
          display:-webkit-box !important;
          overflow:hidden;
          text-overflow:ellipsis;
          word-break:break-all;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:2;
        .goods_type 
          font-size $font-size-small
          color $color-text-r
          line-height 26px
        .goods_status 
          font-size $font-size-small
          color $color-btn-1
          text-align right
        .goods_price 
          display flex
          justify-content space-between
          align-items flex-end
          margin-top 22px
          .goods_price_l 
            font-size $font-size-medium-x
          .goods_price_r 
            font-size $font-size-small
            color $color-text-r
        .goods_all 
          text-align right 
          color $color-text-r
          font-size $font-size-small
          margin-top 22px
          span 
            font-size $font-size-medium-x
            color $color-text
        .goods_btn_box 
          display flex 
          justify-content flex-end
          flex-wrap wrap
          margin-bottom 0px
          height 36px
          overflow hidden
          .goods_btn
            font-size $font-size-small
            padding 0 12px
            border solid 1px
            border-radius 50px
            line-height 22px
            box-sizing border-box
            margin-top 10px
            &:last-child
              margin-left 12px
          .goods_btn_clear 
            color $color-btn-1
            border-color $color-btn-1
          .goods_btn_get 
            color $color-btn-1
            border-color $color-btn-1

.no_list 
  background-image url("./none.png")
  background-repeat no-repeat
  background-size 115px 106px
  background-position center
  width 100%
  height 400px
</style>

