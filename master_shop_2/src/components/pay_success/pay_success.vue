<template>
  <transition name="slide">
    <div class="main">
      <top :title_name="'支付结果'" :chat="false" to="/home" :query="buluo"></top>
      <div class="cont" v-if="zf>-1">
        <img :src="zfcg" alt="" v-if="zf==1">
        <img :src="zfsb" alt="" v-if="zf==0">
      </div>
      <div class="btn" @click='go_order()'>查看订单</div>
      <!-- <div class="btn" @click='go_reorder()' v-if="zf==0">重新支付</div> -->
    </div>
  </transition>
</template>
<script>
import top from '@/base/top/top'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { Toast } from 'vant'

export default {
  data(){
    return{
      zfcg: require('./zfcg.png'),
      zfsb: require('./zfsb.png'),
      order:'',
      // show: true,
      zf : -1
    }
  },
  mounted(){
    this.zf = this.$route.query.zf_status,
    this.order = this.$route.query.order
  },
  methods:{
    go_order(){
      this.$router.push({path:`/order/${this.order}`, query:{id:this.order,rk:0,buluo:JSON.stringify(this.buluo),shop:JSON.stringify(this.shop)}})
    },
    go_reorder(){
      this.$router.go(-1)
    }
  },
  computed:{
    ...mapGetters(['buluo','shop'])
  },
  components:{
    top
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
  overflow-y scroll
  background-color $color-background
  z-index 100
  &.slide-enter-active, &.slide-leave-active
    transition all .3s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
  .cont 
    margin-top 70px
    width 100% 
    box-sizing border-box
    background-color $color-background-cont
    overflow hidden
    img 
      width 160px
      height auto
      margin 50px auto 20px
      display block
  .btn 
    font-size $font-size-small
    color $color-btn-1
    border solid 1px $color-btn-1
    text-align center
    line-height 30px
    border-radius 50px
    width 120px
    margin 25px auto 20px
 
    
</style>