<template>
  <div class="shenhe-list">

    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <ul>
      <van-list
        v-model="loading"
        :finished="finished"
        @load="onLoad"
        v-if="list.length>0"
      >
      <li class="item van-hairline--bottom" v-for="(item,index) in list">
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
    </ul>
    <img src="./none.png" alt="" class="none" v-if="list.length<1">
    </van-pull-refresh>
  </div>
</template>

<script type="text/ecmascript-6">
import axios from 'axios'
import qs from 'qs'
import { Toast } from 'vant'
import { mapGetters} from 'vuex'

export default {
  props: {
    num: {
      type: Number,
      default: -1
    },
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      page:1,
      kg:1
    }
  },
  computed:{
    ...mapGetters(['appkey','uid'])
  },
  mounted() {
    this.get_List(this.page)
  },
  methods: {
    onLoad(){
      this.loading = true
      setTimeout(() => {
        this.page ++
        this.get_List(this.page)
      }, 500)
    },
    onRefresh(){
      clearTimeout(cc)
      var cc = setTimeout(() => {
        this.finished = false
        this.page = 1
        this.list = []
        this.isLoading = true
        this.get_List(this.page)
      }, 500)
    },
    get_List(p){
      let that = this
      if (this.text!='' && this.text.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g)) {
        Toast('请不要输入特殊表情')
        return
      }
      let pram = {name:this.text}
      axios.post(`/app/relevant/get_team_list_1_1_0/${this.appkey}?uid=${this.uid}&status=${this.num}&page=${p}&pagesize=10`,qs.stringify(pram))
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
    jujue(item) {
      if(this.kg==1){
        this.kg = 0
        let that = this
        //let param = new URLSearchParams()
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
      }
    },
    tongguo(item) {
      if(this.kg==1){
        this.kg = 0
        let that = this
        //let param = new URLSearchParams()
        axios.get(`/projectbpm/complete/${this.appkey}/${item.lcid}/${item.dbid}?uid=${this.uid}&opin=''`)
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
      }
    }
  },
  components: {

  },
  watch:{
    $route(){
      if(this.$route.path.indexOf('team')!=-1 && this.$route.path.length == 5){
        this.onRefresh()
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@/common/stylus/variable'
  .none
    width 160px
    height auto
    margin 0 auto
    padding 100px 0
    display block
  .shenhe-list
    min-height 500px
    padding-bottom 20px
    background $color-background-cont
    .van-pull-refresh
      min-height 300px
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
            color #bababa
            border 1px solid #bababa
          .tongguo
            color $color-button-green
            border 1px solid $color-button-green
          .status
            color $color-text-little
</style>
