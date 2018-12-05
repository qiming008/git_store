<template>
  <div class="cont_xmxx">
    <top title_name="项目信息"></top>
    <ul class="xmxx_wrap">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <li class="item" v-for="item in list">
          <div class="top van-hairline--bottom">
            <p class="title">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-project"></use>
              </svg>
              项目一</p>
            <span>{{item.status}}</span>
          </div>
          <div class="flex_box name">
            <span>报名项目</span>
            <p>{{item.pname}}</p>
          </div>
          <div class="flex_box" v-if="item.buy!=3">
            <span>置业顾问</span>
            <p>{{item.adviser}}</p>
          </div>
          <div class="flex_box" v-if="item.buy!=3">
            <span>顾问电话</span>
            <p>{{item.tel}}</p>
          </div>
          <div class="flex_box">
            <span>报名时间</span>
            <p>{{item.addtime}}</p>
          </div>
          <div class="cjxx" @click="cjxx(item)" v-show="item.buy==1">成交信息 >></div>
        </li>
      </van-pull-refresh>
    </ul>
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import Top from '@/base/top/top'
import { Toast } from 'vant'
import { mapGetters} from 'vuex'
export default {
  data() {
    return {
      list: [],
      isLoading: false,
      userid: this.$route.query.userid
    }
  },
  mounted() {
    this.get_List()
  },
  methods: {
    onRefresh(){
      clearTimeout(cc)
      var cc = setTimeout(() => {
        this.list = []
        this.isLoading = true
        this.get_List()
      }, 500)
    },
    get_List() {
      let that = this
      axios.get(`/app/relevant/get_project_list?userid=${this.userid}`)
      .then(function (res) {
        that.list = res.data.retvalue
        that.isLoading = false
      })
      .catch(function (error) {
        Toast('网络错误')
        console.log(error)
      })
    },
    cjxx(item) {
      this.$router.push({path: `/client_cjxx`, query: {userid: this.userid, projectid: item.projectid, name: item.pname}})
    }
  },
  components: {
    Top
  }
}
</script>

<style scoped lang="stylus">
@import '~@/common/stylus/variable'
.cont_xmxx
  position: fixed
  top: 0
  bottom: 0
  width: 100%
  z-index  99
  background-color $color-background
  overflow hidden
  .xmxx_wrap
    height 100%
    padding-top 60px
    box-sizing border-box
    overflow-y scroll
    -webkit-overflow-scrolling touch
    .van-pull-refresh
      height 100%
    .item
      margin-bottom 10px
      padding 0 0 10px 20px
      color #6d6d6d
      font-size $font-size-medium
      background-color $color-background-cont
      .top
        display flex
        align-items center
        justify-content space-between
        height 55px
        padding-right 20px
        margin-bottom 10px
        line-height 50px
        color #2f2f2f
        .title
          font-size $font-size-medium-x
          font-weight bold
          .icon 
            margin-right 4px
      .flex_box
        display flex
        padding-right 20px
        line-height 32px
        &.name
          color #2f2f2f
        span
          margin-right 25px
        p
          flex 1
          min-width 0
      .cjxx
        line-height 35px
        color #4771BE
</style>
