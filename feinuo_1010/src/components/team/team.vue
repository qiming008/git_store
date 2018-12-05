<template>
  <div class="team_box">
    <div class="search_box">
      <svg class="icon back" aria-hidden="true" @click='goBack'>
        <use xlink:href="#icon-back"></use>
      </svg>
      <form action="/" class="search"  @click="goSearch">
        <van-search
          v-model="value"
          placeholder="请输入团长姓名"
          background="#f8f8f8"
          disabled
        >
        </van-search>
      </form>
    </div>
    <div class="team_ewm_img" :style="'background-image:url('+img+')'" @click="yaoqing"></div>
    <van-tabs swipeable class="list_box">
      <van-tab>
        <div slot="title">全部</div>
        <teamList :num="0" :text="value.replace(/\s*/g,'')" ref="teamList1"></teamList>
      </van-tab>
      <van-tab>
        <div slot="title">待我审核</div>
        <teamList :num="1" :text="value.replace(/\s*/g,'')" ref="teamList2"></teamList>
      </van-tab>
      <van-tab>
        <div slot="title">待公司审核</div>
        <teamList :num="2" :text="value.replace(/\s*/g,'')" ref="teamList3"></teamList>
      </van-tab>
      <van-tab>
        <div slot="title">审核通过</div>
        <teamList :num="4" :text="value.replace(/\s*/g,'')" ref="teamList4"></teamList>
      </van-tab>
    </van-tabs>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Top from '@/base/top/top'
import teamList from '@/components/team_list/team_list'
import { Toast } from 'vant'
export default {
  data() {
    return {
      len: 5,
      nr: '',
      value: '',
      img: require('@/components/team/ewm.png')
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    goSearch() {
      this.$router.push({path:'/item_search'})
    },
    yaoqing() {
      this.$router.push({path: '/yaoqing'})
    }
  },
  components: {
    Top,
    teamList
  }
}
</script>

<style lang="stylus">
@import '~@/common/stylus/variable'
  .team_box
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    display flex
    flex-direction column
    background-color $color-background-cont
    z-index 10
    .search_box
      display flex
      align-items center
      height 64px
      padding-top 20px
      font-size $font-size-medium
      background #f8f8f8
      box-sizing border-box
      .icon
        color $color-text-little
        padding:10px
      .search
        flex 1
        .van-search
          padding:7px 15px 7px 0
        .van-search
          height 100%
    .team_ewm_img
      width 100%
      height 0
      padding-top 30%
      background-repeat no-repeat
      background-position center
      background-size cover
    .list_box
      flex 1
      display flex
      flex-direction column
      .van-tabs__content
        flex 1
        overflow-y scroll
        -webkit-overflow-scrolling touch
</style>
