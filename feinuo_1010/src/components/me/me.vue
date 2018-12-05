<template>
  <div class="me">
    <div class="me_wrap">
      <div class="bg_box">
        <img src="./bg.png" alt="" class="bg_img">
        <div class="yq_box" @click="yaoqing" v-if="info.user && info.user.usergroup===4">
          <svg class="icon icon_tz" aria-hidden="true">
            <use xlink:href="#icon-userplus-fill"></use>
          </svg>
          <span>邀请团长</span>
        </div>
      </div>
      <div class="user_box">
        <div class="tx" @click="edit_tx" v-if="info.user">
          <!-- <img v-lazy="info.user.img" alt="" class="avatar"> -->
          <div class="avatar" v-lazy:background-image="info.user.img"></div>
        </div>
        <p class="username" v-if="info.user">{{info.user.name}}</p>
        <p class="tel" v-if="info.user">{{info.user.tel}}</p>
        <ul class="num_box">
          <li class="num_item van-hairline--right">
            <p class="tit">成交套数</p>
            <p class="num">{{info.count}}<i>套</i></p>
          </li>
          <li class="num_item">
            <p class="tit">成交面积</p>
            <p class="num">{{info.sum}}<i>m<sup>2</sup></i></p>
          </li>
        </ul>
      </div>
      <ul class="list">
        <li class="me-item" @click="team" v-if="info.user && info.user.usergroup==4">
          <svg class="icon icon_icon" aria-hidden="true">
            <use xlink:href="#icon-users"></use>
          </svg>
          <span class="text van-hairline--bottom">我的团队</span>
          <span class="right van-hairline--bottom">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-right"></use>
            </svg>
          </span>
        </li>
        <li class="me-item" @click="zhanghao">
          <svg class="icon icon_icon" aria-hidden="true">
            <use xlink:href="#icon-user2"></use>
          </svg>
          <span class="text van-hairline--bottom">账号管理</span>
          <span class="right van-hairline--bottom">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-right"></use>
            </svg>
          </span>
        </li>
        <li class="me-item" @click="paihang">
          <svg class="icon icon_icon" aria-hidden="true">
            <use xlink:href="#icon-medal"></use>
          </svg>
          <span class="text van-hairline--bottom">排行榜</span>
          <span class="right van-hairline--bottom">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-right"></use>
            </svg>
          </span>
        </li>
        <li class="me-item" @click="tousu">
          <svg class="icon icon_icon" aria-hidden="true">
            <use xlink:href="#icon-LC_icon_message_fill_1"></use>
          </svg>
          <span class="text van-hairline--bottom">投诉建议</span>
          <span class="right van-hairline--bottom">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-right"></use>
            </svg>
          </span>
        </li>
        <li class="me-item">
          <svg class="icon icon_icon" aria-hidden="true">
            <use xlink:href="#icon-version"></use>
          </svg>
          <span class="text van-hairline--bottom">版本信息</span>
          <span class="right van-hairline--bottom">{{bbh}}</span>
        </li>
        <li class="me-item">
          <svg class="icon icon_icon" aria-hidden="true">
            <use xlink:href="#icon-customerservice"></use>
          </svg>
          <span class="text">联系我们</span>
          <span class="right"><a :href="'tel:400-6600-778'">400-6600-778</a></span>
        </li>
        <div class="btn" @click="out">退出登录</div>
      </ul>
    </div>
    <van-popup v-model="show" class="van_popup"  position="bottom">
      <!-- <img v-lazy="info.user.img" alt="" class="big_tx" v-if="info.user"> -->
      <div v-if="info.user">
        <div class="big_tx" v-lazy:background-image="info.user.img"></div>
      </div>
      <div class="actionsheet">
        <p class="van-hairline--bottom" @click="picture">从头像库中选择</p>
        <p class="van-hairline--bottom" @click="xiangce">从手机相册选择</p>
        <p @click="camera">拍一张</p>
        <p class="cancel" @click="cancel_tx">取消</p>
      </div>
    </van-popup>
    <transition name="slide">
      <router-view class="Router"></router-view>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
