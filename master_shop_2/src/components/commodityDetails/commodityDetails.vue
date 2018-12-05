<template>
<transition name="slide">
  <div class="warp" ref="warp">
    <top title_name="商品详情" :shareicon="true" @share="share" to="/home"></top>
    <div class="wk">
      <div class="spswiper">
        <van-swipe @change="onChange" :show-indicators="false">
          <van-swipe-item v-for="(item, index) in goods.slideshow" :key="index">
            <div class="bg_img" v-lazy:background-image="item.image"></div>
          </van-swipe-item>
        </van-swipe>
        <div class="picjs" v-if="goods.slideshow"><span>{{pic_cur}}/{{goods.slideshow.length}}</span></div>
      </div>
      <p class="spprice" v-if="number>0"><span>¥</span><span v-html="price"></span></p>
      <p class="spprice" v-else>
        <span>¥</span><span v-html="goods.price"></span><span v-if="goods.maxprice>goods.price">- ¥</span><span v-html="goods.maxprice" v-if="goods.maxprice>goods.price"></span>
      </p>
      <div class="sptitle_box van-hairline--bottom">
        <p class="sptitle" v-if="goods.brief" v-html="goods.brief.name"></p>
      </div>
      
      <van-cell :title="'规格：已选 '+seled" is-link  @click="go_sel(1)" v-if="number>0"/>
      <van-cell title="规格：选择规格分类" is-link  @click="go_sel(1)" v-else/>
      <div class="spdetail">
        <div class="gjjx">
          <i class="bef"></i>
          <p>商品详情</p>
          <i class="aft"></i>
        </div>
        <div class="detInner" v-if="goods.brief" v-html="goods.brief.content" ref="inner"></div>
      </div>
      
    </div>
    <div class="buy  van-hairline--top">
      <i class="car" @click="go_gwc"></i>
      <span class="sg"></span>
      <span class="text" @click="join_gwc">加入购物车</span>
      <div class="plank" @click="submint">立即购买</div>
    </div>
    <router-view></router-view>
  </div>
</transition>
</template>

<script>
import top from "@/base/top/top";
import axios from "axios";
import { Toast } from "vant";
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      goods:{},
      pic_cur:1,
      spid:this.$route.query.spid,
      seled:this.$route.query.seled,
      id:this.$route.query.id,
      number:this.$route.query.number,
      routerlist:[],
      list:[],
      price:0.00,
      btn_kg:true,
      sel0:-1,
      sel1:-1,
      selid0:-1,
      selid1:-1,
      selval0:'',
      selval1:''
    }
  },
  mounted(){
    this.spid=this.$route.query.spid
    this.seled=this.$route.query.seled
    this.id=this.$route.query.id
    this.number=this.$route.query.number
    var that = this
    axios.get(`/select/selectshopxq?briefid=${this.spid}`)
    .then(function (res) {
      if(res.data.code==200){
        that.goods = res.data.data
      }else{
        Toast(res.data.msg);
      }
    })
    .catch(function (error) {
      console.log(error);
      Toast('网络异常');
    })
  },
  computed:{
    ...mapGetters(['buluo','shop'])
  },
  methods: {
    onChange(index) {
      this.pic_cur = index+1
      // this.$refs.warp.style.overflowY = 'hidden'
      this.$refs.warp.style.overflowY = 'auto'
    },
    go_sel(n){
      this.$refs.warp.style.overflowY = 'hidden'
      this.$router.push({path:"/guige",query:{spid:this.goods.brief.id,price:this.goods.price,name:this.goods.brief.name,sel0:this.sel0,sel1:this.sel1,selid0:this.selid0,selid1:this.selid1,selval0:this.selval0,selval1:this.selval1,value:this.number,sum:this.goods.sum,rk:n,goods:JSON.stringify(this.goods)}})
    },
    submint(){
      if(!this.btn_kg){
        return 
      }
      this.btn_kg = false
      if(this.number>0){ 
        this.list = [{
          id:this.id,
          price:this.price,
          count:this.number,
          img:this.goods.brief.image,
          name:this.goods.brief.name,
          seled:this.seled
        }]
        this.routerlist = [{
          count:this.number,
          goods_id:this.id,
          norms:this.$route.query.seled
        }],
        this.btn_kg = true
        this.$router.push({path:"/ordsure",query:{list:JSON.stringify(this.list),routerlist:JSON.stringify(this.routerlist),buluo:JSON.stringify(this.buluo),shop:JSON.stringify(this.shop),car:0}})
      }else{
        this.go_sel(3)
        this.btn_kg = true
      }
    },
    join_gwc(){
      // if(this.number>0){
      //   var that = this
      //   axios.get(`/shopcart/set_shop_cart/${appkey}?storeid=${this.shop.did}&userid=${this.buluo.uid}&count=${this.number}&shopid=${this.id}`)
      //   .then(function (res) {
      //     if(res.data.code==200){
      //       Toast.success('成功加入购物车')
      //     }else{
      //       Toast(res.data.msg);
      //     }
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //     Toast('网络异常');
      //   })
      // }else{
        this.go_sel(2)
      // }
    },
    go_gwc(){
      this.$router.push('/shopping_car')
    },
    share(){
      let url = `http://web.51fth.com/fth-gjxd/static/share/index.html?spid=${this.goods.brief.id}`
      // shareWeixinMessage(this.spid,this.buluo.blname,this.goods.brief.name)
      document.location = `js/share/dialog_${this.goods.brief.name}_${this.buluo.blname}管家小店_${url}`
    }
  },
  components: {
    top
  },
  watch:{
    $route(){
      if(this.$route.path.indexOf('home/')!=-1){
        this.$refs.warp.style.overflowY = 'scroll'
        this.seled=this.$route.query.seled,
        this.id=this.$route.query.id,
        this.number=this.$route.query.number
        this.price=this.$route.query.price
        this.sel0=this.$route.query.sel0!='-1'?this.$route.query.sel0:-1,
        this.sel1=this.$route.query.sel1!='-1'?this.$route.query.sel1:-1,
        this.selid0=this.$route.query.selid0!='-1'&&typeof(this.$route.query.selid0)!='undefined'?this.$route.query.selid0:-1,
        this.selid1=this.$route.query.selid1!='-1'&&typeof(this.$route.query.selid1)!='undefined'?this.$route.query.selid1:-1,
        this.selval0=this.$route.query.selval0?this.$route.query.selval0:'',
        this.selval1=this.$route.query.selval1?this.$route.query.selval1:''
      }   
    }
  }
}
</script>

