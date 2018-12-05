<template>
  <div class="cont">
    <mastertalk v-if="gj.status!=3" :talktoyou="tty" @close="close_fun" :talkcontent="gj.content"></mastertalk>
    <top :title_name="'管家小店'" :wenhao="true" :chat="gj.status!=3?true:false"></top>
    <div class="index_cont">
      <div class="master_card" v-if="gj.status!=3" @click="open_fun">
        <img v-lazy="gj.image" alt="" class="master_img">
        <p class="master_info van-ellipsis">
           {{gj.name}} <br>
           <span>{{gj.sign}}</span>
        </p>
        <p class="master_tag">
          <img src="./tag.png" alt="">
          <span>管家</span>
        </p>
      </div>
      <div class="gjjx"  v-if="gj.status==0">
        <i class="bef"></i>
        <p>管家精选</p>
        <i class="aft"></i>
      </div>
      <ul class="goods_list" v-if="gj.status==0">
        <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoad"
        >
          <li v-for="item in list" @click="go_xq(item)" :key="item.id">
            <div class="bg_img" v-lazy:background-image="item.image"></div>
            <p class="goods_info" v-html="item.name"></p>
            <p class="goods_value">￥{{item.money}}<span v-if="item.maxprice>item.money">起</span></p>
          </li>
        </van-list>
      </ul>
      <!-- <div class="guanting" v-if="gj.status==2"></div> -->
      <div class="weikaitong" v-if="gj.status==3"></div>
      <div class="zanting" v-if="gj.status==1"></div>
      <div class="zhuangxiu" v-if="gj.status==4||gj.status==2"></div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import top from '@/base/top/top'
