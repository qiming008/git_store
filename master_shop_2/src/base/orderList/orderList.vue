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
          <span class="shop_name_r" v-if="item.order.status==0">待付款</span>
          <span class="shop_name_r" v-else-if="item.order.status==1">待接单</span>
          <span class="shop_name_r" v-else-if="item.order.status==2">待发货</span>
          <span class="shop_name_r" v-else-if="item.order.status==3">待收货</span>
          <span class="shop_name_r" v-else-if="item.order.status==10">交易关闭</span>
          <span class="shop_name_r" v-else>已完成</span>
        </p>
        <div class="goods_info" v-for="goods in item.orderline">
          <div class="bg_img" v-lazy:background-image="goods.img_url"></div>
          <div class="goods_info_box">
            <p class="goods_name">{{goods.goods_name}}</p>
            <p class="goods_type van-ellipsis">{{goods.norms}}</p>
            <!-- <p class="goods_status">退款申请中</p>
            <p class="goods_status">退款中</p>
            <p class="goods_status">管家拒绝退款</p>
            <p class="goods_status">客服介入中</p>
            <p class="goods_status">客服拒绝退款</p>
            <p class="goods_status">取消退款</p>
            <p class="goods_status">退款成功</p>
            <p class="goods_status">取消订单</p> -->
            <p class="goods_price">
              <span class="goods_price_l">￥{{goods.price}}</span>
              <span class="goods_price_r">x {{goods.count}}</span>
            </p>
          </div>
        </div>
        <p class="goods_all">共{{goods_sum(item)}}件商品 合计：<span>￥{{item.order.pay_price}}</span></p>
        <div class="goods_btn_box">
          <!-- <div class="goods_btn_clear goods_btn">取消退款申请</div> -->
          <div class="goods_btn_get goods_btn" @click.stop="qrsh(item)" v-if="item.order.status==3">确认收货</div>
          <!-- <div class="goods_btn_get goods_btn" @click.stop="go_pay(item)" v-if="item.orderline.state==0">立即支付</div> -->
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
    goods_sum:function(){
      return function(item){
        let sum = 0 
        for(var i=0;i<item.orderline.length;i++){
          sum+=item.orderline[i].count
        }
        return sum
      }
    },
    ...mapGetters(['buluo','shop'])
  },
  mounted(){
    this.get_orderList(0)
  },
  methods:{
    get_orderList(p){
      let status;
      if(this.num < 1){
        status = '全部'
      }else if(this.num==3){
        status = '23'
      }else{
        status = this.num-1
      }
      let that = this
      // let param ={'uid':this.uid,'status':status,'page':p}
      // qs.stringify(param)
      axios.get(`/api/order/list?uid=${this.buluo.uid}&status=${status}&page=${p}`)
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
    qrsh(item){
      var that = this
      Dialog.confirm({
        title: '',
        message: '是否要确认收货'
      }).then(() => {
        axios.get(`/api/order/succces?order_id=${item.order.id}`)
        .then(function (res) {
          if(res.data.code==200){
            that.onRefresh()
          }else{
            Toast(res.data.msg);
          }
        })
        .catch(function (error) {
          Toast('网络异常')
          console.log(error)
        })
      }).catch(() => {
        // on cancel
      });
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
    .goods_all 
      text-align right 
      color $color-text-r
      font-size $font-size-small
      margin-top 12px
      span 
        font-size $font-size-medium-x
        color $color-text
    .goods_btn_box 
      display flex 
      justify-content flex-end
      flex-wrap wrap
      margin-bottom 36px
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
        color $color-btn-2
        border-color $color-btn-2
      .goods_btn_get 
        color $color-btn-1
        border-color $color-btn-1
    .shop_name 
      font-size $font-size-medium-x
      display flex
      justify-content space-between
      align-items flex-start
      line-height 20px
      margin-bottom 20px
      .shop_name_l
        font-weight bold
      .shop_name_r 
        font-size $font-size-medium
        color $color-order-highlight
        font-weight normal
    .goods_info 
      display flex
      justify-content space-between
      margin-bottom 30px
      align-items  center
      .bg_img 
        width 100px 
        height 100px
        margin-right 12px
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
          margin-top 4px
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

.no_list 
  background-image url("./none.png")
  background-repeat no-repeat
  background-size 115px 106px
  background-position center
  width 100%
  height 400px
</style>

