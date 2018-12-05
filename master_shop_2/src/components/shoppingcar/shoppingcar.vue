<template>
  <div class="warp" ref="war">
    <top :title_name="'购物车'" @guanli="guanliList" @wancheng="wanchengList" :guanli="kg" :wancheng="!kg"></top>

    <div class="wk" ref="wk">
      <div class="dptitle">
        <i class="dp"></i>
        <span class="dpname">管家小店（{{buluo.blname}}）</span>
        <i v-if="cont.length!=0" class="dp_span">共{{cont.length}}件商品</i>
      </div>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">  
        <div class="none" v-if="cont.length==0 ">
          <img src="./kc.png">
          <p>购物车里空空如也</p>
        </div>
        <ul v-if="cont.length > 0">
          <van-checkbox-group v-model="result" @change="checkone">
            <li v-for="(item,index) in cont">
              <van-checkbox :name="index" :disabled="(item.type!=1||item.shopflag==1||item.briefflag==1||item.count>item.inventory)&&kg?true:false"
              ></van-checkbox>
              <div class="goods_info">
                <div class="bg_img" v-lazy:background-image="item.image"  @click="go_info(item)"></div>
                <div class="goods_info_box">
                  <p class="goods_name" :class="item.briefflag==1||item.shopflag==1||item.count>item.inventory?'cur':''" v-html="item.name" @click="go_info(item)"></p>
                  <p class="goods_type van-ellipsis" v-html="item.label.join(';')"></p>
                  <p class="goods_price" v-if="item.type==1">
                    <span class="goods_price_l" v-html="'￥'+item.price"></span>
                    <van-stepper class="goods_price_r"
                      v-model="item.count"
                      integer
                      :min="1"
                      :max="item.inventory"
                      @change="shuliang(item.id,item.count)"
                      v-if="kg"
                    />
                  </p>
                  <p class="goods_price_info" v-if="item.briefflag==1">该商品已删除，无法购买</p>
                  <p class="goods_price_info" v-else-if="item.type!=1">该商品已下架，无法购买</p>
                  <p class="goods_price_info" v-else-if="item.shopflag==1">该规格暂无库存，可选购其他规格</p>
                  <p class="goods_price_info" v-else-if="item.count>item.inventory">该规格库存不足</p>
                </div>
              </div>
            </li>
          </van-checkbox-group>
        </ul>
      </van-pull-refresh>
      <div class="btn_line van-hairline--top" v-if="cont.length > 0">
        <van-checkbox v-model="checkAll" name="all" @change="choiceAll">全选</van-checkbox>
        <p class="hj" v-if="kg==true">合计：<span>¥ {{zprice}}</span></p>
        <p class="btn_bot cur" @click="ondel" v-if="cont.length > 0 && kg==false">删除({{result.length}})</p>
        <p class="btn_bot" @click="submint" v-html="'结算('+sum_num+')'" v-else></p>
      </div>
    </div>
    <router-view></router-view>
  </div>
  
</template>