import mastertalk from '@/base/mastertalk/mastertalk'
import axios from 'axios'
import { Toast } from 'vant'
import { mapMutations,mapActions } from 'vuex'
export default{
  data(){
    return{
      buluo: {},
      list:[],
      tty:false,
      gj:{},
      page:1,
      loading: false,
      finished: false,
      shop_id:''
    }
  },
  mounted(){
    this.get_data()
  },
  methods:{
    get_data(){
      setCookie('uid',this.$route.query.uid)
      this.buluo={
        uid:this.$route.query.uid,
        blid:this.$route.query.blid,
        blname:this.$route.query.blname
      }
      var that = this
      axios.get(`/store/get_app_store/${appkey}?buluo_id=${this.buluo.blid}`)
      .then(function (res) {
        if(res.data.code==200){
          that.gj = res.data.data
        }else{
          Toast(res.data.msg);
        }
        that.$store.commit('set_buluo', that.buluo)
        that.$store.commit('set_wx', that.$route.query.wx)
        let shop = {
          area:res.data.data.address,
          shengid:res.data.data.provinceid,
          shiid:res.data.data.cityid,
          xianid:res.data.data.areaid,
          did:res.data.data.store_id,
          tel:res.data.data.tel
        }
        that.$store.commit('set_shop', shop)
        that.shop_id = res.data.data.store_id
        that.get_List()
      })
      .catch(function (error) {
        console.log(error);
        Toast('网络异常');
      })
    },
    get_List(){
      var that = this
      axios.get(`/select/selectshopbrief?storeid=${this.shop_id}&page=${this.page}&pagesize=10`)
      .then(function (res) {
        if(res.data.code==200){
          if(res.data.data.list < 1){
            that.finished = true
          }else{
            that.list.push.apply(that.list,res.data.data.list)
          }
          that.loading = false
          that.isLoading = false
        }else{
          Toast(res.data.msg);
        }
      })
      .catch(function (error) {
        console.log(error);
        Toast('网络异常');
      })
    },
    open_fun(){
      this.tty=true
    },
    close_fun(){
      this.tty=false
    },
    go_xq(item){
      this.$router.push({path:`home/${item.id}`,query:{spid:item.id}})
    },
    onLoad(){
      this.loading = true
      clearTimeout(bb)
      var bb = setTimeout(() => {
        this.page ++
        this.get_List()
      }, 500)
    },
    ...mapMutations([
      'set_buluo',
      'set_shop'
    ])
  },
  components:{
    top,
    mastertalk
  },
  watch:{
    $route(){
      // var path = this.$route.path
      // if(path.indexOf('home')!==-1){
      //   this.get_data()
      // }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable'
.cont
  // overflow hidden
  // position fixed
  // top 0 
  // bottom 0
  // left 0
  // right 0
  // z-index 11
  height 100%
  .index_cont
    position fixed
    top 64px
    bottom 50px
    left 0
    width 100%
    padding 0 15px
    overflow-y scroll
    -webkit-overflow-scrolling touch
    box-sizing border-box
    .master_card 
      width 100%
      height 0
      padding 15% 0 28%
      box-sizing border-box
      display flex
      align-items center
      background-image url(./card.png)
      background-size cover
      background-position center 
      background-repeat no-repeat
      border-radius 4px
      box-shadow 0px 0px 6px #f7c78f
      .master_img 
        width 54px
        height 54px 
        border solid 2px #fff
        border-radius 50%
        margin 0 10px
      .master_info 
        font-size $font-size-medium-x
        color $color-text-button
        line-height 1.5
        flex 1
        min-width 0
        font-weight bold
        span 
          font-size $font-size-medium
          font-weight normal
      .master_tag 
        line-height 28px
        background-color #ff8712
        padding 0 12px
        border-radius 50px
        box-shadow 3px 2px 5px #f97410
        margin-right 10px
        img  
          width 18px
          height 18px
          margin-right 0px
          vertical-align middle
          display inline-block
        span 
          color $color-text-button
          font-size $font-size-medium
          vertical-align middle
          display inline-block
    .gjjx
      font-size $font-size-large
      font-weight bold
      display flex
      align-items center
      justify-content center
      height 80px
      p 
        font-weight bold
      .bef 
        width 13px
        height 1px 
        background-color #dfdfdf
        position relative
        margin-right 15px
        &:after
          content ''
          width 7px
          height 7 px
          box-sizing border-box
          border solid 1px #dfdfdf
          position absolute
          top -3px
          right -7px
          border-radius 50px
      .aft 
        width 13px
        height 1px 
        background-color #dfdfdf
        position relative
        margin-left 15px
        &:after
          content ''
          width 7px
          height 7px
          box-sizing border-box
          border solid 1px #dfdfdf
          position absolute
          top -3px
          left -7px
          border-radius 50px
    .goods_list
      padding-bottom 20px
      .van-list 
        width 100%
        display flex
        justify-content space-between
        flex-wrap wrap
        align-items flex-start
        li 
          width 48%
          box-sizing border-box
          margin-bottom 8px
          border-radius 4px
          .bg_img 
            background-size contain
            width 100%
            height 0
            padding-top 100%
            background-repeat no-repeat
            background-position center
            border-radius 2px
          .goods_info
            padding 10px 12px 0
            font-size $font-size-medium
            line-height 20px
            color $color-text
            display:-webkit-box !important; 
            overflow:hidden;
            text-overflow:ellipsis;
            word-break:break-all;
            -webkit-box-orient:vertical;
            -webkit-line-clamp:2;
            height 40px
          .goods_value 
            padding 8px 12px 20px
            font-size $font-size-medium-x
            color $color-order-highlight
    .guanting 
      background-image url("./guanting.png")
      background-repeat no-repeat
      background-size 172px 150px
      background-position center
      width 100%
      height 300px
    .weikaitong 
      background-image url("./weikaitong.png")
      background-repeat no-repeat
      background-size 172px 150px
      background-position center
      width 100%
      height 300px
    .zanting 
      background-image url("./zanting.png")
      background-repeat no-repeat
      background-size 172px 150px
      background-position center
      width 100%
      height 300px
    .zhuangxiu 
      background-image url("./zhuangxiu.png")
      background-repeat no-repeat
      background-size 172px 150px
      background-position center
      width 100%
      height 300px
</style>
