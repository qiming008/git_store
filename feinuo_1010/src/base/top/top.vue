<template>
  <div class="top van-hairline--bottom">
    <p>
      <svg class="icon" aria-hidden="true" @click='goBack' v-show='arrow'>
        <use xlink:href="#icon-back"></use>
      </svg>
      <span class="van-ellipsis">{{title_name}}</span>
      <b></b>
      <svg class="icon shuoming" aria-hidden="true" @click='goInstruction' v-show='shuoming'>
        <use xlink:href="#icon-wenhao"></use>
      </svg>
      <i class="naozhong_box icon">
        <svg class="icon naozhong" aria-hidden="true" @click='goPath' v-show='naozhong'>
          <use xlink:href="#icon-massage"></use>
        </svg>
        <span class="xx_num" v-show="xx_num>0"></span>
      </i>
      
      <!-- <i :class="active_tj?'cur':''" class="tj" v-show='tousu' @click="tj">提交</i> -->
      <i :class="active?'cur':''" class="wc" v-show='change' @click="wc">完成</i>
    </p>
  </div>
</template>

<script>
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
    naozhong: {
      type:Boolean,
      dafault: false
    },
    shuoming: {
      type:Boolean,
      dafault: false
    },
    change:{
      type:Boolean,
      default: false
    },
    active:{
      type:Boolean,
      dafault:false
    },
    query: {
      type:Object,
      default:function(){
        return {}
      }
    },
    xx_num:{
      type:Number,
      default:0
    }
  },
  methods: {
    goBack() {
      if(this.to){
        this.$router.replace({path:this.to, query:this.query?this.query:''})
      }else{
        this.$router.go(-1)
      }
    },
    goPath() {
      this.$router.push('/pro_list/tongzhi')
    },
    goInstruction() {
      this.$router.push('/pro_list/instruction')
    },
    wc(){
      this.$emit('wc')
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'

.top 
  position fixed
  width 100%
  height 60px
  background $color-background-cont
  z-index 8
  width 100%
  top 0 
  left 0
  p
    padding-top 20px
    font-size $font-size-medium-x
    color $color-text
    display flex
    align-items center
    height 40px
    line-height 40px
    width 100%
    justify-content space-between
    .icon
      color #2f2f2f
      padding 10px 4px 10px 10px
      z-index 10
      font-size 20px
    span 
      position absolute
      left 0
      text-align center
      width 100%
      z-index 9
      font-size $font-size-large
    b 
      flex 1
      min-width 0
    .shuoming 
      font-size 19px
    .naozhong_box
      position relative
      padding-right 20px
      .xx_num
        position absolute
        top 10px
        left 26px
        width 8px
        height 8px
        background #f00
        border-radius 50%
        z-index 10
      .naozhong
        position absolute
        top -2px
        left 0
        font-size 23px
    .tj 
      padding 10px
      font-style normal
      line-height 1
      font-size $font-size-medium 
      color $color-text-little
      z-index 10
      &.cur 
        color $color-button-green
    .wc 
      padding 10px
      font-style normal
      line-height 1
      font-size $font-size-medium 
      color $color-text-little
      z-index 10
      &.cur 
        color #2f2f2f
</style>