<script>
import Vue from "vue";
import top from "@/base/top/top";
import axios from "axios";
import { Toast } from "vant";
import {mapGetters} from "vuex"
export default {
  data() {
    return {
      kg: true,
      isLoading: false,
      cont:[],
      result:[],
      res_arr_del:[],
      list:[],
      routerlist:[],
      checkAll:false,
      check_kg:true,
      tos_kg:false
    };
  },
  mounted(){
    this.jiazai()
  },
  computed:{
    zprice:function(){
      if(this.result.length==0){
        return '0.00'
      }else{
        let res=this.result
        let sum=0
        for(let i=0;i<res.length;i++){
          sum+=this.cont[res[i]].price * this.cont[res[i]].count
        }
        if(sum==0){
          return '0.00'
        }
        sum=(Math.round(sum*100)/100).toFixed(2)
        return sum
      }
    },
    sum_num:function(){
      if(this.result.length==0){
        return '0'
      }else{
        let res=this.result
        let sum=0
        for(let i=0;i<res.length;i++){
          sum+=this.cont[res[i]].count
        }
        if(sum==0){
          return '0'
        }
        return sum
      }
    },
    ...mapGetters(['buluo','shop'])
  },
  methods: {
    guanliList: function() {
      this.kg = false;
      this.tos_kg=false
      this.result=[]
      this.onRefresh()
    },
    wanchengList: function() {
      this.kg = true;
      this.tos_kg=false
      this.result=[]
      this.onRefresh()
    },
    jiazai:function(){
      var that =this
      axios.get(`/shopcart/get_shop_cart_list/${appkey}?storeid=${this.shop.did}&userid=${this.buluo.uid}`)
      .then(function (res) {
        if(res.data.code==200){
          that.cont = res.data.data
          setTimeout(() => {
            that.tos_kg=true
          }, 2000);
        }else{
          Toast(res.data.msg);
        }
      })
      .catch(function (error) {
        Toast('网络异常');
        console.log(error);
      })
    },
    shuliang:function(id,count){
      var that = this
      axios.get('/shopcart/update_shop_cart_num/1?id='+id+'&count='+count)
      .then(function (res) {
        if(res.data.code==200){
          console.log(res.data.msg);
        }else{
          if(that.tos_kg){
            Toast(res.data.msg);
          }
        }
      })
      .catch(function (error) {
        Toast('网络异常');
        console.log(error);
      })
    },
    checkone:function(b){
      var l = 0;
      for(var i=0;i<this.cont.length;i++){
        if(this.cont[i].type!=1||this.cont[i].shopflag==1||this.cont[i].briefflag==1||this.cont[i].count>this.cont[i].inventory){
          l++
        }
      }
      if(this.kg){
        var new_l = b.length + l
      }else{
        var new_l = b.length
      }
      if(new_l<this.cont.length){
        this.check_kg = false
        this.checkAll = false
      }else if(new_l==this.cont.length){
        this.checkAll = true
        this.check_kg = true
      }
    },
    choiceAll:function(All){      //全选
      if(this.kg){
        if(All){
          let aaa=[];
          let arr=this.cont
          for(let i=0;i<arr.length;i++){
            if(arr[i].type==1&&arr[i].shopflag!=1&&arr[i].briefflag!=1&&arr[i].count<=arr[i].inventory){
              aaa.push(i)
            }
          }
          this.result=aaa
        }else if(this.check_kg){
          this.result=[]
        }
      }else{
        if(All){
          let aaa=[];
          let arr=this.cont
          for(let i=0;i<arr.length;i++){
            aaa.push(i)
          }
          this.result=aaa
        }else if(this.check_kg){
          this.result=[]
        }
      }
    },
    submint:function(){
      if(this.result.length < 1){
        Toast('您还没有选中任何商品')
        return
      }
      for(let i=0;i<this.result.length;i++){
        let obj = {
          id:this.cont[this.result[i]].groupid,
          price:this.cont[this.result[i]].price,
          count:this.cont[this.result[i]].count,
          img:this.cont[this.result[i]].image,
          name:this.cont[this.result[i]].name,
          seled:this.cont[this.result[i]].label.join(';')
        }
        this.list.push(obj)
        let obj1 = {
          id:this.cont[this.result[i]].id,
          count:this.cont[this.result[i]].count,
          goods_id:this.cont[this.result[i]].groupid,
          norms:this.cont[this.result[i]].label.join(';')
        }
        this.routerlist.push(obj1)
      }
      this.$router.push({path:"/ordsure",query:{list:JSON.stringify(this.list),routerlist:JSON.stringify(this.routerlist),buluo:JSON.stringify(this.buluo),shop:JSON.stringify(this.shop),car:1}})
    },
    ondel:function(){
      var that = this
      for(let i=0;i<this.result.length;i++){
        this.res_arr_del.push(this.cont[this.result[i]].id)
      }
      axios.get('/shopcart/del_shop_cart/1?id='+this.res_arr_del.join(','))
      .then(function(res){
        if(res.data.code==200){
          Toast.success('操作成功')
          that.jiazai()
        }else{
          Toast(res.data.msg)
        }
      })
      .catch(function(error){
        Toast('网络异常');
        console.log(error);
      });
    },
    onRefresh(){
      var that = this
      clearTimeout(jz)
      var jz=setTimeout(() => {
        that.isLoading = false;
        that.jiazai()
      }, 500);
    },
    go_info(item){
      if(item.briefflag==1){
        Toast('商品已删除，无法查看详情')
        return 
      }else if(item.type!=1){
        Toast('商品已下架，无法查看详情')
        return 
      }else{
        this.$router.push({path:`/home/${item.shopid}`,query:{spid:`${item.shopid}`}})
      }
    }
  },
  components: {
    top
  },
  activated() {
    this.kg = true
    this.isLoading= false
    this.cont= []
    this.result= []
    this.checkAll= false
    this.res_arr_del= []
    this.list= []
    this.routerlist= []
    this.jiazai()
  }
};
</script>


