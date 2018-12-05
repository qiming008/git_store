<template>
  <div class="cont">
    <top title_name="客户详情"></top>
    <div class="detail" v-if="detail">
      <div class="box">
        <div class="flex_box">
          <span>姓名</span>
          <span class="info van-ellipsis">{{detail.name}}</span>
          <span>资料完整度</span>
        </div>
        <div class="flex_box">
          <span>电话</span>
          <span class="info">{{detail.tel}}</span>
          <i class="percent">{{detail.complete}}</i>
        </div>
        <div class="btn" @click="analyze">客户分析</div>
      </div>
      <div class="box" @click="xmxx">
        <div class="flex_box">
          <h1 class="tit">项目信息</h1>
          <div class="more">更多
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-right"></use>
            </svg>
          </div>
        </div>
        <div class="pro_name van-ellipsis">报名项目 : {{detail.project.name}}</div>
        <div class="pro_name">报名时间 : {{detail.project.addtime}}</div>
        <div class="pro_name">报名状态 : {{detail.project.status}}</div>
      </div>
      <div class="box" v-for="(item, index) in detail.lable">
        <div class="flex_box">
          <h1 class="tit">{{item.class}}</h1>
          <div class="more" @click="edit(item.classid)">编辑
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-right"></use>
            </svg>
          </div>
        </div>
        <div class="tag_box">
          <span class="tag_card" v-for="item1 in item.label">{{item1.label}}</span>
        </div>
      </div>
      <div class="box" v-if="detail.identity!=''">
        <div class="flex_box">
          <h1 class="tit">身份信息</h1>
          <div class="more" @click="edit(0)">编辑
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-right"></use>
            </svg>
          </div>
        </div>
        <div class="beizhu">{{detail.identity}}</div>
      </div>
      <div class="box" v-if="detail.note!=''">
        <div class="flex_box">
          <h1 class="tit">备注</h1>
          <div class="more" @click="edit(-1)">编辑
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-right"></use>
            </svg>
          </div>
        </div>
        <div class="beizhu">{{detail.note}}</div>
      </div>
      <p class="wsxx" @click="edit(0)" v-show="parseInt(detail.complete)<100">+完善信息</p>
    </div>
    <transition name="slide">
      <router-view/>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import Top from '@/base/top/top'
export default {
  data() {
    return {
      userid: this.$route.query.userid,
      detail: ''
    }
  },
  mounted() {
    this.get_detail()
  },
  methods: {
    get_detail() {
      var that = this
      axios.get(`/app/relevant/get_app_user_info_1_1_0/1?userid=${this.userid}`)
      .then(function(res) {
        if (res.data.code == 200) {
          that.detail = res.data.retvalue
        } else {
          Toast(res.data.errdes);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    analyze() { // 客户分析
      this.$router.push({path: `/client_analyze`, query: {userid: this.userid}})
    },
    xmxx() { // 查看项目信息
      this.$router.push({path: `/client_xmxx`, query: {userid: this.userid}})
    },
    edit(classid) { //编辑客户资料
      this.$router.push({path: `/client_edit`, query: {userid: this.userid, classid: classid, sel: this.detail.select, sfz: this.detail.identity,note: this.detail.note}})
    }
  },
  components: {
    Top
  },
  watch: {
    $route(to) {
      if (to.path.indexOf(`/home/client/${this.userid}`) != -1) {
        this.get_detail()
      }
    }
  }
}
</script>

<style scoped lang="stylus">
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
    left 0
    bottom 0
    right 0
    z-index 99
    overflow hidden
    background-color $color-background-cont
    .detail
      height 100%
      padding 80px 20px 20px
      box-sizing border-box
      overflow-y auto
      -webkit-overflow-scrolling touch
      .box
        width 100%
        padding 15px
        margin-bottom 15px
        box-sizing border-box
        box-shadow:0px 0px 10px 4px rgba(0,0,0,0.05)
        color #2f2f2f
        border-radius 5px
        .flex_box
          display flex
          align-items center
          justify-content space-between
          font-size $font-size-medium-x
          line-height 35px
          margin-bottom 4px
          &.gray_txt
            color #6d6d6d
            font-size $font-size-medium
          .info
            flex 1
            min-width 0
            margin-left 15px
          .percent
            font-size 30px
          .tit
            line-height 35px
            color #2f2f2f
            font-weight bold
          .more
            color #6d6d6d
            font-size $font-size-medium
        .btn
          width 100%
          height 44px
          line-height 44px
          text-align center
          color #fff
          background $color-button
          background $color-button-webkit
          margin 20px auto 10px
          border-radius 44px
          box-shadow 0 0 10px 5px #d9f6e4
        .pro_name
          line-height 30px
          color #6d6d6d
          font-size $font-size-medium
        .tag_box
          display flex
          align-items center
          flex-wrap nowrap
          overflow-x auto
          padding 10px 0 10px 0
          .tag_card
            flex-shrink 0
            width 80px
            height 55px
            line-height 55px
            text-align center
            margin-right 10px
            background #F8F8F8
            border 1px solid #ECECEC
            border-radius 5px
            color #6d6d6d
            font-size $font-size-medium
            box-sizing border-box
        .beizhu
          padding 15px 0 10px 0
          line-height 22px
          color #6d6d6d
          font-size $font-size-medium
      .wsxx
        line-height 45px
        text-align center
        color #2f2f2f
        font-size $font-size-medium-x
        font-weight bold
</style>
