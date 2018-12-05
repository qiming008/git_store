<template>
  <transition name="slide">
    <div class="cont">
      <top :title_name="info.fthProject.name" v-if="info.fthProject"></top>
      <div class="pro_one_con">
        <van-swipe class="pro_img_top">
          <van-swipe-item v-for="(image, index) in info.listpicture" :key="index">
            <div v-lazy:background-image="image"></div>
          </van-swipe-item>
        </van-swipe>

        <div class="pro_intro van-hairline--bottom">
          <p class="pro_intro_to" @click="go_intro(info.fthProject)">
            <span class="text" v-html="info.fthProject.name" v-if="info.fthProject"></span>
            <span class="right">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-right"></use>
              </svg>
            </span>
          </p>
          <p class="pro_intro_cont" v-html="info.fthProject.introduction" v-if="info.fthProject"></p>
          <p class="pro_intro_list">
            <span v-for="item in info.list" v-html="item"></span>
          </p>
        </div>
        <div class="pro_rule van-hairline--bottom">
          <p class="pro_rule_to" @click="go_rule(info.fthProject)">
            <span class="text">分销规则</span>
            <span class="right">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-right"></use>
              </svg>
            </span>
          </p>
          <img :src="gz_img" alt="" class="gz_img">
          <!-- <p class="rule_box">
            分享客户
            <span class="right">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-right"></use>
              </svg>
            </span>
            平台跟进
            <span class="right">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-right"></use>
              </svg>
            </span>
            客户成交
            <span class="right">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-right"></use>
              </svg>
            </span>
            获得佣金
          </p> -->
          <p class="ckyj"  v-if="info.fthProject">参考佣金:{{info.fthProject.begin_brokerage}}元/m<sup>2</sup>~{{info.fthProject.end_brokerage}}元/m<sup>2</sup></p>
          <p class="hyaz" v-html="info.fthProject.distributioncontent"  v-if="info.fthProject"></p>
        </div>
        <div class="ly_box">
          <p class="ly_t">
            <span class="ly_tit">精选评论</span>
            <span class="green" @click="go_liuyan()">写评论</span>
          </p>
          <ul class="ly_list" v-if="liuyan.length>0">
            <li v-for="item in liuyan">
              <img :src="item.userimg?item.userimg:tx_img" alt="">
              <p>
                <span class="ly_name">
                  <i style="color:#6d6d6d">{{item.username}}</i>
                  <i>{{item.addtime}}</i>
                </span>
                <span class="ly_cont">{{item.content}}</span>
              </p>
            </li>
          </ul>
          <img src="./none.png" alt="" class="none" v-if="liuyan.length<1">
        </div>
      </div>

      <div class="btn_bot" @click="fenxiang()">
        分享赚佣金
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import top from '@/base/top/top'
import axios from 'axios'
import { Toast } from 'vant'
import {shareWeixinMessage} from '@/common/js/share'
import { mapGetters } from 'vuex'
export default {
  data(){
    return {
      id:this.$route.query.id,
      info:{},
      dongtai:[],
      liuyan:[],
      gongneng:[],
      tx_img:require('@/common/images/logo.png'),
      gz_img:require('@/components/pro-one/gz.png')
    }
  },
  mounted(){
    let that = this
    //浏览量
    //let param = new URLSearchParams()
    axios.get(`/project/savecount/${this.id}`)
    .then(function (res) {
      if(res.data.code==200){
      }else{
        Toast(res.data.errdes)
      }
    })
    .catch(function (error) {
      Toast('网络错误')
      console.log(error)
    })
    //详情
    axios.get(`/project/projectdetile/${this.id}`)
    .then(function (res) {
      if(res.data.code==200){
        that.info = res.data.retvalue
      }else{
        Toast(res.data.errdes)
      }
    })
    .catch(function (error) {
      Toast('网络错误')
      console.log(error)
    })
    //动态列表
    // axios.get(`/trends/selecttrends?type=1&project_id=${this.id}`)
    // .then(function (res) {
    //   if(res.data.code==200){
    //     that.dongtai = res.data.retvalue.list
    //   }else{
    //     Toast(res.data.errdes)
    //   }
    // })
    // .catch(function (error) {
    //   Toast('网络错误')
    //   console.log(error)
    // })
    //留言
    axios.get(`/message/typemassage/${this.appkey}/${this.id}`)
    .then(function (res) {
      if(res.data.code==200){
        that.liuyan = res.data.retvalue
      }else{
        Toast(res.data.errdes)
      }
    })
    .catch(function (error) {
      Toast('网络错误')
      console.log(error)
    })
    //功能
    // axios.get(`/function/selectfunction/${this.id}`)
    // .then(function (res) {
    //   if(res.data.code==200){
    //     that.gongneng = res.data.retvalue
    //   }else{
    //     Toast(res.data.errdes)
    //   }
    // })
    // .catch(function (error) {
    //   Toast('网络错误')
    //   console.log(error)
    // })
  },
  computed:{
    ...mapGetters(['uid', 'appkey'])
  },
  methods:{
    go_liuyan(){
      this.$router.push({path:`/liuyan`, query:{id:`${this.id}`,title:`${this.info.fthProject.name}`}})
    },
    // go_info(item){
    //   this.$router.push({path:`/info_pp`, query:{id:`${item.id}`,uid:`${this.uid}`,pid:`${this.info.id}`,name:`${this.info.name}`,js:`${this.info.introduction}`}})
    // },
    // go_dongtai(item){
    //   this.$router.push({path:`/dongtai`, query:{id:`${item.id}`,uid:`${this.uid}`,pid:`${this.info.id}`,name:`${this.info.name}`,js:`${this.info.introduction}`}})
    // },
    // go_dongtailist(){
    //   this.$router.push({path:`/dongtai-list`, query:{id:`${this.id}`,uid:`${this.uid}`,pid:`${this.info.id}`,name:`${this.info.name}`,js:`${this.info.introduction}`}})
    // },
    go_rule(item){
      this.$router.push({path:`/rule`, query:{tit:item.name,cont:item.distributioncontent}})
    },
    go_intro(item){
      this.$router.push({path:`/intro`, query:{tit:item.name,title:item.title,cont:item.introduction}})
    },
    fenxiang(){
      var id = this.uid
      var pid = this.info.fthProject.id
      var name = this.info.fthProject.name
      var js = this.info.fthProject.introduction
      shareWeixinMessage(pid,name,js,id)
    }
  },
  components:{
    top
  }
}
</script>
<style>
.van-swipe__indicator{
  background-color: RGBA(204, 204, 204, 1);
}
.van-swipe__indicator--active{
  background-color: RGBA(15, 195, 82, 1);
}

