<template>
  <transition name="fade">
    <div class="order_detail">
      <top :title_name="'确认订单'" :arrow="true"></top>
      <div class="detail_box">
        <div class="addr_box">
          <div class="addr_left van-ellipsis">
            <p class="add_addr" @click="add_addr" v-if="!addr">添加收货地址</p>
            <div class="addr" @click="sel_addr" v-else>
              <p class="userinfo">
                <span class="name van-ellipsis">{{addr.name}}</span>
                <span>{{addr.tel}}</span>
              </p>
              <p class="address">{{addr.address}}</p>
            </div>
          </div>
          <van-icon name="arrow" class="icon" v-if="!addr" @click="add_addr"/>
          <van-icon name="arrow" class="icon" v-else @click="sel_addr"/>
        </div>
        <div class="shop_box">
          <h1 class="tit">管家小店（{{buluo.blname}}）</h1>
          <ul>
            <li v-for="item in goods" :key="item.id">
              <div class="item">
                <div class="shopimg" v-lazy:background-image="item.img"></div>
                <div class="shopinfo">
                  <h1 class="shop_tit">{{item.name}}</h1>
                  <div class="guige_box">
                    <span>{{item.seled}}</span>
                  </div>
                  <div class="price_box">
                    <span class="price">￥{{item.price}}</span>
                    <span class="num">x{{item.count}}</span>
                  </div>
                </div>
              </div>
              <p @click="add_beizhu(item)" class="tit">备注<span class="info" v-html="!item.note?'请输入备注信息':item.note"></span></p>
            </li>
          </ul>
          <div class="total_box">
            <span>共{{count}}件商品</span>
            <i>合计：</i>
            <span class="price">￥{{total_price}}</span>
          </div>
        </div>
        <!-- <div class="info_box" @click="add_beizhu">
          <div class="tit">备注</div>
          <div class="info" v-html="!beizhu?'请输入备注信息':beizhu"></div>
        </div> -->
      </div>
      <div class="btn_box">
        <div class="btn_left">
          <i>合计：</i><span>￥{{total_price}}</span>
        </div>
        <div class="btn" @click="zhifu">提交订单</div>
      </div>
      <pay :price="price" :shadow_show="shadow_show" :pay_show="pay_show" :id="id" @pay="pay" @close_pay="close_pay"></pay>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import top from '@/base/top/top'
