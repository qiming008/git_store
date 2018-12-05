<template>
<transition name="slide">
  <div class="cont">
    <top title_name="成交信息"></top>
    <ul class="cjxx_wrap">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="cjxx_name van-hairline--bottom">
          <span>报名项目</span><p>{{name}}</p>
        </div>
        <li class="item" v-for="item in list" :key="item.id">
          <div class="flex_box">
            <span>成交面积</span>
            <p>{{item.purchase_m}}㎡</p>
          </div>
          <div class="flex_box">
            <span>房屋信息</span>
            <p>{{item.room_number}}</p>
          </div>
        </li>
      </van-pull-refresh>
    </ul>
  </div>
</transition>
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
      userid: this.$route.query.userid, // 客户id
      projectid: this.$route.query.projectid, // 项目id
      name: this.$route.query.name // 项目名称
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
      axios.get(`/purchase/tjselectpurchase?userid=${this.userid}&projectid=${this.projectid}`)
      .then(function (res) {
        that.list = res.data.retvalue
        that.isLoading = false
      })
      .catch(function (error) {
        Toast('网络错误')
        console.log(error)
      })
    }
  },
  components: {
    Top
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
  position: fixed
  top: 0
  bottom: 0
  width: 100%
  z-index  99
  overflow hidden
  background-color $color-background
  .cjxx_wrap
    height 100%
    padding-top 60px
    box-sizing border-box
    font-size $font-size-medium
    overflow-y scroll
    -webkit-overflow-scrolling touch
    .van-pull-refresh
      height 100%
      .cjxx_name
        display flex
        line-height 30px
        padding 15px 20px
        color #2f2f2f
        background-color $color-background-cont
        span
          margin-right 25px
        p
          flex 1
          min-width 0
      .item
        padding 20px 20px 0 20px
        color #6d6d6d
        background-color $color-background-cont
        .flex_box
          display flex
          line-height 32px
          span
            margin-right 25px
          p
            flex 1
            min-width 0
</style>