</style>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable'
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
.cont
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 99
  display flex
  flex-direction column
  background $color-background-cont
  overflow-y scroll
  -webkit-overflow-scrolling touch
  .pro_one_con
    flex 1
    overflow-y auto
    .pro_img_top
      margin-top 60px
      width 100%
      height 180px
      div
        width 100%
        height 190px
        background $color-background-cont
        background-size cover
        background-repeat no-repeat
        background-position center
    .pro_intro,.pro_rule
      width 100%
      padding 22px 18px
      box-sizing border-box
      .pro_intro_to,.pro_rule_to
        display flex
        justify-content space-between
        margin-bottom 15px
        .text
          font-weight bold
          font-size $font-size-medium-x
        .right
          color $color-text-little
      .gz_img
        width 100%
      .pro_intro_cont
        font-size $font-size-medium
        line-height 20px
        color $color-text-little
        display:-webkit-box !important
        overflow:hidden;
        text-overflow:ellipsis;
        word-break:break-all;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:3
      .pro_intro_list
        margin-top 10px
        font-size 0
        span
          line-height 20px
          display inline-block
          color $color-text-blue
          width 68px
          text-align center
          font-size $font-size-medium
          border solid 1px $color-text-blue
          border-radius 4px
          margin 0 6px 4px 0
    .pro_rule
      .rule_box
        border dashed 1px $color-text-little
        border-radius 6px
        padding 20px 10px
        box-sizing border-box
        color $color-text-little
        line-height 1.5
      .ckyj
        font-size $font-size-medium
        color $color-text
        margin 12px 0
        sup
          font-size $font-size-small-s
      .hyaz
        font-size $font-size-medium
        color $color-text-little
        line-height 1.2
        display:-webkit-box !important
        overflow:hidden;
        text-overflow:ellipsis;
        word-break:break-all;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2
    .ly_box
      background-color $color-background-cont
      padding 22px 18px 30px
      .ly_t
        display flex
        justify-content space-between
        .ly_tit
          font-size $font-size-medium-x
          color $color-text
          font-weight bold
        .green
          color $color-button-green
          font-size $font-size-medium
      .none
        width 160px
        height auto
        margin 50px auto
        display block
      .ly_list
        padding 10px 0
        li
          padding 12px 0
          display flex
          img
            width 38px
            height 38px
            border-radius 50%
            margin-right 8px
          p
            flex 1
            min-width 0
            .ly_name
              font-size $font-size-small
              color $color-text-little
              margin-bottom 10px
              display flex
              justify-content space-between
              i
                font-style normal

            .ly_cont
              font-size $font-size-medium
              color $color-text
              line-height 1.2
              display inline-block
  .btn_bot
    // position fixed
    // bottom 0
    // left 0
    color $color-text-button
    text-align center
    line-height 50px
    height 50px
    width 100%
    background $color-button
    background $color-button-webkit

  .btn_more
    width 100px
    line-height 30px;
    border solid 1px $color-button;
    color $color-button
    text-align center
    margin 0 auto
    border-radius 8px

</style>
