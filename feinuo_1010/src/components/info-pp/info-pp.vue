<template>
  <transition name="slide">
    <div class="cont">
      <top :title_name="info.name"></top>

      <div class="nr" v-html="info.content" v-if="info.type==1" ref="conts"></div>

      <ul class="sp_box" v-if="info.type==2">
        <li v-for="(item,index) in videos">
          <div class="pro_top" ref='win'>
            <video :src="item.route" controls="controls" width='100%' height="280" preload="none" ref="video" :poster="item.route+'?vframe/jpg/offset/1/w/'+_width+'/h/280'">
              您的浏览器不支持播放该视频！
            </video>
          </div>
          <div class="pro_bot">
            <p class="pro_tit">{{item.content}}</p>
          </div>
        </li>
      </ul>
      <div class="btn_bot" @click="fenxiang()">
        分享赚佣金
      </div>
    </div>
  </transition>
</template>


<script>
import top from "@/base/top/top"
import axios from 'axios'
import { Toast } from 'vant'
import {shareWeixinMessage} from '@/common/js/share'
export default {
  data() {
    return {
      info:{},
      videos:[],
      pid:this.$route.query.pid,
      uid:this.$route.query.uid,
      name:this.$route.query.name,
      js:this.$route.query.js,
      _width:''
    }
  },
  mounted(){
    this._width = document.body.clientWidth -24
    var that = this
    axios.get(`/function/functiondetile/${this.$route.query.id}`)
    .then(function (res) {
      if(res.data.code==200){
        that.info = res.data.retvalue.function
        that.videos = res.data.retvalue.detiles
        if(that.info.type==1){
          setTimeout(() => {
            var imgs = that.$refs.conts.getElementsByTagName('img')
            for(var i=0;i<imgs.length;i++){
              imgs[i].style.width = '100%'
            }
          }, 100);
        }else{
          setTimeout(() => {
            that.only_play()
          }, 100);
        }
      }else{
        Toast(res.data.errdes);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  methods:{
    only_play(){
      var that = this;
      var vid = this.$refs.video
      vid.map(function(cur,i){
        cur.onplay = function(){
          // if(!cur.active){
          //   Vue.set(that.videos[i],'active',true)
          // }
          for(var j=0;j<vid.length;j++){
            if(i==j){
              continue
            }else{
              vid[j].pause()
              that.videos[j].active=false
            }
          }
        }
      })
    },
    fenxiang(){
      var id = this.uid
      var pid = this.pid
      var name = this.name
      var js = this.js
      shareWeixinMessage(pid,name,js,id)
    }
  },
  components:{
    top
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable'
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
.cont 
  position: fixed
  top: 0
  bottom: 0
  width: 100%
  z-index  99
  background-color $color-background
  .nr 
    padding 16px  12px
    margin-top 60px
    margin-bottom 60px
    box-sizing border-box
    overflow hidden
    img 
      width 100%
      display block
    video 
      width 100%
  .btn_bot 
    height 50px 
    width 100%
    background-color $color-button
    position fixed
    bottom 0
    left 0
    color $color-text-button 
    text-align center
    line-height 50px
  ul 
    padding 70px 12px
    li 
      width 100%
      margin-bottom 15px 
      border-radius 6px
      background $color-background-cont
      box-shadow 3px 3px 5px $color-background
      overflow hidden
      .pro_top
        height 280px
        position relative
        box-sizing border-box
        background-color #000
        video 
          width 100%
          // &.cur 
          //   position: fixed;
          //   right: 0px;
          //   bottom: 0px;
          //   min-width: 100%;
          //   min-height: 100%;
          //   height: auto;
          //   width: auto;
      .pro_bot 
        padding 14px 10px
        .pro_tit 
          font-size $font-size-medium-x
</style>

    