<style lang="stylus">
.detInner
  word-wrap break-word
  word-break break-all
  img 
    width 100%
    height auto
</style>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable'
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
.warp
  position: fixed
  top: 0
  bottom: 0
  width: 100%
  z-index  99
  background-color $color-background
  .wk
    position fixed 
    top 64px 
    bottom 50px
    left 0
    right 0
    z-index 9
    overflow-y scroll
    -webkit-overflow-scrolling touch
    .spswiper
      width 100%
      position relative
      z-index 99
      .van-swipe-item
        width 100%
        z-index 9999
        box-sizing border-box
        .bg_img
          width 100%
          height 0
          padding-top 100%
          background-size cover
          background-repeat no-repeat
          background-position center
      .picjs
        position absolute
        bottom 10px
        right 10px
        width:40px;
        height:22px;
        background:rgba(0,0,0,.3)
        border-radius:11px
        text-align center
        line-height 22px
        span
          font-size $font-size-small
          color $color-text-button
          margin 0 1px
    .spprice
      color $color-order-highlight
      font-size:24px
      padding 15px 0 12px 15px
      background $color-background
      span
        margin-right 4px
    .sptitle_box 
      padding-bottom 16px
      .sptitle
        padding 0 12px 0
        display: -webkit-box !important
        overflow: hidden
        font-size $font-size-medium-x
        line-height 22px
        text-align:justify
        text-overflow: ellipsis
        word-break: break-all
        -webkit-box-orient: vertical
        -webkit-line-clamp: 2
    .spdetail
      border-top 10px solid #f8f8f8
      .gjjx
        font-size $font-size-large
        font-weight bold
        display flex
        align-items center
        justify-content center
        height 60px
        p 
          font-weight bold
        .bef 
          width 13px
          height 1px 
          background-color #dfdfdf
          position relative
          margin-right 15px
          &:after
            content ''
            width 7px
            height 7 px
            box-sizing border-box
            border solid 1px #dfdfdf
            position absolute
            top -3px
            right -7px
            border-radius 50px
        .aft 
          width 13px
          height 1px 
          background-color #dfdfdf
          position relative
          margin-left 15px
          &:after
            content ''
            width 7px
            height 7 px
            box-sizing border-box
            border solid 1px #dfdfdf
            position absolute
            top -3px
            left -7px
            border-radius 50px
      .detInner
        padding 12px
        width 100%
        box-sizing border-box
        img 
          width 100%
          height auto
  .buy
    width 100%
    height 50px
    position absolute
    bottom  0
    background-color $color-background
    display: flex
    flex-direction:row
    align-items:center
    z-index 9
    box-sizing border-box
    .car
      width 54px
      height 50px
      background-image url('./car.png')
      background-size 18px 18px
      background-repeat no-repeat
      background-position center
    .sg
      width 1px
      height 30px
      background $color-text-readonly
    .text
      font-size $font-size-medium-x
      color  $color-text
      width 120px
      text-align center
    .plank
      line-height 50px
      text-align center
      color $color-text-button
      background linear-gradient(left,$color-text-button-left,$color-text-button-right)
      background -webkit-linear-gradient(left,$color-text-button-left,$color-text-button-right)
      flex 1
</style>
