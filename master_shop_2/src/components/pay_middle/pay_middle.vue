<template>
  <transition name="slide">
    <div class="main">
      <van-popup class="popup" v-model="show" :close-on-click-overlay="false">
        <p class="van-hairline--bottom">请确认支付是否完成</p>
        <p class="van-hairline--bottom red" @click="get_zf">完成支付</p>
        <p @click="reget_zf" class="grey">支付遇到问题，重新支付</p>
      </van-popup>
    </div>
  </transition>
</template>
<script>
import axios from "axios";
import { Toast } from "vant";
import { mapGetters } from 'vuex'
export default {
  data(){
    return{
      zf_kg:true,
      id:this.$route.query.id,
      show:true
    }
  },
  mounted(){

  },
  computed:{
    ...mapGetters(['buluo','shop'])
  },
  methods:{
    get_zf:function(){
    if(!this.zf_kg){
      return
    }
    this.zf_kg = false
    let that = this
    setTimeout(() => {
      axios.get(`/api/order/pay/synchroni?order_id=${that.id}`)
      .then( (res) => {
        that.zf_kg = true
        if(res.data.data==1){
          that.$router.push({path:`/success_pay`,query:{zf_status:1,order:that.id}})
        }else{
          that.$router.push({path:`/success_pay`,query:{zf_status:0,order:that.id}})
        }
      })
      .catch(function (error) {
        Toast('网络异常');
        console.log(error);
      })
      }, 1000)
    },
    reget_zf:function(){
      this.$router.push({path:`/order/${this.id}`, query:{id:this.id,rk:0,buluo:JSON.stringify(this.buluo),shop:JSON.stringify(this.shop)}})
    }
  },
  watch:{
    $route(){
      if(this.$route.path.indexOf('/pay_mid')!=-1){
        this.show = true
      }
    }
  }
}
</script>



<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl'

.main 
  position fixed
  top 0
  bottom 0
  width 100%
  background-color $color-background
  z-index 100
  &.slide-enter-active, &.slide-leave-active
    transition all .3s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
  .popup 
    width 80%
    background-color $color-background
    text-align center 
    line-height 50px
    border-radius 6px
    .red 
      color $color-button
    .grey 
      color $color-text-readonly
</style>