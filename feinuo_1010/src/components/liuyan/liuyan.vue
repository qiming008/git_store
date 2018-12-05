<template>
  <transition name="slide">
    <div class="cont">
      <top :title_name="'菲诺旅居'"></top>
      <p class="text_tit">{{title}}项目留言</p>
      <div class="text_box">
        <textarea v-model="liuyan" maxlength="200" placeholder="留言将由筛选后显示，对所有人可见" rows="8"></textarea>
      </div>
      <div class="btn" @click="liuyan_tj()">提 交</div>
    </div>
  </transition>
</template>


<script>
import top from "@/base/top/top"
import axios from 'axios'
import { Toast } from 'vant'
import { mapGetters } from 'vuex'
export default {
  data(){
    return {
      liuyan:'',
      title:this.$route.query.title
    }
  },
  methods:{
    liuyan_tj(){
      if(this.liuyan.trim().length > 0){
        var that = this
        axios.get(`/message/savemessage?user_id=${this.uid}&project_id=${this.$route.query.id}&content=${this.liuyan}&type=1&xm_id=${this.$route.query.id}`)
        .then(function (res) {
          if(res.data.code==200){
            Toast.success('提交成功')
            that.$router.go(-1)
          }else if(res.data.code==400){
            Toast('请勿输入表情或特殊符号')
          }else{
            Toast(res.data.errdes);
          }
        })
        .catch(function (error) {
          console.log(error);
        })
      }
    }
  },
  computed:{
    ...mapGetters(['uid'])
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
  background-color $color-background
  .text_tit
    margin-top 60px
    padding 14px
    font-size $font-size-medium
  .text_box
    background-color $color-background-cont
    padding 8px 14px
    textarea
      border none
      outline none
      width 100%
      font-size $font-size-medium
  .btn
    width 80%
    margin:20px auto
    line-height 50px
    background $color-button
    background $color-button-webkit
    color $color-text-button
    text-align center
    border-radius 50px
</style>