import { Toast, Dialog } from 'vant'
import { mapGetters,mapActions } from 'vuex'
import qs from 'qs'
export default {
  data() {
    return {
      transition: 'slide-left',
      info:{},
      show: false, // 编辑头像弹框显示或隐藏
      bbh:banben_number?banben_number:'未获取'
    }
  },
  mounted(){
    let that = this
    //let param = new URLSearchParams()
    axios.get(`/newuser/get_user_m/${this.appkey}?uid=${this.uid}`)
    .then(function (res) {
      if(res.data.code==200){
        that.info = res.data.data
      }else{
        Toast(res.data.errdes)
      }
    })
    .catch(function (error) {
      Toast('网络错误')
      console.log(error)
    })
  },
  computed:{
    ...mapGetters(['uid', 'appkey'])
  },
  methods: {
    yaoqing() {
      this.$router.push({path: '/yaoqing'})
    },
    edit_tx() {
      this.show = true
    },
    cancel_tx() {
      this.show = false
    },
    picture() {
      this.$router.push({path: '/picture',query:{img:this.info.user.img}})
      this.show = false
    },
    xiangce() {
      var that = this
      plus.gallery.pick( function(path){
        plus.io.resolveLocalFileSystemURL(path, function( entry ) {
          // 可通过entry对象操作test.html文件
          entry.file( function(file){
            if (parseInt(file.size)/1024 > 200) {
              that.zip_img(path,1)
            } else {
              that.save_img(path)
            }
          });
        }, function ( e ) {
          console.log( "Resolve file URL failed: " + e.message );
        });
      }, function ( e ) {
        Toast( "取消选择图片" )
      }, {filter:"image"} )
    },
    camera() {
      var that = this
      var cmr = plus.camera.getCamera()
      var res = cmr.supportedImageResolutions[0]
      var fmt = cmr.supportedImageFormats[0]
      cmr.captureImage( function( path ){
          plus.io.resolveLocalFileSystemURL( path, function ( entry ) {
            var localurl = entry.toLocalURL();//将相对路径转为绝对路径,相对路径的图片是无法转换为base64的
            entry.file( function(file){
            if (parseInt(file.size)/1024 > 200) {
              that.zip_img(localurl,2)
            } else {
              that.save_img(localurl)
            }
          });
        });
      },
      function( error ) {
        Toast( "取消拍照" )
      },
      {resolution:res,format:fmt})
    },
    zip_img(path,type) { // 压缩图片
      var that = this
      if (type===1){
        var idx = path.lastIndexOf('/') // 获取地址中“/”最后出现的位置，为了截取图片地址的路径
        var idx1 = path.lastIndexOf('.') // 获取地址中 . 出现的位置，为了截取图片的后缀
        var dst = path.substr(0,idx) + Math.floor(Math.random*10) + path.substr(idx1-1)
      } else {
        var dst = path
      }
      plus.zip.compressImage({
        src:path,
        dst:dst,
        quality:60,
        overwrite:true,
        width:'300px',
        // height:'300px',
      },function(evt) {
        that.save_img(evt.target)
      },function(error) {
        Toast('图片太大，请重新上传')
      });
    },
    save_img(img) {
      var base64
      var that = this
      var image = new Image();
      image.src = img;
      image.onload = function(){
        base64 = getBase64Image(image).split(',')
        var pram = {'data':base64[1]}
        axios.post(`/qiniu/base64/up`,qs.stringify(pram))
        .then(function (res) {
          if(res.data.code==200){
            var qnimg = res.data.data.url
            axios.get(`/newuser/set_user_img/${that.appkey}?uid=${that.uid}&img=${qnimg}`)
            .then(function (res1) {
              if(res1.data.code==200){
                Toast.success('操作成功')
                that.show = false
                that.info.user.img = qnimg
              }else{
                Toast(res1.data.errdes)
              }
            })
            .catch(function (error) {
              Toast('网络错误')
              console.log(error)
            })
          }else{
            Toast(res.data.errdes)
          }
        })
        .catch(function (error) {
          Toast('网络错误')
          console.log(error)
        })
      }
    },
    team() {
      this.$router.push({path: '/team'})
    },
    zhanghao() {
      this.$router.push({path: '/zhanghao',query:{tel:this.info.user.tel}})
    },
    tousu(){
      this.$router.push('/tousu')
    },
    go_cjxq(){
      this.$router.push('/clientCjxq')
    },
    paihang() {
      this.$router.push({path: '/paihang'})
    },
    out(){
      var that = this
      Dialog.confirm({
        title: '',
        message: '确定要退出吗?'
      }).then(() => {
        // on confirm
        that.save_uid('')
        that.save_imei('')
        that.$router.push('/login')
      }).catch(() => {
        // on cancel
      });
    },
    ...mapActions([
      'save_uid',
      'save_imei'
    ])
  },
  watch:{
    $route(to,from){
      if(from.path.indexOf('picture')!=-1||from.path.indexOf('edit_tel')!=-1){
        let that = this
        axios.get(`/newuser/get_user_m/${this.appkey}?uid=${this.uid}`)
        .then(function (res) {
          if(res.data.code==200){
            that.info = res.data.data
          }else{
            Toast(res.data.errdes)
          }
        })
        .catch(function (error) {
          Toast('网络错误')
          console.log(error)
        })
      }
    }
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
  .me
    height 100%
    .me_wrap
      height 100%
      overflow-y scroll
      -webkit-overflow-scrolling touch
    .bg_box
      position relative
      width 100%
      height 150px
      overflow hidden
      .bg_img
        width 100%
        height 100%
      .yq_box
        position absolute
        right 0
        top 55px
        display flex
        align-items center
        width 100px
        height 32px
        font-size 14px
        color #00B940
        border-radius 15px 0 0 15px
        background #fff
        z-index 10
        .icon_tz
          font-size 16px
          margin 0 8px 0 12px
        span 
          line-height 16px
          margin-top 1px
    .user_box
      position relative
      margin-bottom 10px
      padding-bottom 25px
      padding-top 55px
      text-align center
      box-sizing border-box
      background $color-background-cont
      .tx
        position absolute
        top -45px
        left 50%
        margin-left -45px
        width 90px
        height 90px
        border 5px solid rgba(255,255,255,0.3)
        box-sizing border-box
        border-radius 50%
        .avatar
          width 80px
          height 80px
          border-radius 50%
          background-position center center
          background-repeat no-repeat
          background-size cover
      .username
        font-size $font-size-medium-x
        color #2f2f2f
        font-weight bold
      .tel
        line-height 30px
        margin-bottom 10px
        font-size $font-size-medium-x
        color #6d6d6d
      .num_box
        display flex
        .num_item
          flex 1
          font-size $font-size-medium
          color #6d6d6d
          .tit
            margin-bottom 10px
          .num
            font-size 30px
            color #2f2f2f
            font-weight bold
            i
              margin-left 8px
              font-style normal
              font-size $font-size-medium
              color $color-text-little
              sup
                font-size $font-size-small-s
    .list
      padding-bottom 50px
      .me-item
        display flex
        align-items center
        height 60px
        line-height 60px
        padding-left 20px
        background #fff
        color #6d6d6d
        font-size $font-size-medium-x
        .icon_icon
          font-size 20px
          margin-right 12px
        .text
          flex 1
        .right
          padding-right 15px
          color $color-text-little
          .icon
            color $color-text-little
    .btn
      width 100%
      height 60px
      line-height 60px
      text-align center
      color #6d6d6d
      margin 10px 0
      background-color #fff
      font-size $font-size-medium-x
    .van_popup
      bottom 20px
      background transparent
      .big_tx
        width 225px
        height 225px
        display block
        margin 0 auto 35px
        border-radius 5px
        background-position center center
        background-repeat no-repeat
        background-size cover
      .actionsheet
        padding 0 15px
        p
          line-height 50px
          text-align center
          color #333
          font-size $font-size-medium-x
          background $color-background-cont
          &:first-child
            border-radius 5px 5px 0 0
          &:nth-child(3)
            border-radius 0 0 5px 5px
          &.cancel
            margin-top 10px
            border-radius 5px
</style>
