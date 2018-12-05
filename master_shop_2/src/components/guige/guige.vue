<template>
  <transition name="slide">
    <div class="cont" @click.stop="close()">
      <div class="bg_pay" @click.stop>
        <van-icon name="close"  class="close_icon" @click="close()"/>
        <p class="ellipsis">{{name}}</p>
        <p class="price">￥{{price}} <span>&nbsp;库存：{{kc}}件</span></p>
        <div class="type_box" v-for="(item,index) in guige" :key="item.id">
          <p>{{item.name}}：</p>
          <p class="sel_box">
            <i @click="select(gg,index,index1)" :class="(index==0&&sel0==index1)||(index==1&&sel1==index1)?'cur':''" v-for="(gg,index1) in item.listvice" :key="gg.id">{{gg.standard_value}}</i>
          </p>
        </div>
        <p class="buy">
          <span>购买数量：</span>
          <van-stepper ref="stepper" v-model="value" integer @change="change" :max="kc" :disabled="kcchange" :disable-input="disable_input"/>
        </p>
        <div class="btn_box" v-if="rk == 1">
          <div class="btn" @click="qd1()">加入购物车</div>
          <div class="btn" @click="qd2()">立即购买</div>
        </div>
        <div class="btn"  v-else @click="qd()">确定</div>
      </div>
    </div>
  </transition>
