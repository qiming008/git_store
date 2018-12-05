<template>
  <van-tabbar v-model="active">
    <van-tabbar-item to='/home'>
      <span>首页</span>
      <template slot="icon" slot-scope="props">
        <i :class="props.active ? icon.active : icon.normal"></i>
      </template>
    </van-tabbar-item>
    <van-tabbar-item to='/shopping_car'>
      <span>购物车</span>
      <template slot="icon" slot-scope="props">
        <i :class="props.active ? icon1.active : icon1.normal" ></i>
      </template>
    </van-tabbar-item>
    <van-tabbar-item to='/order'>
      <span>订单</span>
      <template slot="icon" slot-scope="props">
        <i :class="props.active ? icon2.active : icon2.normal" ></i>
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      active: 0,
      icon: {
        normal: 'index',
        active: 'index_active'
      },
      icon1: {
        normal: 'shopping_car',
        active: 'shopping_car_active'
      },
      icon2: {
        normal: 'order',
        active: 'order_active'
      }
    }
  },
  methods:{
    ...mapGetters(['buluo'])
  },
  watch:{
    $route(){
      var path = this.$route.path
      if(path.indexOf('home')!==-1){
        this.active = 0
      }else if(path.indexOf('shopping_car')!==-1){
        this.active = 1
      }else if(path.indexOf('order')!==-1){
        this.active = 2
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable'
@import '~@/common/stylus/mixin'
.van-tabbar
  z-index:10!important
.van-tabbar-item--active
  color $color-order-highlight
i 
  width 35px
  height 25px
  background-position center bottom
  background-repeat no-repeat
  display block
.shopping_car
  // bg-image('dd')
  background-image url('./shopping_car1.png')
  background-size 25px 24px
  background-position center
.shopping_car_active 
  background-image url('./shopping_car.png')
  background-size 25px 24px
  background-position center
.index
  // bg-image('index')
  background-image url('./index1.png')
  background-size 26px 23px
  background-position center
.index_active
  background-image url('./index.png')
  background-size 26px 23px
  background-position center
.order
  // bg-image('me')
  background-image url('./order1.png')
  background-size 22px 22px
  background-position center
.order_active
  // bg-image('me_active')
  background-image url('./order.png')
  background-size 22px 22px
  background-position center
</style>
