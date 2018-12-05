<template>
  <transition name="fade">
    <div class="addaddress">
      <top :title_name="'修改收货地址'" :arrow="true"></top>
      <div class="addaddress_box">
        <h1 class="tit">基本信息</h1>
        <div class="ipt_box">
          <span class="ipt_txt">收&nbsp;&nbsp;货&nbsp;&nbsp;人</span>
          <input type="text" placeholder="请输入姓名" v-model="addr.name" maxlength="10">
        </div>
        <div class="ipt_box">
          <span class="ipt_txt">性&emsp;&emsp;别</span>
          <div class="sex_box">
            <div class="sex" :class="addr.sex==1?'sex_check':''" @click="addr.sex=1">
              <van-icon :name="addr.sex==1?'checked':'check'" class="check"/><span>先生</span>
            </div>
            <div class="sex" :class="addr.sex==2?'sex_check':''" @click="addr.sex=2">
              <van-icon :name="addr.sex==2?'checked':'check'" class="check"/><span>女士</span>
            </div>
          </div>
        </div>
        <div class="ipt_box">
          <span class="ipt_txt">联系方式</span>
          <input type="number" placeholder="请输入电话" v-model="addr.tel" maxlength="11">
        </div>
        <h1 class="tit">收货地址</h1>
        <div class="ipt_box">
          <span class="ipt_txt">省/ 市/ 区</span>
          <div class="ipt_right">{{addr.area}}</div>
        </div>
        <div class="ipt_box">
          <span class="ipt_txt">邻&nbsp;&nbsp;居&nbsp;&nbsp;圈</span>
          <div class="ipt_right">{{addr.buluo_name}}</div>
        </div>
        <div class="ipt_box">
          <span class="ipt_txt">详细地址</span>
          <input type="text" placeholder="例：x号楼x单元801" v-model="addr.address" maxlength="50">
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
      addr: this.$route.query.addr
    }
  },
  methods: {
    sure() {
      let name = this.addr.name.replace(/\s*/g, '')
      let sex = this.addr.sex
      let tel = this.addr.tel.toString().replace(/\s*/g, '')
      let address = this.addr.address.replace(/\s*/g, '')
      if (name.length < 1 || name.length > 10) {
        Toast('收货人姓名：10个字符以内')
      } else if (!tel.match(/^1[3|4|5|6|7|8]\d{9}$/)) {
        Toast('联系方式不正确')
      } else if (address === '') {
        Toast('请输入详细地址')
      } else {
        let param = `?id=${this.addr.id}&sex=${sex}&name=${name}&tel=${tel}&address=${address}`
        axios.get(`/api/addrs/update${param}`)
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
      padding 0 12px
      color $color-text
      .tit
        line-height 50px
        font-size $font-size-large
      .ipt_box
        display flex
        align-items center
        line-height 30px
        margin-bottom 15px
        font-size $font-size-medium
        .ipt_txt
          width 70px
          margin-right 40px
        input
          flex 1
          height 30px
          min-width 0
          color $color-text-r
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
          flex 1
          min-width 0
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
          color $color-text-r
    .btn
      width 290px
      height 44px
      margin 70px  auto 0
      text-align center
      line-height 44px
      color $color-text-button
      font-size $font-size-large
      border-radius 22px
      background linear-gradient(to right, $color-btn-1 , $color-order-highlight)
</style>