<style lang="stylus" scoped>
@import '~@/common/stylus/variable';

.warp 
  position fixed
  top 0
  left 0
  bottom 0
  right 0
  overflow-y scroll
  .wk
    z-index: 9; 
    padding-top 100px
    padding-bottom 120px
  .van-pull-refresh
    width 100%
  .btn_line
    position fixed
    height 50px
    bottom 50px
    left 0
    width 100%
    display flex
    justify-content space-between
    align-items center
    background-color $color-background
    p 
      line-height 50px
    .btn_bot
      background linear-gradient(left,$color-text-button-left,$color-text-button-right)
      background -webkit-linear-gradient(left,$color-text-button-left,$color-text-button-right)
      width 100px
      text-align center
      color $color-text-button
      &.cur 
        background #ff0e0e
    .van-checkbox
      margin-left 10px
      width 66px
    .hj 
      flex 1
      min-width 0
      font-size $font-size-small
      color $color-text
      text-align right 
      margin-right 10px
      span  
        color $color-order-highlight
        font-size $font-size-large
        // font-weight bold
  .none
    width 100%
    height 402px
    background-color $color-background
    padding-top 114px
    transform translate(-6px,0)
    img 
      width 123px
      height 94px
      margin 0 auto
      display block
    p
      font-size $font-size-small
      text-align center
      font-weight:500
      color:rgba(158,158,158,1)
      margin-top 22px
      text-indent 2em
  i 
    font-style normal
  .dptitle
      width :100% 
      display: flex
      flex-direction:row
      align-items:center
      position :fixed
      top:64px
      z-index:9
      height:40px
      padding 0 10px
      box-sizing:border-box
      background:rgba(255,251,245,1)
      .dp
        width 17px
        height 15px
        background url('./dp.png')
        background-size contain
        margin-right 5px
        background-repeat no-repeat
      .dpname
        flex:1
        font-weight bold
      .dp_span 
        font-size $font-size-medium
        color $color-text-r
  ul 
    padding 0 10px
    margin-bottom 60px
    background-color $color-background
    -webkit-overflow-scrolling touch
    box-sizing border-box
    min-height 400px
    li 
      width 100%
      margin-top 24px
      color $color-text
      display flex
      flex-direction row
      align-items center
      .van-checkbox
        width 20px
        height 20px
        margin-right 12px
      .shop_name 
        font-size $font-size-medium-x
        margin-bottom 24px
        .shop_name_r 
          font-size $font-size-medium
          color $color-order-highlight
      .goods_info 
        flex 1
        display flex 
        align-items center
        min-width 0

        .bg_img 
          width 90px 
          height 90px
          margin-right 12px
          background-size contain
          background-position center
          background-repeat no-repeat
          border-radius 2px
        .goods_info_box
          flex 1
          min-width 0
          display flex
          justify-content space-between
          flex-direction column
          .goods_name 
            font-size $font-size-medium
            color $color-text
            line-height 20px
            display:-webkit-box !important;
            overflow:hidden;
            text-overflow:ellipsis;
            word-break:break-all;
            -webkit-box-orient:vertical;
            -webkit-line-clamp:2;
            &.cur 
              color $color-text-readonly
          .goods_type 
            font-size $font-size-small
            color $color-text-r
            margin-top 8px
            line-height 16px
          .goods_status 
            font-size $font-size-small
            color $color-btn-1
            text-align right
          .goods_price 
            display flex
            justify-content space-between
            align-items center
            line-height 34px
            margin-top 4px
            .goods_price_l 
              font-size $font-size-medium-x
              color $color-order-highlight
            .goods_price_r
              transform scale(.7,.8) translate(10%,0)
              display flex
          .goods_price_info
            font-size $font-size-small
            color $color-text
            margin-top 25px
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
</style>

