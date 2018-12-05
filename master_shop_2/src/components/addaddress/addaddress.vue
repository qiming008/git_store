<template>
  <transition name="fade">
    <div class="addaddress">
      <top :title_name="'添加收货地址'" :arrow="true"></top>
      <div class="addaddress_box">
        <h1 class="tit">基本信息</h1>
        <div class="ipt_box">
          <span class="ipt_txt">收&nbsp;&nbsp;货&nbsp;&nbsp;人</span>
          <input type="text" placeholder="请输入姓名" v-model="name" maxlength="10">
        </div>
        <div class="ipt_box">
          <span class="ipt_txt">性&emsp;&emsp;别</span>
          <div class="sex_box">
            <div class="sex" :class="sex==1?'sex_check':''" @click="sex=1">
              <van-icon :name="sex==1?'checked':'check'" class="check"/><span>先生</span>
            </div>
            <div class="sex" :class="sex==2?'sex_check':''" @click="sex=2">
              <van-icon :name="sex==2?'checked':'check'" class="check"/><span>女士</span>
            </div>
          </div>
        </div>
        <div class="ipt_box">
          <span class="ipt_txt">联系方式</span>
          <input type="number" placeholder="请输入电话" v-model="tel" maxlength="11">
        </div>
        <h1 class="tit">收货地址</h1>
        <div class="ipt_box">
          <span class="ipt_txt">省/ 市/ 区</span>
          <div class="ipt_right">{{shop.area}}</div>
        </div>
        <div class="ipt_box">
          <span class="ipt_txt">邻&nbsp;&nbsp;居&nbsp;&nbsp;圈</span>
          <div class="ipt_right">{{buluo.blname}}</div>
        </div>
        <div class="ipt_box">
          <span class="ipt_txt">详细地址</span>
          <input type="text" placeholder="例：x号楼x单元801" v-model="address" maxlength="50">
        </div>
        <div class="btn" @click="sure">确认</div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import top from '@/base/top/top'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { Toast } from 'vant'
export default {
  data() {
    return {
      name: '',
      sex: 1,
      tel: '',
      address: ''
    }
  },
  computed: {
    ...mapGetters(['buluo', 'shop'])
  },
  methods: {
    sure() {
      let name = this.name.replace(/\s*/g, '')
      let sex = this.sex
      let tel = this.tel.toString().replace(/\s*/g, '')
      let address = this.address.replace(/\s*/g, '')
      if ( name.length > 10 || name.length < 1) {
        Toast('收货人姓名：10个字符以内')
      } else if (!tel.match(/^1[3|4|5|6|7|8]\d{9}$/)) {
        Toast('联系方式不正确')
      } else if (address === '') {
        Toast('请输入详细地址')
      } else {
        let param = `?uid=${this.buluo.uid}&sex=${sex}&shop_id=${this.shop.did}&name=${name}&tel=${tel}&address=${address}&buluo_name=${this.buluo.blname}&area=${this.shop.area}`
        axios.get(`/api/addrs/save${param}`)
        .then((res) => {
          if(res.data.code===200){
            this.$router.back()
          }else{
            Toast(res.data.msg)
          }
        })
        .catch((error) => {
          Toast('网络异常')
          console.log(error)
        })
      }
    }
  },
  components: {
    top
  }
}
</script>

<style scoped lang="stylus">
  @import '~@/common/stylus/variable'
  .fade-enter-active,.fade-leave-active
    transition all 0.3s
  .fade-enter,.fade-leave-to
    transform translate3d(100%,0,0)
  .addaddress
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    z-index 9
    background $color-background
    overflow-y auto
    -webkit-overflow-scrolling touch
    .addaddress_box
      margin-top 64px
      padding 0 15px
      color $color-text
      .tit
        line-height 50px
        font-size $font-size-medium-x
        font-weight bold
        margin-bottom 4px
      .ipt_box
        display flex
        align-items center
        line-height 30px
        margin-bottom 8px
        font-size $font-size-medium
        .ipt_txt
          width 70px
          margin-right 40px
        input
          flex 1
          min-width 0
          height 30px
          color $color-btn-2
          font-size $font-size-medium
          &::-webkit-input-placeholder
            color $color-text-readonly
        .sex_box
          display flex
          align-items center
          .sex
            display flex
            align-items center
            &:first-child
              margin-right 50px
            .check
              margin-right 10px
              color $color-btn-2
              font-size $font-size-medium
            &.sex_check .check
              color $color-btn-1
        .ipt_right
          color $color-text-r
          flex 1
          min-width 0
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
    .btn
      width 90%
      height 44px
      margin 70px  auto 0
      text-align center
      line-height 44px
      color $color-text-button
      font-size $font-size-medium
      border-radius 22px
      background linear-gradient(to right, $color-btn-1 , $color-order-highlight)
</style>
