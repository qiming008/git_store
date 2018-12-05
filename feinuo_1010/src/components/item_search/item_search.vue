<template>
  <div class="client_search">
    <div class="client_top">
      <transition name="slide_1">
        <top title_name="团长" v-if="!is_search"></top>
      </transition>
      <div class="c_search_box" :class="is_search?'':'no_padding'">
        <form action="/" class="search" id="search">
          <van-search placeholder="请输入团长姓名" ref="searchInput" show-action="true" v-model="value" autofocus @focus="op_search" @search="onSearch" background="#f8f8f8">
            <div slot="action" @click.stop="onCancel" v-if="is_search">取消</div>
          </van-search>
        </form>
      </div>
    </div>
    <ul class="client_search_list">
      <van-list
        v-model="loading"
        :finished="finished"
        @load="onLoad"
        v-if="list.length>0"
      >
      <li class="item van-hairline--bottom" v-for="item in list" :key="item.id">
        <div class="avatar">
          <img :src="item.userimg" alt="" width="50" height="50">
        </div>
        <div class="description van-ellipsis">
          <div class="desc_user">
            <span class="lt_txt">姓名</span>
            <span class="username van-ellipsis">{{item.username}}</span>
            <span class="jujue" @click="jujue(item)" v-if="item.status==2">拒绝</span>
            <span class="tongguo" @click="tongguo(item)" v-if="item.status==2">通过</span>
            <span class="status" v-if="item.status==3">待公司审核</span>
            <span class="status" v-else-if="item.status==1">已拒绝</span>
            <span class="status" v-else-if="item.status==0">已通过</span>
          </div>
          <div><span class="lt_txt">电话</span><span>{{item.usertel}}</span></div>
          <div v-if="item.caddress"><span class="lt_txt">地区</span><span>{{item.caddress}}</span></div>
          <div v-if="item.client>0"><span class="lt_txt">客户</span><span>{{item.client}}人</span></div>
          <div v-if="item.cbuy>0"><span class="lt_txt">成交</span><span>{{item.cbuy}}套</span></div>
        </div>
      </li>
      </van-list>
      <img src="./none.png" alt="" class="none" v-if="list.length<1 && val!='' && search_kg">
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import Top from "@/base/top/top"
import { Toast, Dialog } from 'vant'
import { mapGetters} from 'vuex'
import qs from 'qs'
import storage from 'good-storage'
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      page:1,
      kg:1,
      value: '',
      val: '',
      search_kg: false,
      is_search: false
    }
  },
  computed:{
    ...mapGetters(['appkey','uid'])
  },
  mounted() {
    
  },
  methods: {
    onLoad(){
      this.loading = true
      clearTimeout(bb)
      var bb = setTimeout(() => {
        this.page ++
        this.get_List(this.page)
      }, 500)
    },
    get_List(p){
      let that = this
      if (this.val!='' && this.val.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g)) {
        Toast('请不要输入特殊表情')
        return
      }
      let pram = {name:this.val}
      axios.post(`/app/relevant/get_team_list_1_1_0/${this.appkey}?uid=${this.uid}&status=0&page=${p}&pagesize=10`,qs.stringify(pram))
      .then(function (res) {
        if(res.data.list.length < 1){
          that.finished = true
        }else{
          that.list.push.apply(that.list,res.data.list)
        }
        that.loading = false
        that.isLoading = false
        
      })
      .catch(function (error) {
        Toast('网络错误')
        console.log(error)
        that.loading = false
        that.isLoading = false
      })
    },
    onSearch() {
      this.val = this.value.replace(/\s*/g,'')
      if (this.val=='') return
      this.search_kg = true
      if (this.val.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g)) {
        Toast('请不要输入特殊表情')
        return
      }
      this.finished = false
      this.page = 1
      this.list = []
      this.isLoading = true
      this.get_List(this.page)
    },
    op_search() {
      this.is_search = true
    },
    onCancel() {
      this.is_search = false
    },
    sel_one(id) {
      this.$router.push({path: `/home/client/${id}`, query: {userid: id}})
    },
    jujue(item) {
      if(this.kg==1){
        this.kg = 0
        let that = this
        var that = this
        Dialog.confirm({
          title: '',
          message: '确定拒绝该客户的申请?'
        }).then(() => {
          // on confirm
          axios.get(`/projectbpm/ref_bpm/${this.appkey}/${item.lcid}/${item.dbid}?uid=${this.uid}&opin=''`)
          .then(function (res) {
            if(res.data.code==200){
              Toast.success(res.data.errdes)
              that.onRefresh()
              that.kg=1
            }else {
              Toast(res.data.errdes)
              that.kg=1
            }
          })
          .catch(function (error) {
            Toast('网络错误')
            console.log(error)
            that.kg=1
          })
        }).catch(() => {
          // on cancel
          that.kg = 1
        });
      }
    },
    tongguo(item) {
      if(this.kg==1){
        this.kg = 0
        let that = this
        axios.get(`/projectbpm/complete/${this.appkey}/${item.lcid}/${item.dbid}?uid=${this.uid}&opin=''`)
        .then(function (res) {
          if(res.data.code==200){
            that.$router.push({path: `/shenhetongguo`, query: {id: item.dbid}})
            that.onRefresh()
            that.kg=1
          }else {
            Toast(res.data.errdes)
            that.kg=1
          }
        })
        .catch(function (error) {
          Toast('网络错误')
          console.log(error)
          that.kg=1
        })
      }
    }
  },
  components: {
    Top
  }
}
</script>
<style>
  input::-webkit-input-placeholder{
    color:#9e9e9e
  }
  .van-search__action{
    padding:0 20px;
  }
  
</style>

<style scoped lang="stylus">
@import '~@/common/stylus/variable'
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}
.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
.slide_1-enter-active, .slide_1-leave-active {
  transition: all 0.3s;
}
.slide_1-enter, .slide_1-leave-to {
  transform: translate3d(0, -100%, 0);
}

  .none
    width 95px
    height auto
    margin 0 auto
    padding 90px 0
    display block
  .client_search
    background-color #f8f8f8
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    display flex
    flex-direction column
    z-index 999
    .client_top
      &.slide_1-fade-enter-active
        animation: slide_1-up 0.2s
    .c_search_box
      width 100%
      padding-top 20px
      font-size $font-size-medium
      transition all 0.2s
      &.no_padding
        padding-top 60px
    .client_search_list
      flex 1
      min-height 300px
      padding-bottom 20px
      box-sizing border-box
      background $color-background-cont
      overflow-y scroll
      -webkit-overflow-scrolling touch
      .item
        display flex
        padding 20px 20px 20px 0
        margin-left 20px
        background $color-background-cont
        font-size $font-size-medium
        color #6d6d6d
        .avatar
          width 50px
          height 50px
          font-size 0
          border-radius 50%
          img
            border-radius 50%
        .description
          flex 1
          margin-left 15px
          line-height 26px
          .lt_txt
            margin-right 10px
          .desc_user
            display flex
            align-items center
            color #2f2f2f
            .username
              flex 1
              margin-right 10px
            .jujue,.tongguo
              width 60px
              height 24px
              line-height 22px
              text-align center
              font-size $font-size-medium
              border-radius 24px
              box-sizing border-box
            .jujue
              margin-right 8px
              color $color-text-little
              border 1px solid $color-text-little
            .tongguo
              color $color-button-green
              border 1px solid $color-button-green
            .status
              color $color-text-little
  @keyframes slide_1-up
    0%
      transform : translateY(0)
    100%
      transform : translateY(-100%)
</style>