</template>
<script>
import { Icon } from 'vant'
import axios from 'axios'
import { Toast } from 'vant'
import {mapGetters} from "vuex"
export default{
  data(){
    return{
      disable_input:true,
      spid: this.$route.query.spid,
      price: this.$route.query.price,
      value:this.$route.query.value,
      guige:[],
      sel0:this.$route.query.sel0,
      sel1:this.$route.query.sel1,
      selid0:this.$route.query.selid0,
      selid1:this.$route.query.selid1,
      selval0:this.$route.query.selval0,
      selval1:this.$route.query.selval1,
      rk:this.$route.query.rk,
      kg:0,
      kc:this.$route.query.sum,
      kcchange:true,
      cont_id:-1,
      name:this.$route.query.name,
      list:[],
      routerlist:[]
    }
  },
  mounted(){
    var that = this
    axios.get(`/select/selectshophostvice?broefid=${this.spid}`)
    .then(function (res) {
      if(res.data.code==200){
        that.guige = res.data.data
        that.sel_fun()
        if(that.guige.length<1){
          axios.get(`/select/qtselectshopid?type=0&briefid=${that.spid}`)
          .then(function (res) {
            if(res.data.code==200){
              that.price = res.data.data.price
              that.kc = res.data.data.inventory
              that.cont_id = res.data.data.id
              that.kcchange = false
            }else{
              Toast(res.data.msg);
            }
          })
          .catch(function (error) {
            console.log(error);
          })
          that.kg = 1
        }
      }else{
        Toast(res.data.msg);
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  },
  computed:{
    ...mapGetters(['buluo','shop'])
  },
  methods:{
    select(item,index,index1){
      if(index==0){
        this.sel0 = index1
        this.selid0 = item.id
        this.selval0=item.standard_value.length>0?item.standard_value+';':''
      }else if(index==1){
        this.sel1 = index1
        this.selid1 = item.id
        this.selval1=item.standard_value.length>0?item.standard_value+';':''
      }
      this.sel_fun()
    },
    sel_fun(){
      if(this.guige.length==1){
        if(this.selid0==-1){
          return
        }
        var that = this
        axios.get(`/select/qtselectshopid?type=1&viceidone=${this.selid0}&briefid=${this.spid}`)
        .then(function (res) {
          if(res.data.code==200){
            that.price = res.data.data.price
            that.kc = res.data.data.inventory
            that.cont_id = res.data.data.id
            that.kcchange = false
          }else{
            Toast(res.data.msg);
          }
        })
        .catch(function (error) {
          console.log(error);
        })
        this.kg = 1
      }else if(this.guige.length>1){
        if(this.selid0==-1||this.selid1==-1){
          return
        }else{
          var that = this
          axios.get(`/select/qtselectshopid?type=2&viceidone=${this.selid0}&vicetwo=${this.selid1}&briefid=${this.spid}`)
          .then(function (res) {
            if(res.data.code==200){
              that.price = res.data.data.price
              that.kc = res.data.data.inventory
              that.cont_id = res.data.data.id
              that.kcchange = false
            }else{
              Toast(res.data.msg);
            }
          })
          .catch(function (error) {
            console.log(error);
          })
          this.kg = 1
        }
      }
    },
    qd(){
      if(this.kg==1){
        if(this.kc<1){
          Toast('当前商品库存不足');
          return
        }
        if(this.rk==1){
          this.$router.replace({path:`home/${this.spid}`,query:{id:this.cont_id,number:this.value,seled:this.selval0+this.selval1+this.value+'件',price:this.price,sel0:this.sel0,sel1:this.sel1,selid0:this.selid0,selid1:this.selid1,selval0:this.selval0,selval1:this.selval1}})
        }else if(this.rk==2){
          var that = this
          axios.get(`/shopcart/set_shop_cart/${appkey}?storeid=${this.shop.did}&userid=${this.buluo.uid}&count=${this.value}&shopid=${this.cont_id}`)
          .then(function (res) {
            if(res.data.code==200){
              Toast.success('成功加入购物车')
              that.$router.replace({path:`home/${that.spid}`,query:{id:that.cont_id,number:that.value,seled:that.selval0+that.selval1+that.value+'件',price:that.price,sel0:that.sel0,sel1:that.sel1,selid0:that.selid0,selid1:that.selid1,selval0:that.selval0,selval1:that.selval1}})
            }else{
              Toast(res.data.msg);
            }
          })
          .catch(function (error) {
            console.log(error);
            Toast('网络异常');
          })
        }else if(this.rk==3){
          this.list = [{
            id:this.cont_id,
            price:this.price,
            count:this.value,
            img:JSON.parse(this.$route.query.goods).brief.image,
            name:JSON.parse(this.$route.query.goods).brief.name,
            seled:this.selval0+this.selval1
          }]
          this.routerlist = [{
            count:this.value,
            goods_id:this.cont_id,
            norms:this.selval0+this.selval1
          }],
          this.$router.push({path:"/ordsure",query:{list:JSON.stringify(this.list),routerlist:JSON.stringify(this.routerlist),buluo:JSON.stringify(this.buluo),shop:JSON.stringify(this.shop),car:0}})
        }
      }else{
        Toast('请选择规格');
      }
    },
    qd1(){
      if(this.kg==1){
        if(this.kc<1){
          Toast('当前商品库存不足');
          return
        }
        var that = this
        axios.get(`/shopcart/set_shop_cart/${appkey}?storeid=${this.shop.did}&userid=${this.buluo.uid}&count=${this.value}&shopid=${this.cont_id}`)
        .then(function (res) {
          if(res.data.code==200){
            Toast.success('成功加入购物车')
            that.$router.replace({path:`home/${that.spid}`,query:{id:that.cont_id,number:that.value,seled:that.selval0+that.selval1+that.value+'件',price:that.price,sel0:that.sel0,sel1:that.sel1,selid0:that.selid0,selid1:that.selid1,selval0:that.selval0,selval1:that.selval1}})
          }else{
            Toast(res.data.msg);
          }
        })
        .catch(function (error) {
          console.log(error);
          Toast('网络异常');
        })
      }else{
        Toast('请选择规格');
      }
    },
    qd2(){
      if(this.kg==1){
        if(this.kc<1){
          Toast('当前商品库存不足');
          return
        }
        this.list = [{
          id:this.cont_id,
          price:this.price,
          count:this.value,
          img:JSON.parse(this.$route.query.goods).brief.image,
          name:JSON.parse(this.$route.query.goods).brief.name,
          seled:this.selval0+this.selval1
        }]
        this.routerlist = [{
          count:this.value,
          goods_id:this.cont_id,
          norms:this.selval0+this.selval1
        }],
        this.$router.push({path:"/ordsure",query:{list:JSON.stringify(this.list),routerlist:JSON.stringify(this.routerlist),buluo:JSON.stringify(this.buluo),shop:JSON.stringify(this.shop),car:0}})
      }else{
        Toast('请选择规格');
      }
    },
    close(){
      this.$router.go(-1)
    },
    change(){
      if(this.value > this.kc){
        Toast('超出库存')
      }
    },
    infocus(){
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable'

i 
  font-style normal
.cont 
  position: fixed
  top: 0
  bottom: 0
  width: 100%
  z-index  99
  background-color rgba(0,0,0,.4)
  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }

  &.slide-enter, &.slide-leave-to {
    transform: translate3d(0, 100%, 0);
  }
  .bg_pay 
    background-color $color-background
    position absolute
    bottom 0
    left 0
    width 100%
    .close_icon 
      padding 15px
      right 0px
      top 0px
      position absolute
      font-size 20px
      color $color-text-readonly
    .ellipsis 
      font-size $font-size-medium-x
      color $color-text
      line-height 1.5
      margin 40px 15px 20px
      display: -webkit-box !important
      overflow: hidden
      text-align:justify
      text-overflow: ellipsis
      word-break: break-all
      -webkit-box-orient: vertical
      -webkit-line-clamp: 2
    .price 
      font-size 24px
      color $color-order-highlight
      margin-left 10px
      span 
        color $color-text-readonly
        font-size $font-size-medium
    .type_box
      margin-left 10px 
      margin-top 24px 
      font-size $font-size-medium  
      .sel_box 
        display flex
        flex-direction row
        flex-wrap wrap
        justify-content flex-start
        margin-top 16px
        i 
          line-height 28px
          padding 0 20px 
          background-color #f5f5f5
          margin-right 10px
          color $color-text-r
          box-sizing border-box
          border-radius 4px
          margin-bottom 5px
          &.cur 
            background-color #fff6e7
            color $color-order-highlight
            border solid 1px $color-order-highlight
    .buy 
      margin 24px 10px 20px
      font-size $font-size-medium
      display flex 
      justify-content space-between
      align-items center
      .van-stepper
        transform scale(0.9,0.9)
    .btn
      flex 1
      background linear-gradient(left,$color-text-button-left,$color-text-button-right)
      background -webkit-linear-gradient(left,$color-text-button-left,$color-text-button-right)
      line-height 48px
      color $color-text-button
      font-size $font-size-medium-x
      text-align center
    .btn_box
      display flex
      width 100%
      line-height 48px
</style>