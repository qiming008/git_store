<template>
  <div class="top">
    <p>
      <van-icon name="arrow-left" class="icon" @click='goBack' v-show='arrow'/>
      <i v-show='arrow' style="margin-top:-2px">|</i>
      <img src="./x.png" alt="" @click='out' v-show='arrow' class="out">
      <span>{{title_name}}</span>
      <b></b>
      <i @click='wancheng_fun' v-show='wancheng'>完成</i>
      <i @click='guanli_fun' v-show='guanli'>管理</i>
      <i class="wenhao" v-show='shareicon'  @click='share'><img src="./share.png" alt=""></i>
      <!-- <i class="wenhao" v-show='wenhao'  @click='gowenhao'><img src="./wenhao.png" alt=""></i> -->
      <a class="chat" v-show='chat' :href="'tel:'+shop.tel" v-if="xt==2"><img src="./chat.png" alt=""></a>
      <i class="chat" v-show='chat'  @click='takephone(shop.tel)' v-else><img src="./chat.png" alt=""></i>
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default{
  props: {
    to: {
      type: String,
      default: ''
    },
    title_name: {
      type: String,
      default: ''
    },
    arrow: {
      type:Boolean,
      default: true
    },
    wenhao: {
      type:Boolean,
      default: false
    },
    chat: {
      type:Boolean,
      default: true
    },
    wancheng: {
      type:Boolean,
      default: false
    },
    guanli: {
      type:Boolean,
      default: false
    },
    shareicon:{
      type:Boolean,
      default: false
    },
    query: {
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  data(){
    return{
      xt:1    //1Android,2ios
    }
  },
  mounted(){
    this.bcc()
  },
  computed: {
    ...mapGetters(['shop'])
  },
  methods: {
    goBack() {
      if(this.to){
        this.$router.replace({path:this.to, query:this.query?this.query:''})
      }else if(this.$route.path=='/ordsure' && this.$route.query.beizhu){
        this.$router.go(-2)
      }else if(this.$route.path=='/home' || this.$route.path=='/order'){
        this.out()
      }else{
        this.$router.go(-1)
      }
    },
    gowenhao() {
      this.$router.push('')
    },
    gochat() {
      this.$router.push('/chat')
    },
    share() {
      this.$emit("share")
    },
    wancheng_fun() {
      this.$emit("wancheng")
    },
    guanli_fun() {
      this.$emit("guanli")
    },
    bcc(){
      var u = navigator.userAgent, app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        this.xt = 1
      }
      if (isIOS) {
        this.xt = 2
      }
    },
    takephone(tel){
      document.location = `js://phone:${tel}`
    },
    out(){
      document.location = `js/del_top`
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'

.top 
  position fixed
  width 100%
  height 64px
  background $color-background-cont
  z-index 8
  width 100%
  p
    padding-top 20px
    font-size $font-size-large
    color $color-text
    display flex
    align-items center
    height 44px
    width 100%
    justify-content space-between
    i,a 
      font-style normal
      z-index 20
    i  
      margin-right 10px
    .icon
      color #2f2f2f
      padding:10px 2px 10px 10px;
      font-weight bold
    span 
      position absolute
      left 0
      text-align center
      width 100%
      z-index 9
      line-height 40px
    b 
      flex 1
      min-width 0
    .wenhao 
      padding 7px
      margin-right 0
      img 
        width 22px
        height 22px
    .chat 
      padding 10px 18px
      img 
        width 22px
        height 22px
    .out 
        width 16px
        height 16px
        padding 7px
        margin-left -6px
        z-index 999
</style>
