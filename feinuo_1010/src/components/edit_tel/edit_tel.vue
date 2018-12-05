<template>
  <div class="cont">
    <top title_name="更换手机"></top>
    <div class="edit">
       <div class="box van-hairline--bottom">
        <span class="lt_txt">新手机号</span>
        <input type="number" v-model="tel" placeholder="请输入新手机号">
      </div>
      <div class="box van-hairline--bottom">
        <span class="lt_txt">验证码</span>
        <input type="number" v-model="code" placeholder="请输入验证码">
        <span class="yzm" :class="tel && code?'cur':''" @click="get_yzm" v-html="t==0?'获取验证码':t+'s..'"></span>
      </div>
      <div class="btn" @click="tj">完成</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Top from "@/base/top/top"
import { Dialog } from 'vant'
import { Toast } from "vant"
import { mapGetters, mapActions } from 'vuex'
export default{
  data(){
    return {
      tel: '',
      code: '',
      t:0
    }
  },
  computed:{
    ...mapGetters(['appkey','uid'])
  },
  methods:{
    get_yzm(){
      if(this.t==0){
        var myreg=/^1[0-9]{10}$/
        var tel = this.tel
        if (!myreg.test(tel)) {
          Toast("手机号码输入有误");
        } else {
          var that = this
          axios.get(`/api/sms/sendsmsweb/${this.appkey}/${tel}`)
          .then(function (res) {
            if(res.data.code==200){
              // 短信验证码发送
              that.t = 60
              setTimeout(() => {
                that.countdown()
              }, 1000)
            }else{
              Toast(res.data.errdes);
            }
          })
          .catch(function (error) {
            console.log(error);
          })
        }
      }
    },
    countdown(){
      if(this.t > 0){
        this.t--
      }else{
        return
      }
      setTimeout(() => {
        this.countdown()
      }, 1000)
    },
    tj() {
      var myreg=/^1[0-9]{10}$/
      var tel = this.tel.replace(/\s*/g,'')
      var code = this.code.replace(/\s*/g,'')
      if(!myreg.test(tel)||code.length<1){
        Toast('填写有误')
        return
      }
      var that = this
      axios.get(`/userinfo/update_colone_tel?id=${this.uid}&tel=${tel}&yzm=${code}`)
      .then(function (res) {
        if(res.data.code==200){
          Toast.success('操作成功')
          that.$router.back()
        }else{
          Toast(res.data.errdes);
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    }
  },
  components:{
    Top
  }
}


</script>


<style scoped lang="stylus">
@import '~@/common/stylus/variable';
.cont
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: $color-background-cont;
  overflow-y: scroll;
  z-index: 10;
  .edit
    margin-top 60px
    .box
      display flex
      align-items center
      height 60px
      padding-right 12px
      margin-left 12px
      font-size $font-size-medium-x
      color #333
      .lt_txt
        width 80px
      input
        flex 1
        height 60px
        min-width 0
        line-height 16px
        &::-webkit-input-placeholder
          padding-top 3px
      .yzm
        color $color-text-little
        &.cur
          color #1381CE
  .btn
    width 80%
    height 44px
    line-height 44px
    text-align center
    color #fff
    background $color-button
    background $color-button-webkit
    margin 60px auto 0
    border-radius 44px
    box-shadow 0 0 10px 5px #d9f6e4
</style>
