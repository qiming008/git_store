<template>
  <div class="cont">
    <dl>
      <dt>
        <img src="./touxiang@2x.png" alt="">
      </dt>
      <dd>菲诺旅居</dd>
    </dl>
    <p class="f_p van-hairline--bottom">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-myfill"></use>
      </svg>
      <input type="number" placeholder="请输入手机号" v-model="phonenumber">
    </p>
    <p class="f_p van-hairline--bottom">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-lock"></use>
      </svg>
      <input type="number" placeholder="验证码" v-model="yzm">
      <i @click="get_yzm1()" v-html="t==0?'获取验证码':t+'s..'" class="hqyzm"></i>
    </p>
    <div class="btn" @click="login()">登录</div>
    <p class="text-blue" @click="go_register()">申请成为团长</p>
  </div>
</template>

<script>
import axios from 'axios'
import { Toast } from 'vant'
import { mapGetters, mapActions } from 'vuex'

export default {
  data(){
    return {
      logo:require("@/common/images/logo.png"),
      phonenumber:'',
      yzm:'',
      t:0
    }
  },
  mounted(){

  },
  computed:{
    ...mapGetters(['uid','appkey'])
  },
  methods:{
    get_yzm1(){
      if(this.t==0){
        var myreg=/^1[0-9]{10}$/
        if (!myreg.test(this.phonenumber)) {
          Toast("手机号码输入有误");
        } else {
          var that = this
          //let param = new URLSearchParams()
          axios.get(`/api/sms/sendsmsweb/${this.appkey}/${this.phonenumber}`)
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
      var that = this
      if(this.t > 0){
        this.t--
      }else{
        return
      }
      setTimeout(() => {
        that.countdown()
      }, 1000)
    },
    login(){
      var myreg=/^1[0-9]{10}$/
      var phone = this.phonenumber.replace(/\s*/g,'')
      var yzm = this.yzm.replace(/\s*/g,'')
      if(!myreg.test(phone)||yzm.length<1){
        Toast('填写有误')
        return
      }
      var that = this
      axios.get(`/userinfo/login/${this.appkey}/?tel=${phone}&yzm=${yzm}`)
      .then(function (res) {
        if(res.data.code==200){
          that.save_uid(res.data.retvalue.id)
          that.save_imei(res.data.retvalue.imei)
          that.t = 0
          that.$router.replace('/home/pro_list')
        }else{
          Toast(res.data.errdes);
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    go_register(){
      this.$router.push('/register')
    },
    ...mapActions([
      'save_uid',
      'save_imei'
    ])
  },
  components:{

  },
  watch: {
    $route(to) {
      if (to.path === '/login') {
        this.yzm = ''
        this.t = 0
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
@import '../../common/stylus/mixin.styl'
  
.cont
  background $color-background-cont
  overflow hidden
  padding 100px 38px 40px
  height 100%
  box-sizing border-box
  width 100%
  dl
    text-align center
    width 100%
    margin 0 auto 65px
    dt
      //bg-image(touxiang)
      width 75px
      height 75px
      margin 0 auto
      margin-bottom 10px
      background-size contain
      img
       width 100%
       height 100%
    dd
      color $color-text
      font-size $font-size-large
  .f_p
    width 100%
    display flex
    align-items center
    font-size $font-size-medium-x
    height 60px
    .hqyzm
      color $color-text-blue
    .icon
      color $color-icon
      margin-right 8px
    input
      flex 1
      min-width 0
      height 60px
      line-height 1em
      &::-webkit-input-placeholder
        padding-top 3px
    i
      font-size $font-size-medium
      font-style normal
      padding 20px
  .btn
    width 100%
    border-radius 50px
    background $color-button
    background $color-button-webkit
    line-height 42px
    text-align center
    color $color-text-button
    font-size $font-size-medium-x
    margin 35px 0
  .text-blue
    margin-top 20px
    font-size $font-size-medium
    color $color-text-blue
    text-align center
    width 100%
    left 0
</style>