import pay from '@/base/pay/pay'
import axios from 'axios'
import { Toast } from "vant"
import { mapGetters,mapMutations } from 'vuex'
import qs from 'qs'
export default {
  data() {
    return {
      beizhu: '',
      goods:[],
      routerlist: [],
      addr:{},
      price:0.00,
      id:-1,
      pay_show:false,
      shadow_show:false,
      buluo: {},
      shop: {},
      kg: 0,
      zf_kg:true,
      car:0
    }
  },
  computed: {
    total_price() {
      let total = 0;
      for (let i = 0; i < this.goods.length; i++) {
        total += Number(this.goods[i].price) *  Number(this.goods[i].count)
      }
      total =(Math.round(total*100)/100).toFixed(2)
      return total
    },
    count() {
      let tot = 0
      for (let i = 0; i < this.goods.length; i++) {
        tot += this.goods[i].count
      }
      return tot
    }
  },
  mounted() {
    this.goods=JSON.parse(this.$route.query.list)
    this.routerlist= JSON.parse(this.$route.query.routerlist)
    this.kg= this.$route.query.kg
    this.car= this.$route.query.car
    this.buluo=JSON.parse(this.$route.query.buluo)
    this.shop=JSON.parse(this.$route.query.shop)
    if(this.kg==1){
      // this.price=this.$route.query.price
      this.id=this.$route.query.id
      // this.shadow_show = true
      // this.beizhu = this.$route.query.beizhu
      this.$store.commit('set_buluo', this.buluo)
      this.$store.commit('set_shop', this.shop)
      this.$router.push({path:'/pay_mid',query:{id:this.id}})
    }else{
      this.shadow_show = false
    }
    this.get_addr()
  },
  methods: {
    get_addr() {
      axios.get(`/api/addrs/init?uid=${this.buluo.uid}&shop_id=${this.shop.did}`)
      .then((res) => {
        if(res.data.code===200){
          this.addr = res.data.data
        }else{
          Toast(res.data.msg)
        }
      })
      .catch((error) => {
        Toast('网络异常')
        console.log(error)
      })
    },
    add_addr() {
      this.$router.push({path: '/addaddress'})
    },
    sel_addr() {
      this.$router.push({path: '/address'})
    },
    add_beizhu(item) {
      this.$router.push({path: '/beizhu',query:{sp:item,list:this.$route.query.list,routerlist:this.$route.query.routerlist,buluo:this.$route.query.buluo,shop:this.$route.query.shop}})
    },
    zhifu() {
      if(!this.zf_kg){
        return
      }
      this.zf_kg = false
      let that = this
      if (typeof(this.beizhu) == "undefined"){
        this.beizhu=''
      }
      if (typeof(this.addr.id) == "undefined"||this.addr.id.length<1){
        Toast('请确认收货地址')
        return
      }
      let parm = qs.stringify({uid:`${this.buluo.uid}`,address_id:`${this.addr.id}`,buluoid:`${this.buluo.blid}`,shop_id:`${this.shop.did}`,note:`${this.beizhu}`,goods:`${JSON.stringify(this.routerlist)}`,provinceid:`${this.shop.shengid}`,cityid:`${this.shop.shiid}`,areaid:`${this.shop.xianid}`,buluo_name:`${this.buluo.blname}`})
      axios.post(`/api/order/up`,parm,{headers:{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'}})
      .then(function (res) {
        that.zf_kg = true
        if(res.data.code==200){
          that.shadow_show = true
          that.pay_show = true
          that.price = Number((res.data.data.pay_price).toFixed(2)),
          that.id = res.data.data.id
          if(that.car == 1){
            var arr = []
            for(let i=0;i<that.routerlist.length;i++){
              arr.push(that.routerlist[i].id)
            }
            axios.get('/shopcart/del_shop_cart/1?id='+arr.join(','))
            .then(function(res){
              if(res.data.code==200){
              }else{
                console.log(res.data.msg)
              }
            })
            .catch(function(error){
              console.log(error);
            })
          }
        } else {
          Toast(res.data.msg);
        }
      })
    },
    pay(){
      if(!this.zf_kg){
        return
      }
      this.zf_kg = false
      let that = this
      let url = window.location.href
      if(url.indexOf('&kg')!=-1){
        url  = window.location.href.replace('&kg=0','&kg=1')
      }else{
        url  = window.location.href + `&kg=1&price=${this.price}&id=${this.id}`
      }
      url = encodeURIComponent(url)
      axios.get(`api/order/pay/wechat?id=${this.id}`)
      .then( (res) => {
        that.zf_kg = true
        if(res.data.code==200){
          // console.log(res.data.data +`&redirect_url=${url}`)
          window.location.replace(res.data.data +`&redirect_url=${url}`)
        }else{
          Toast(res.data.msg);
        }
      })
      .catch((error) => {
        Toast('网络异常');
        console.log(error);
      })
    },
    // get_zf:function(){
    //   if(!this.zf_kg){
    //     return
    //   }
    //   this.zf_kg = false
    //   let that = this
    //   setTimeout(() => {
    //     axios.get(`/api/order/pay/synchroni?order_id=${that.id}`)
    //     .then( (res) => {
    //       that.zf_kg = true
    //       that.shadow_show=false
    //       that.pay_show=false
    //       if(res.data.data==1){
    //         that.$router.push({path:`/success_pay`,query:{zf_status:1,order:that.id}})
    //       }else{
    //         that.$router.push({path:`/success_pay`,query:{zf_status:0,order:that.id}})
    //       }
    //     })
    //     .catch(function (error) {
    //       Toast('网络错误');
    //       console.log(error);
    //     })
    //   }, 1000)
    // },
    close_pay(){
      this.shadow_show=false
    },
    // reget_zf(){
    //   this.shadow_show = false
    //   this.pay_show = false
    // },
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
    $route(){
      if(this.$route.path.indexOf("/ordsure")!=-1){
        this.goods=JSON.parse(this.$route.query.list)
        this.routerlist= JSON.parse(this.$route.query.routerlist)
        this.kg= this.$route.query.kg
        this.car= this.$route.query.car
        this.buluo=JSON.parse(this.$route.query.buluo)
        this.shop=JSON.parse(this.$route.query.shop)
        if(this.kg==1){
          // this.price=this.$route.query.price
          this.id=this.$route.query.id
          // this.shadow_show = true
          // this.beizhu = this.$route.query.beizhu
          this.$store.commit('set_buluo', this.buluo)
          this.$store.commit('set_shop', this.shop)
          this.$router.push({path:'/pay_mid',query:{id:this.id}})
        }else{
          this.shadow_show = false
        }
        this.get_addr()
        this.beizhu = this.$route.query.beizhu
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
    z-index 999
    background $color-background
    .detail_box
      padding 0 28px
      position fixed
      top 64px
      bottom 50px
      left 0
      right 0
      overflow-y scroll
      -webkit-overflow-scrolling touch
      .addr_box
        display flex
        align-items center
        margin-bottom 10px
        box-sizing border-box
        .addr_left
          flex 1
          .add_addr
            line-height 70px
            text-align center
            font-size $font-size-medium-x
            color $color-text
            font-weight bold
          .addr
            margin-right 26px
            padding 25px 0 18px 0
            color $color-text
            font-size $font-size-medium-x
            .userinfo
              display flex
              justify-content space-between
              margin-bottom 10px
              .name
                flex 1
                margin-right 20px
            .address
              line-height 24px
              overflow:hidden;
              white-space:nowrap;
              text-overflow:ellipsis
        .icon
          color $color-text-r
      .info_box
        padding 15px 0
        margin-bottom 10px
        .tit
          margin-bottom 10px
          line-height 24px
          font-size $font-size-medium-x
          color $color-text
          font-weight bold
        .info
          line-height 24px
          font-size $font-size-medium
          color $color-text-r
          width 100%
          min-height 100px
      .shop_box
        padding 15px 0
        margin-bottom 10px
        color $color-text
        .tit
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
        .item
          display flex
          margin-bottom 30px
          align-items center
          .shopimg
            width 90px
            height 90px
            margin-right 20px
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
              margin-bottom 6px
              display -webkit-box !important
              overflow hidden
              text-overflow ellipsis
              word-break break-all
              -webkit-box-orient vertical
              -webkit-line-clamp 2
            .guige_box
              margin-bottom 14px
              font-size $font-size-small
              color $color-text-r
              span,i
                display inline
              i
                margin-right 5px
                font-style normal
            .price_box
              display flex
              align-items center
              justify-content space-between
              .price
                font-size $font-size-medium-x
                color $color-order-highlight
              .num
                font-size $font-size-medium
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
    .btn_box
      position fixed
      left 0
      bottom 0
      display flex
      align-items center
      width 100%
      height 50px
      box-sizing border-box
      border-top 1px solid rgba(237,237,237,1)
      background $color-background
      .btn_left
        flex 1
        line-height 50px
        text-align center
        font-size 0
        color $color-text
        i
          display inline-block
          vertical-align middle
          line-height 50px
          font-style normal
          font-size $font-size-medium
        span
          display inline-block
          vertical-align middle
          line-height 50px
          color $color-order-highlight
          font-size 20px
      .btn
        width 170px
        height 50px
        line-height 50px
        text-align center
        color $color-text-button
        font-size $font-size-medium-x
        background linear-gradient(to right, $color-btn-1 , $color-order-highlight)
        background -webkit-linear-gradient(to right, $color-btn-1 , $color-order-highlight)
</style>
