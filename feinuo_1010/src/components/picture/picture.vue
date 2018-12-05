<template>
  <div class="picture">
    <top title_name="头像库" :change="change" :active="active" @wc="tijiao"></top>
    <div class="pic_box">
      <div class="tx_box">
        <div class="tx_img" v-lazy:background-image="tx_img"></div>
      </div>
      <h1 class="tit">男士推荐</h1>
      <div class="pic_list">
        <div class="img" v-lazy:background-image="item.address" v-for="item in lists" @click="sel_img(item.address)" :key="item.id" v-if="item.type==0">
        </div>
      </div>
      <h1 class="tit">女士推荐</h1>
      <div class="pic_list">
        <div class="img" v-lazy:background-image="item.address" v-for="item in lists" @click="sel_img(item.address)" :key="item.id" v-if="item.type==1"></div>
      </div>
    </div>
  </div>
</template>

<script>
import top from "@/base/top/top"
import axios from 'axios'
import { Toast } from 'vant'
import { mapGetters } from 'vuex'
export default {
  data(){
    return {
      change: true,
      active: false,
      lists: [],
      tx_img:this.$route.query.img
    }
  },
  mounted(){
    var that = this
    axios.get(`/newuser/get_img/1`)
    .then(function (res) {
      if(res.data.code==200){
        that.lists = res.data.data
      } else{
        Toast(res.data.errdes);
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  },
  computed:{
    ...mapGetters(['uid','appkey'])
  },
  methods:{
    sel_img(img) {
      if(this.tx_img!=img){
        this.active = true
      }
      this.tx_img = img
    },
    tijiao(){
      var that = this
      axios.get(`/newuser/set_user_img/${this.appkey}?uid=${this.uid}&img=${this.tx_img}`)
      .then(function (res) {
        if(res.data.code==200){
          Toast.success('操作成功')
          that.$router.go(-1)
        }else{
          Toast(res.data.errdes);
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    }
  },
  components:{
    top
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable'
  .picture
    position fixed
    top 0
    left 0
    bottom 0
    z-index 11
    background $color-background-cont
    overflow-y scroll
    .pic_box
      margin-top 60px
      padding 0 20px
      .tx_box
        padding-top 30px
        text-align center
        .tx_img
          width 80px
          height 80px
          margin 0 auto
          border-radius 50%
          background-position center center
          background-repeat no-repeat
          background-size cover
      .tit
        margin 40px 0 20px 0
        color $color-text
        font-size $font-size-large
        font-weight bold
      .pic_list
        display flex
        align-items center
        flex-wrap wrap
        justify-content space-around
        .img
          width 70px
          height 70px
          border-radius 5px
          margin 0 1px 14px
          background-position center center
          background-repeat no-repeat
          background-size contain
</style>
