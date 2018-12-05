<template>
<transition name="slide">
  <div class="kehu-box">
    <top title_name="销量排行榜"></top>
    <div class="content">
      <img src="./beijing.png" alt="">
      <ul class="tab-box">
        <li class="tab" @click="curIndex=0" :class="{'current':curIndex==0}">本周</li>
        <li class="tab" @click="curIndex=1" :class="{'current':curIndex==1}">本月</li>
        <li class="tab" @click="curIndex=2" :class="{'current':curIndex==2}">年度</li>
      </ul>
      <div class="item-box" v-if="curIndex==0">
        <div class="item" v-for="(item, index) in week_lists">
          <img :src="require(`./0${index}.png`)" alt="">
          <div class="item_r">
            <p>&nbsp;</p>
            <p>置业顾问：{{item.name}}</p>
            <p>销售套数：{{item.size}}</p>
          </div>
        </div>
      </div>
      <div class="item-box" v-if="curIndex==1">
        <div class="item" v-for="(item, index) in month_lists">
          <img :src="require(`./0${index}.png`)" alt="">
          <div class="item_r">
            <p>&nbsp;</p>
            <p>置业顾问：{{item.name}}</p>
            <p>销售套数：{{item.size}}</p>
          </div>
        </div>
      </div>
      <div class="item-box" v-if="curIndex==2">
        <div class="item" v-for="(item, index) in year_lists">
          <img :src="require(`./0${index}.png`)" alt="">
          <div class="item_r">
            <p>&nbsp;</p>
            <p>置业顾问：{{item.name}}</p>
            <p>销售套数：{{item.size}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
import Top from '@/base/top/top'
import axios from 'axios'
import { Toast } from 'vant'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      curIndex: 0,
      week_lists:[],
      month_lists: [],
      year_lists: []
    }
  },
  computed:{
    ...mapGetters(['appkey'])
  },
  mounted() {
    var that = this
    //let param = new URLSearchParams()
    axios.get(`/usercolonel/get_phb/${this.appkey}?status=1`)
    .then(function (res) {
      if(res.data.code==200){
        that.week_lists = res.data.retvalue
      }else{
        Toast(res.data.errdes)
      }
    })
    .catch(function (error) {
      console.log(error)
    })
    axios.get(`/usercolonel/get_phb/${this.appkey}?status=2`)
    .then(function (res) {
      if(res.data.code==200){
        that.month_lists = res.data.retvalue
      }else{
        Toast(res.data.errdes)
      }
    })
    .catch(function (error) {
      console.log(error)
    })
    axios.get(`/usercolonel/get_phb/${this.appkey}?status=3`)
    .then(function (res) {
      if(res.data.code==200){
        that.year_lists = res.data.retvalue
      }else{
        Toast(res.data.errdes)
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  },
  methods: {
    
  },
  components: {
    Top
  }
}
</script>

<style scoped lang="stylus">
@import '~@/common/stylus/variable'
@import '~@/common/stylus/mixin'
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
  
  .kehu-box
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    background-color $color-background
    z-index 10
    
    .content
      display flex
      flex-direction column
      height 100%
      color $color-text-little
      position relative
      padding 0 12px 50px
      box-sizing border-box
      &>img
        position absolute 
        left 0
        top 0 
        width 100%
        height 100%
      .tab-box
        display flex
        margin-top 60px
        justify-content center
        width 100%
        height 30px
        padding 25px 0
        font-size $font-size-medium
        line-height 30px
        text-align center
        color $color-text-little
        z-index 9999
        .tab
          width 75px
          box-sizing border-box
          background-color $color-background-cont
          border-right solid 1px $color-background
          &:nth-child(1)
            border-radius 15px 0 0 15px
          &:nth-child(3)
            border-radius 0 15px 15px 0
          &.current
            color $color-button-green
      .item-box 
        flex 1
        width 100%
        background-color $color-background-cont
        display flex 
        justify-content center
        align-items center
        flex-direction column
        border-radius 10px
        z-index 999
        .item 
          display flex
          align-items center
          margin 25px 0
          &>img 
            width 77px
            height 100px
            margin-right 24px
          .item_r 
            padding-top 10px
            font-size $font-size-medium-x
            line-height 1.5
</style>
