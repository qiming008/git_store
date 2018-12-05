<template>
  <div class="client_list">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <ul class="clien_list_wrap">
      <van-list
        v-model="loading"
        :finished="finished"
        @load="onLoad"
        offset = "100"
        v-if="list.length>0"
      >
      <li class="item van-hairline--bottom" v-for="item in list" @click="sel_one(item.userid)" :key="item.userid">
        <div class="description">
          <div class="desc_user">
            <span class="lt_txt">姓名</span>
            <span>{{item.username}}</span>
          </div>
          <div class="xm">
            <span class="lt_txt">项目</span>
            <span class="name van-ellipsis">{{item.project}}</span>
            <span class="jujue" @click.stop="jujue(item)" v-if="item.status==2">拒绝</span>
            <span class="tongguo" @click.stop="tongguo(item)" v-if="item.status==2">通过</span>
            <span class="status" v-if="item.status==3">待公司审核</span>
            <span class="status" v-else-if="item.status==1">已拒绝</span>
            <span class="status" v-else-if="item.status==0">已通过</span>
          </div>
        </div>
      </li>
      </van-list>
    </ul>
    <img src="./none.png" alt="" class="none" v-if="list.length<1">
    </van-pull-refresh>
  </div>
</template>

<script type="text/ecmascript-6">
import { Toast, Dialog } from 'vant'
import { mapGetters} from 'vuex'
import qs from 'qs'
export default {
  props: {
    num: {
      type: Number,
      default: -1
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
      clearTimeout(bb)
      var bb = setTimeout(() => {
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
      let par = {uid: this.uid, status: this.num, page: p, pagesize: 10, name: ''}
      axios.post(`/app/relevant/get_kehu_list_1_1_0/${this.appkey}`, qs.stringify(par))
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
            that.$router.push({path: `/shenhetongguo`, query: {id: item.userid}})
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
  }
}
</script>

<style scoped lang="stylus">
@import '~@/common/stylus/variable'
  .none
    width 160px
    height auto
    margin 0 auto
    padding 150px 0
    display block
  .client_list
    min-height 300px
    padding-bottom 20px
    background $color-background-cont
    .van-pull-refresh
      min-height 400px
    .item
      padding 20px 20px 20px 0
      margin-left 20px
      background $color-background-cont
      font-size $font-size-medium
      color #6d6d6d
      .description
        line-height 26px
        .lt_txt
          margin-right 10px
        .desc_user
          color #2f2f2f
        .xm
          display flex
          align-items center
          .name
            flex 1
            margin-right 10px
          .jujue,.tongguo
            width 60px
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
