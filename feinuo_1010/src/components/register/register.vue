<template>
  <transition name="slide">
    <div class="cont">
      <p class="back_p" @click="go_back()">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-arrowleft"></use>
        </svg>
        返回
      </p>
      <p class="tit_p">申请成为团长</p>
      <p class="f_p van-hairline--bottom">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-myfill"></use>
        </svg>
        <input type="text" placeholder="姓名" v-model="name">
      </p>
      <p class="f_p van-hairline--bottom">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-mobilefill"></use>
        </svg>
        <input type="number" placeholder="手机号" v-model="phonenumber">
      </p>
      <p class="f_p van-hairline--bottom">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-iconfont5"></use>
        </svg>
        <input type="number" placeholder="验证码" v-model="yzm">
        <i @click="get_yzm()" v-html="t==0?'获取验证码':t+'s..'"></i>
      </p>
      <p class="f_p van-hairline--bottom" @click="sel_area()">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-weizhi-xianxing"></use>
        </svg>
        <input type="text" placeholder="选择地区" v-model="area" readonly>
      </p>
      <p class="xy_p" @click.stop="read_xy()">
        <svg class="icon" aria-hidden="true" v-if="xy_read">
          <use xlink:href="#icon-btn_selectd"></use>
        </svg>
        <svg class="icon" aria-hidden="true" v-else>
          <use xlink:href="#icon-unselected"></use>
        </svg>
        <span>
          申请即代表阅读并同意
          <i @click.stop="go_xy" class="xy">用户协议</i>
        </span>
      </p>
      <div class="btn" @click="ljrz()">立即入驻</div>
      <region :show='show' @confirm='confirm' @cancel='cancel'></region>
    </div>
  </transition>
</template>

<script>
import axios from 'axios'
import { Toast } from 'vant'
import { mapGetters} from 'vuex'
import Region from "@/base/region/region"
export default{
  data(){
    return {
      name:'',
      phonenumber:'',
      yzm:'',
      sheng:'',
      shi:'',
      qu:'',
      t:0,
      xy_read:true,
      show: false
    }
  },
  computed:{
    ...mapGetters(['appkey'])
  },
  methods:{
    get_yzm(){
      if(this.t==0){
        var myreg=/^1[0-9]{10}$/
        if (!myreg.test(this.phonenumber)) {
          Toast("手机号码输入有误");
        } else {
          var that = this
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
      if(this.t > 0){
        this.t--
      }else{
        return
      }
      setTimeout(() => {
        this.countdown()
      }, 1000)
    },
    go_back(){
      this.$router.go(-1)
    },
    go_xy(){
      this.$router.push("/user-xy")
    },
    read_xy(){
      this.xy_read = !this.xy_read
    },
    ljrz(){
      var myreg=/^1[0-9]{10}$/
      var phone = this.phonenumber.replace(/\s*/g,'')
      var yzm = this.yzm.replace(/\s*/g,'')
      var name = this.name.replace(/\s*/g,'')
      if(!myreg.test(phone)||yzm.length<1||name.length<1||this.qu.length<1){
        Toast('填写有误')
        return
      }
      if(!this.xy_read){
        Toast('同意用户协议方可入驻')
        return
      }
      var that = this
      axios.get(`/projectbpm/apply_chief/${this.appkey}/${yzm}/${phone}?source=''&channel=''&name=${name}&uid=0&shen=${this.sheng}&shi=${this.shi}&qu=${this.qu}`)
      .then(function (res) {
        if(res.data.code==200){
          that.$router.push('/request')
        }else{
          Toast(res.data.errdes);
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    sel_area() {
      this.show = !this.show;
    },
    confirm: function(a) {
      for (let i = 0; i < a.length; i++) {
        if (a[i].code == -1) {
          Toast(`请${a[i].name}`)
          return
        }
      }
      this.re_area_text(a);
    },
    cancel: function() {
      this.show = false;
    },
    re_area_text: function(a) {
      var text = "";
      var kg = 0;
      for (var i = 0; i < a.length; i++) {
        if (a[i].code > 0) {
          text += a[i].name + " ";
        } else {
          kg = 1;
        }
      }
      if (kg != 1) {
        this.area = text;
        this.sheng = a[0].code;
        this.shi = a[1].code;
        this.qu = a[2].code;
        this.show = false;
      }
    },
  },
  components:{
    Region
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
.cont
  width 100%
  height 100%
  background-color $color-background-cont
  padding 55px 18px
  box-sizing border-box
  .back_p
    color $color-text-little
    font-size $font-size-large-x
    margin-bottom 25px
    .icon
      margin-right 10px
  .tit_p
    color $color-text
    font-size $font-size-large-xx
    margin-bottom 25px
  .f_p
    width 100%
    display flex
    align-items center
    font-size $font-size-medium-x
    height 60px
    .icon
      color $color-icon
      margin-right 8px
    input
      flex 1
      height 60px
      min-width 0
      line-height 1em
      &::-webkit-input-placeholder
        padding-top 3px
    i
      font-style normal
      margin-left 10px
      color $color-button
  .xy_p
    color $color-text-little
    font-size $font-size-medium
    margin 14px 0
    .icon
      color $color-button
    .xy
      color $color-text-blue
      font-style normal
  .btn
    width 100%
    border-radius 50px
    background-color $color-button
    line-height 42px
    text-align center
    background $color-button
    background $color-button-webkit
    font-size $font-size-medium-x
    margin 35px 0
    color #fff
</style>

