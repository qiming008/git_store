<template>
  <div class="warp">
    <top :title_name="'订单'"></top>
    <van-tabs swipeable sticky v-model="active">
      <van-tab>
        <div slot="title">
          全部
        </div>
        <order-list @select="select" :active='active' :num='0'></order-list>
      </van-tab>
      <van-tab>
        <div slot="title">
          待付款
        </div>
        <order-list @select="select" :active='active' :num='1'></order-list>
      </van-tab>
      <van-tab>
        <div slot="title">
          待接单
        </div>
        <order-list @select="select" :active='active' :num='2'></order-list>
      </van-tab>
      <van-tab>
        <div slot="title">
          待收货
        </div>
        <order-list @select="select" :active='active' :num='3'></order-list>
      </van-tab>
      <van-tab>
        <div slot="title">
          退款
        </div>
        <order-list-tk @select="select_tk" :active='active' :num='4'></order-list-tk>
      </van-tab>
    </van-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
import top from '@/base/top/top'
import axios from 'axios'
import { mapGetters } from 'vuex'
import orderList from '@/base/orderList/orderList'
import orderListTk from '@/base/orderList-tk/orderList-tk'
import { Toast } from 'vant'

export default{
  data(){
    return{
      active: 0
    }
  },
  methods:{
    select:function(item){
      this.$router.push({path:`order/${item.order.id}`,query:{id:item.order.id,rk:0,buluo:JSON.stringify(this.buluo),shop:JSON.stringify(this.shop)}})
    },
    select_tk:function(item){
      this.$router.push({path:`order/${item.orderRefund.id}`,query:{id:item.orderRefund.id,rk:1,buluo:JSON.stringify(this.buluo),shop:JSON.stringify(this.shop)}})
    }
  },
  computed:{
    ...mapGetters(['buluo','shop'])
  },
  components:{
    top,
    orderList,
    orderListTk
  },
  watch:{
  }
}
</script>


<style lang="stylus" scoped>
@import '~@/common/stylus/variable'
@import '~@/common/stylus/mixin'
.warp 
  overflow hidden
  .van-tabs
    margin-top 64px
    z-index 10
    background-color #fff
    .van-tabs__wrap
      top:60px;
</style>
