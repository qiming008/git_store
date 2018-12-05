<template>
  <transition name="slide">
    <div class="tongzhi_cont">
      <top :title_name="'消息'"></top>
      <img src="./none.png" alt="" class="none" v-if="list.length<1">
      <ul class="tongzhi_wrap" v-else>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <li @click="go_info(item)" v-for="item in list">
          <div class="laba blue">
            <svg class="icon naozhong" aria-hidden="true">
              <use xlink:href="#icon-notification"></use>
            </svg>
          </div>
          <div class="gg_r">
            <p class="gg_p1"><span v-html="item.type==2?'公告':'通知'"></span> <span>{{item.addtime}}</span> </p>
            <p class="gg_p2 van-ellipsis">{{item.title}}</p>
          </div>
        </li>
        </van-pull-refresh>
      </ul>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import top from '@/base/top/top'
import axios from 'axios'
import { Toast } from 'vant'
import { mapGetters } from 'vuex'

export default {
  data(){
    return {
      list:[],
      isLoading: false
    }
  },
  computed:{
    ...mapGetters(['uid', 'appkey'])
  },
  mounted(){
    this.get_list()
  },
  methods:{
    get_list() {
      var that = this
      //let param = new URLSearchParams()
      axios.get(`/msg/get_list/${this.appkey}?uid=${this.uid}&type=3`)
      .then(function (res) {
        if(res.data.code==200){
          that.list = res.data.retvalue
          that.isLoading = false
        }else{
          Toast(res.data.errdes);
          that.isLoading = false
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    go_info(item){
      this.$router.push({path:`tongzhi/${item.id}`,query:{title:`${item.title}`,content:`${item.content}`,time:`${item.addtime}`}})
    },
    onRefresh() {
      clearTimeout(cc)
      var that = this
      var cc = setTimeout(() => {
        that.isLoading = true
        that.get_list()
      }, 500)
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
.tongzhi_cont
  position: fixed
  top: 0
  bottom: 0
  width: 100%
  z-index  99
  background-color $color-background-cont
  display flex
  flex-direction column
  overflow hidden
  .none
    width 160px
    height auto
    margin 200px auto
    display block
  .tongzhi_wrap
    flex 1
    padding-top 60px
    box-sizing border-box
    overflow-y scroll
    -webkit-overflow-scrolling touch
    .van-pull-refresh
      min-height 500px
      li
        background-color $color-background-cont
        padding 10px
        display flex
        align-items center
        margin-bottom 6px
        .laba
          width 36px
          height 36px
          border-radius 4px
          display flex
          align-items center
          justify-content center
          margin-right 10px
          &.blue
            background-color $color-text-blue
          &.green
            background-color $color-button
          .icon
            font-size $font-size-large-x
            color $color-text-button
        .gg_r
          flex 1
          .gg_p1
            display flex
            justify-content space-between
            font-size $font-size-medium
            color $color-text-little
            span:last-child
              font-size $font-size-small
          .gg_p2
            font-size $font-size-medium
            line-height 1.2
            margin-top 4px
</style>
