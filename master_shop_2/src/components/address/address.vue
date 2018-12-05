<template>
  <transition name="fade">
    <div class="address">
      <top :title_name="'选择收货地址'" :arrow="true"></top>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="address_box">
          <h1 class="add" @click="add_addr">新增收货地址</h1>
          <ul style="min-height:400px">
            <van-list :loading="loading"
              :finished="finished"
              @load="onLoad"
              :offset="100"
            >
            <li class="addr_item" v-for="(item,index) in lists" :key="item.id" @click="sel_addr(item.id, item.buluo_name)">
              <p class="userinfo" :class="{'other_userinfo':item.buluo_name!=buluo.blname}">
                <span class="name van-ellipsis">{{item.name}}</span>
                <span>{{item.tel}}</span>
              </p>
              <p class="dizhi" :class="{'other_dizhi':item.buluo_name!=buluo.blname}">{{item.area}}{{item.address}}</p>
              <div class="caozuo_box">
                <div class="caozuo_l checked_box" v-if="item.buluo_name==buluo.blname && index==0">
                  <van-icon name="checked" class="checked"/><span>当前地址</span>
                </div>
                <div class="caozuo_l check_box"  v-else-if="item.buluo_name==buluo.blname && index!=0">
                  <van-icon name="check" class="check"/><span>设为当前</span>
                </div>
                <div class="caozuo_l other_box"  v-else-if="item.buluo_name!=buluo.blname">
                  <span>其他邻居圈地址</span>
                </div>
                <div class="caozuo_r">
                  <div class="edit_box" @click.stop="edit(item)">
                    <i class="edit_icon"></i><span>编辑</span>
                  </div>
                  <div class="del_box" @click.stop="del(item.id)">
                    <i class="del_icon"></i><span>删除</span>
                  </div>
                </div>
              </div>
            </li>
            </van-list>
          </ul>
        </div>
      </van-pull-refresh>
      <router-view/>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import top from '@/base/top/top'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { Toast, Dialog } from 'vant'
export default {
  data() {
    return {
      pageSize: 4,
      lists: [],
      loading: false,
      finished: false,
      isLoading: false,
      page: 1
    }
  },
  computed: {
    ...mapGetters(['buluo', 'shop'])
  },
  mounted() {
    // this.get_addrlist(this.page)
  },
  methods: {
    get_addrlist(p) {
      let that = this
      axios.get(`/api/addrs/list?uid=${this.buluo.uid}&shop_id=${this.shop.did}&page=${p}&pageSize=${this.pageSize}`)
      .then((res) => {
        if(res.data.code===200){
          if(res.data.data.list.length < 1){
            that.finished = true
          }else{
            if(p==1){
              that.lists = []
            }
            that.lists.push.apply(that.lists,res.data.data.list)
          }
          that.loading = false
          that.isLoading = false
        }else{
          Toast(res.data.msg)
        }
      })
      .catch((error) => {
        Toast('网络异常')
        console.log(error)
      })
    },
    onLoad(){
      clearTimeout(cc)
      this.loading = true
      var cc = setTimeout(() => {
        this.get_addrlist(this.page)
        this.page ++
      }, 500)
    },
    onRefresh(){
      clearTimeout(cc)
      var cc = setTimeout(() => {
        this.finished = false
        this.page = 1
        this.get_addrlist(this.page)
        this.isLoading = true
        this.loading = false
      }, 500)
    },
    // 选择下单的收货地址
    sel_addr(id, name) {
      if(name !== this.buluo.blname) {
        Toast('请选择本部落管家小店的地址')
        return
      }
      axios.get(`/api/addrs/refresh?id=${id}`)
      .then((res) => {
        if(res.data.code === 200){
          this.$router.back()
        }else{
          Toast(res.data.msg)
        }
      })
      .catch((error) => {
        Toast('网络异常')
        console.log(error)
      })
    },
    // 添加收货地址
    add_addr() {
      this.$router.push({path: '/addaddress'})
    },
    // 编辑地址
    edit(item) {
      this.$router.push({path: `/address/${item.id}`, query: {addr: item}})
    },
    // 删除地址
    del(id) {
      if (id === this.lists[0].id) {
        Toast('当前已选地址不能删除')
        return
      }
      Dialog.confirm({
        message: '确认要删除该地址吗？'
      }).then(() => {
        // on confirm
        axios.get(`/api/addrs/detele?id=${id}`)
        .then((res) => {
          if(res.data.code===200){
            this.page = 1
            this.get_addrlist(this.page)
          }else{
            Toast(res.data.msg)
          }
        })
        .catch((error) => {
          Toast('网络异常')
          console.log(error)
        })
      }).catch(() => {
        // on cancel
      })
    }
  },
  components: {
    top
  },
  watch: {
    $route(val) {
      if (val.path === '/address') {
        this.page = 1
        this.get_addrlist(this.page)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '~@/common/stylus/variable'
  .fade-enter-active,.fade-leave-active
    transition all 0.3s
  .fade-enter,.fade-leave-to
    transform translate3d(100%,0,0)
  .address
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    z-index 9
    background $color-background
    overflow-y auto
    -webkit-overflow-scrolling touch
    .address_box
      margin-top 64px
      color $color-text
      .add
        text-align center
        line-height 70px
        font-weight bold
      .addr_item
        padding 25px 15px
        margin-bottom 10px
        font-size $font-size-medium
        line-height 1.4
        .userinfo
          display flex
          justify-content space-between
          align-items center
          &.other_userinfo
            color $color-btn-2
          .name
            flex 1
            margin-right 20px
        .dizhi
          line-height 22px
          margin 10px 0
          color $color-text-r
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
          &.other_dizhi
            color $color-btn-2
        .caozuo_box
          display flex
          align-items center
          justify-content space-between
          .caozuo_l
            display flex
            line-height 14px
            &.checked_box
              color $color-btn-1
              .checked
                margin-right 10px
                font-size $font-size-medium
            &.check_box
              color $color-btn-2
              .check
                margin-right 10px
                font-size $font-size-medium
            &.other_box
              color $color-btn-2
          .caozuo_r
            display flex
            color $color-btn-2
            .edit_box
              display flex
              margin-right 24px
              align-items center
              .edit_icon
                width 13px
                height 13px
                margin-right 4px
                background url(edit.png) no-repeat center center
                background-size contain
            .del_box
              display flex
              align-items center
              .del_icon
                width 14px
                height 13px
                margin-right 4px
                background url(del.png) no-repeat center center
                background-size contain
</style>
