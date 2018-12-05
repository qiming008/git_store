<template>
  <div class="cont">
    <top title_name="菲诺旅居" :arrow="false" :naozhong="true" :shuoming="true" v-if="top_show" :xx_num="xx_num"></top>
    <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
      <!-- <div class="none" v-if="cont.length<1">
        <img :src="img_url">
      </div> -->
    <div class="banner" :style="`background-image:url(${banner})`">
    </div>
    <ul class="pro_wrap">
      <p class="yx"><i class="icon_cir"></i>严选项目<i class="icon_cir"></i></p>
      <van-list
        v-model="loading"
        :finished="finished"
        @load="onLoad"
      >
      <li v-for="item in cont" @click="go_info(item)">
        <div class="pro_top">
          <div class="pro_img" v-lazy:background-image="item.fthProject.img"></div>
        </div>
        <div class="pro_bot">
          <div class="bot_l">
            <p class="pro_tit">{{item.fthProject.name}}</p>
            <p class="pro_info van-ellipsis" v-html="item.fthProject.title"></p>
          </div>
          <div class="btn" @click.stop="fenxiang(item)">立即分享</div>
        </div>
      </li>
      <p class="ao" v-if="finished">啊哦，下面已经没内容了~</p>
    </van-list>
    </ul>
    <!-- </van-pull-refresh> -->
    <router-view></router-view>
  </div>
</template>

<script>
import top from '@/base/top/top'
import axios from 'axios'
import { Toast } from 'vant'
import {shareWeixinMessage} from '@/common/js/share'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      cont: [],
      loading: false,
      finished: false,
      isLoading: false,
      page:1,
      top_show:true,
      xx_num: 0,
      banner:require('@/common/images/banner.png')
    }
  },
  computed:{
    ...mapGetters(['uid'])
  },
  mounted(){
    this.get_List(this.page)
  },
  methods:{
    go_info(item){
      this.$router.push({path:`/home/pro_list/${item.fthProject.id}`, query:{id:`${item.fthProject.id}`}})
    },
    onLoad(){
      // this.loading = true
      setTimeout(() => {
        this.page ++
        this.get_List(this.page)
      }, 500)
    },
    // onRefresh(){
    //   clearTimeout(cc)
    //   var cc = setTimeout(() => {
    //     this.finished = false
    //     this.page = 1
    //     this.cont = []
    //     this.load_length = 0
    //     this.get_List(this.page)
    //     this.isLoading = true
    //   }, 500)
    // },
    get_List(p){
      let that = this
      //let param = new URLSearchParams()
      axios.get(`/project/selectproject?stauts=1&pagesize=6&page=${p}`)
      .then(function (res) {
        if(res.data.code==200){
          if(res.data.retvalue.list.length < 1){
            that.finished = true
          }else{
            that.cont.push.apply(that.cont,res.data.retvalue.list)
          }
          that.loading = false
          that.isLoading = false
        }else{
          Toast(res.data.errdes);
        }
      })
      .catch(function (error) {
        Toast('网络错误')
        console.log(error)
      })
      axios.get(`/msg/get_read/1?uid=${this.uid}&type=3`)
      .then(function (res) {
        if(res.data.code==200){
          that.xx_num = res.data.retvalue.size
        }else{
          Toast(res.data.errdes);
        }
      })
      .catch(function (error) {
        Toast('网络错误')
        console.log(error)
      })
    },
    goPath() {
      this.xx_num = 0
      this.$router.push('/pro_list/tongzhi')
    },
    goInstruction() {
      this.$router.push('/pro_list/instruction')
    },
    fenxiang(item){
      var id = this.uid
      var pid = item.fthProject.id
      var name = item.fthProject.name
      var js = item.fthProject.introduction
      shareWeixinMessage(pid,name,js,id)
    }
  },
  computed:{
    ...mapGetters(['uid', 'appkey'])
  },
  components:{
    top
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable'
@import '~@/common/stylus/mixin'
.cont
  background-color $color-background-cont
  position relative

  .banner 
    width 100%
    height 0
    padding-top 48.3%
    margin-top 60px
    background-size cover
    background-position center
    background-repeat no-repeat
  .pro_wrap
    padding 10px 20px 60px
    -webkit-overflow-scrolling touch
    .yx
      font-size $font-size-large 
      font-weight bold
      display flex
      align-items center
      justify-content center
      margin 26px 0
      .icon_cir
        position relative
        width 8px
        height 8px
        background-color RGBA(10, 0, 214, .3)
        margin 0 14px 0 10px
        &:before
          content ''
          position absolute
          width 8px
          height 8px
          background-color RGBA(0, 177, 54, .3)
          border-radius 50%
          right -3px
          top -3px
    .ao
      text-align center
      color #ccc
      font-size 12px
    li
      width 100%
      margin-bottom 15px
      overflow hidden
      .pro_top
        height 150px
        position relative
        background-color rgba(0,0,0,.2)
        padding 10px
        box-sizing border-box
        .pro_img
          background-position center
          background-size cover
          background-repeat no-repeat
          position absolute
          left 0
          top 0
          width 100%
          height 100%
          border-radius 4px
      .pro_bot
        padding 20px 0
        display flex
        justify-content space-between
        align-items center
        .bot_l
          flex 1
          min-width 0
          .pro_tit
            font-size $font-size-medium-x
            font-weight bold
          .pro_info
            font-size $font-size-medium
            color $color-text-little
            margin-top 8px
            line-height 1.3
        .btn
          width 90px
          margin-left 10px
          line-height 30px
          color $color-text-button
          background $color-button
          background $color-button-webkit
          text-align center
          font-size $font-size-medium
          border-radius 50px
        .pro_num
          font-size $font-size-small
          color $color-icon
          margin-top 10px
          i
            font-style normal

</style>
