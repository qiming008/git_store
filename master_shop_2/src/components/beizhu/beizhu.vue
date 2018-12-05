<template>
<transition name="slide">
  <div class="cont">
    <top title_name="添加备注"></top>
    <div class="pad_cont">
      <div class="item">
        <div class="shopimg" v-lazy:background-image="nr.img"></div>
        <div class="shopinfo">
          <h1 class="shop_tit">{{nr.name}}</h1>
          <div class="guige_box">
            <span>{{nr.seled}}</span>
          </div>
          <div class="price_box">
            <span class="price">￥{{nr.price}}</span>
            <span class="num">x{{nr.count}}</span>
          </div>
        </div>
      </div>
      <!-- <p @click="add_beizhu(item)" class="tit">备注<span class="info" v-html="!item.note?'请输入备注信息':item.note"></span></p> -->
      <div class="in_txt">
        <p class="p3">备注：</p>
        <textarea placeholder="请输入备注信息,不超过50字" rows="6" v-model="nr.note" maxlength="50"></textarea>
        <div class="btn" @click="bz" :class="active?'cur':''">添加</div>
      </div>
    </div>
    
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
import Top from "@/base/top/top";
import axios from "axios";
import { Toast } from "vant";
export default {
  data() {
    return {
      nr: this.$route.query.sp,
      active: false,
      price:this.$route.query.price?this.$route.query.price:'0.00',
      list:JSON.parse(this.$route.query.list),
      routerlist:JSON.parse(this.$route.query.routerlist),
      buluo:JSON.parse(this.$route.query.buluo),
      shop:JSON.parse(this.$route.query.shop)
    };
  },
  methods: {
    bz() {
      if(this.active){
        this.$router.replace({path:'/ordsure',query:{list:JSON.stringify(this.list),routerlist:JSON.stringify(this.routerlist),buluo:JSON.stringify(this.buluo),shop:JSON.stringify(this.shop),beizhu:this.nr}})
      }
    }
  },
  components: {
    Top
  },
  watch: {
    nr() {
      this.nr.note.trim().length > 0 ? (this.active = true) : (this.active = false);
    }
  }
};
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
  background-color: $color-background;
  overflow-y: scroll;
  z-index: 10;
  .item
    display flex
    margin-bottom 30px
    align-items center
    margin-top 20px
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
  .pad_cont
    padding: 64px 14px;
    box-sizing: border-box;

    .toptit 
      width: 100%;
      background-color: $color-background-cont;
      border: 1px dashed $color-button;
      margin-top: 60px;
      border-radius: 10px;
      text-align: center;
      padding: 8px;
      box-sizing: border-box;

      .p1
        font-size: $font-size-medium-x;
        line-height: 32px;
      

      .p2 
        font-size: $font-size-medium;
        line-height: 1.5;
        color: $color-text-little;
      

    .in_txt
      background-color: $color-background-cont;
      border-radius: 10px;
      .p3
        line-height: 1.5;
      

      .p4 
        text-align: right;
      

      textarea 
        font-size: $font-size-medium;
        width: 100%;
        border: none;
        outline: none;
        line-height: 1.5;
        margin-top 10px
      .btn 
        font-size $font-size-medium
        width 90%
        margin 20px auto
        text-align center
        line-height 44px
        border-radius 50px
        color $color-text-button
        background #ccc
      .btn.cur
        background linear-gradient(left,$color-text-button-left,$color-text-button-right)
        background -webkit-linear-gradient(left,$color-text-button-left,$color-text-button-right)
      
</style>