<template>
  <transition name="slide">
    <div class="cont">
      <top :title_name="'管家小店'" :chat="false"></top>
      <div class="chat_room">
        <div class="goods_link" v-if="is_goods_page">
          <img src="" alt="">
          <div class="goods_info">
            <p class="info1">可口可乐夏季饮品可口可乐夏季可口饮品可口可乐夏季饮品……</p>
            <p class="info2">
              <span>￥28</span>
              <i>发送链接</i>
            </p>
          </div>
        </div>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh" >
          <div :class="item.type==2?'chat_to':'chat_me'" v-for="item in chat_list">
            <img :src="item.img" alt="">
            <p v-html="recode(item.content)"></p>
          </div>
        </van-pull-refresh>
      </div>
      <div class="hf_btn" @click="hf">回复</div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import top from "@/base/top/top"
import axios from 'axios'
import { Toast } from 'vant'
import { mapGetters } from 'vuex'
import { Base64 } from '@/common/js/base64.js'
export default{
  data(){
    return{
      chat_list:[],
      is_goods_page:false,
      isLoading:true,
      uid:7775,
      did:2
    }
  },
  mounted(){
    var that = this
    axios.get(`/chat/get_chat/1?chat_type=1&uid=${this.uid}&toid=0&store_id=${this.did}&pagesize=5&page=1`)
    .then(function (res) {
      if(res.data.code==200){
        console.log(res.data.data.list)
        that.chat_list = res.data.data.list
      }else{
        Toast(res.data.errdes);
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    // this.get_new()
  },
  computed:{
    // ...mapGetters(['uid','did'])
  },
  methods:{
    get_new(){
      setTimeout(() => {
        var that = this
        axios.get(`/chat/get_isread/1?chat_type=1&uid=${this.uid}&toid=0&store_id=${this.did}`)
        .then(function (res) {
          if(res.data.code==200){
            that.chat_list.concat(res.data)
          }else{
            Toast(res.data.errdes);
          }
        })
        .catch(function (error) {
          console.log(error);
        })
        this.get_new()
      }, 5000);
    },
    hf(){
      this.$router.push("/chatTo")
    },
    recode(str){
      var b = new Base64()
      return b.decode(str)
    },
    onRefresh(){
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
      }, 500);
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
.cont 
  position: fixed
  top: 0
  bottom: 0
  width: 100%
  z-index  99
  background-color #f5f5f5
  overflow-y scroll
  i 
    font-style normal
  .chat_room 
    margin-top 60px
    padding 10px 10px 100px
    width 100%
    box-sizing border-box
    .goods_link 
      width 100%
      height 114px
      display flex
      align-items  center
      background-color $color-text-button
      border-radius 4px
      padding 0 10px
      box-sizing border-box
      img 
        width 70px
        height 70px
        margin-right 14px
      .goods_info 
        flex 1
        min-width 0
        .info1 
          font-size $font-size-medium
          color $color-text
          line-height 1.5
          display:-webkit-box !important;  
          overflow:hidden;
          text-overflow:ellipsis;
          word-break:break-all;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:2
        .info2 
          color $color-order-highlight
          font-size $font-size-medium
          margin-top 10px
          display flex 
          justify-content space-between
          span 
            font-size $font-size-medium-x
          i 
            padding 5px 10px
            border solid 1px $color-order-highlight
            border-radius 50px
    .chat_to 
      margin-top 28px
      display flex
      img 
        width 40px
        height 40px
        border-radius 50%
      p 
        font-size $font-size-medium
        line-height 1.2
        border-radius 6px
        border solid 1px #cecece
        background-color $color-text-button
        margin 0 12px
        padding 10px 8px
        flex 1
        min-width 0
        position relative
        z-index 1
        margin-right 46px
        &:before
          content ''
          width 0 
          height 0
          position absolute
          top 15px
          left -6px
          border-top solid 5px transparent
          border-bottom solid 5px transparent
          border-right solid 6px $color-text-button
          z-index 20
        &:after 
          content ''
          width 0 
          height 0
          position absolute
          top 15px
          left -8px
          border-top solid 6px transparent
          border-bottom solid 6px transparent
          border-right solid 7px #cecece
          z-index 10
    .chat_me 
      margin-top 28px
      display flex
      flex-direction row-reverse
      img 
        width 40px
        height 40px
        border-radius 50%
      p 
        font-size $font-size-medium
        line-height 1.2
        border-radius 6px
        border solid 1px #ffc253
        background-color #fff2db
        margin 0 12px
        padding 10px 8px
        flex 1
        min-width 0
        position relative
        z-index 1
        margin-left 46px
        &:before
          content ''
          width 0 
          height 0
          position absolute
          top 15px
          right -6px
          border-top solid 5px transparent
          border-bottom solid 5px transparent
          border-left solid 6px #fff2db
          z-index 20
        &:after 
          content ''
          width 0 
          height 0
          position absolute
          top 15px
          right -8px
          border-top solid 6px transparent
          border-bottom solid 6px transparent
          border-left solid 7px #ffc253
          z-index 10
  .hf_btn
    width 90%
    background linear-gradient(left,$color-text-button-left,$color-text-button-right)
    line-height 42px
    color $color-text-button
    text-align center 
    border-radius 50px
    position fixed
    bottom 16px
    left 50%
    margin-left -45%
    z-index 100

</style>