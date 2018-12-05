<template>
<transition name="slide">
  <div class="yaoqing-box">
    <top title_name="邀请团长"></top>
    <div class="content">
      <div class="top_img" id="longtap">
        <img v-lazy="imgs[currentIndex]" alt="" class="img">
        <!-- <div class="img" v-lazy:background-image="imgs[currentIndex]"></div> -->
      </div>
      <div class="btm">
        
        <div class="img-wrapper">
          <div class="img_window">
            <div class="img-box" @click="sel_img(index)" v-for="(item,index) in imgs">
              <!-- <img :src="item" alt=""> -->
              <div class="img" v-lazy:background-image="item"></div>
              <svg class="icon" aria-hidden="true" v-show="currentIndex===index">
                <use xlink:href="#icon-btn_selectd"></use>
              </svg>
            </div>
          </div>
        </div>
        <div class="btn_box">
          <div @click="load_img">下载</div>
          <!-- <div @click="share">分享</div> -->
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
import Top from "@/base/top/top";
import axios from "axios";
import { Toast } from "vant";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      currentIndex: 0,
      imgs: [],
      pid: this.$route.query.pid
    };
  },
  computed: {
    ...mapGetters(["uid", "appkey"])
  },
  mounted() {
    var that = this;
    axios
      .get(`/extensionimg/get_list_img/${this.appkey}?uid=${this.uid}`)
      .then(function(res) {
        if (res.data.code == 200) {
          that.imgs = res.data.retvalue;
        } else {
          Toast(res.data.errdes);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    sel_img(idx) {
      this.currentIndex = idx;
    },
    load_img(){
      plus.gallery.save(this.imgs[this.currentIndex], function () {
        Toast.success( "保存图片成功" )
      })
    },
    share(){
      sharewx.send({
        type:'image',
        pictures:[`${this.imgs[this.currentIndex]}`],
        extra: {
          scene: "WXSceneSession"
        }
      }, function () {
        Toast.success("分享成功！");
      }, function (e) {
        Toast("分享失败");
      });
    }
  },
  components: {
    Top
  }
};
</script>

<style scoped lang="stylus">
@import '~@/common/stylus/variable';

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
.btn_box{
  width 100%
  display flex
  align-items center
  justify-content center
}
.btn_box div{
  width 99%
  background $color-button
  background $color-button-webkit
  text-align center
  color $color-text-button
  line-height 40px
  border-radius 50px
}
.yaoqing-box {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: $color-background;
  overflow-y: scroll;
  z-index: 10;
  display flex
  flex-direction column
  .content {
    margin-top: 60px;
    background: #fff;
    width: 100%;
    flex 1
    display flex
    flex-direction column
    .top_img {
      border-radius: 5px;
      flex 1
      min-height 0
      box-sizing border-box
      overflow-y auto
      -webkit-overflow-scrolling touch
      text-align center
      margin 10px 20px
      .img {
        max-width 100%
        // width: 100%;
        // height: 100%;
        // background-size contain
        // background-position center
        // background-repeat no-repeat
      }
    }

    .btm {
      width: 100%;
      background: $color-background-cont;
      border-radius: 5px 5px 0 0;
      padding: 10px 20px;
      box-sizing: border-box;
      height 172px
      .btm-top {
        display: flex;
        align-items: flex-start;
        color: #2f2f2f;
        font-size: $font-size-small;
        line-height: 22px;

        .icon {
          display: inline-block;
          width: 15px;
          height: 15px;
          color: $color-button;
          // background $color-button
          margin: 3px 5px 0 0;
          border-radius: 15px;
        }
      }

      .img-wrapper {
        width: 100%;
        // margin-top: 10px;
        overflow-x scroll
        .img_window {
          // width 160%
          display: flex;
          display: -webkit-box
          align-items: flex-start;
          justify-content: space-between;
          height 110px
          .img-box {
            // flex: 1;
            border-radius: 5px;
            margin-right: 10px;
            position: relative;
            width 80px;
            height 94px
            .img {
              width: 100%;
              height: 100%;
              background-size cover
              background-position center
              background-repeat no-repeat
              border-radius: 5px;
            }

            .icon {
              position: absolute;
              right: 1px;
              top: 1px;
              display: inline-block;
              width: 18px;
              height: 18px;
              color: #0FC352;
            }
          }
        }
      }
    }
  }
}
</style>
