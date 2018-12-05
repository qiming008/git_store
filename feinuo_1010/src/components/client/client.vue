<template>
  <div class="team-box">
    <top title_name="报名客户" :arrow="false"></top>
    <div class="search_box" @click="goSearch">
      <van-search placeholder="请输入客户姓名" background="#f8f8f8" disabled/>
    </div>
    <van-tabs swipeable class="team">
      <van-tab>
        <div slot="title">全部</div>
        <clientList :num="0"></clientList>
      </van-tab>
      <van-tab>
        <div slot="title">待我审核</div>
        <clientList :num="1"></clientList>
      </van-tab>
      <van-tab>
        <div slot="title">待公司审核</div>
        <clientList :num="2"></clientList>
      </van-tab>
      <van-tab>
        <div slot="title">审核通过</div>
        <clientList :num="4"></clientList>
      </van-tab>
    </van-tabs>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import Top from '@/base/top/top'
import clientList from '@/components/client_list/client_list'
import storage from 'good-storage'
export default {
  data() {
    return {}
  },
  methods: {
    goSearch() {
      this.$router.push({path:'/client_search'})
    }
  },
  components: {
    Top,
    clientList
  },
  watch: {
    $route(to,from) {
      if (from.path === '/home/client' && to.path === '/client_search') {
        storage.set('search_txt', '')
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/common/stylus/variable'
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}
.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
  .team-box
    // display flex
    // flex-direction column
    background-color $color-background-cont
    // height 100%
    position fixed
    top 0
    bottom 50px
    left 0
    right 0
    z-index 2
    // overflow-y scroll
    .search_box
      width 100%
      height 64px
      padding-top 60px
      font-size $font-size-medium
      box-sizing border-box
      z-index 99
    .team
      position fixed
      top 104px
      bottom 50px
      left 0
      right 0
      overflow hidden
      // flex 1
      // padding-bottom 50px
      // box-sizing border-box

      // .van-tabs__wrap
        // position fixed
        // top 64px
        // left 0
        // right 0
      .van-tabs__content
      // flex 1
        height 100%
        overflow-y scroll
        -webkit-overflow-scrolling touch
</style>
