<template>
  <div class="cont">
    <top title_name="投诉建议"></top>
    <div class="pad_cont">
      <textarea placeholder="请输入您的宝贵建议，我们将慢慢完善~~" rows="10" v-model="nr"></textarea>
      <div class="btn" @click="tj">完&emsp;成</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Top from "@/base/top/top";
import axios from "axios";
import { Toast } from "vant";
import { mapGetters } from 'vuex'
let Base64 = require('js-base64').Base64;
export default {
  data() {
    return {
      nr: ""
    };
  },
  computed:{
    ...mapGetters(['uid','appkey'])
  },
  methods: {
    tj() {
      var that = this;
      if(!this.nr.trim().length>0){
        return
      }
      var newnr = Base64.encode(this.nr)
      axios.get(`/projectbpm/set_complain/${this.appkey}?uid=${this.uid}&content=${newnr}`)
      .then(function(res) {
        if (res.data.code == 200) {
          Toast.success("提交成功");
          that.nr = "";
          that.$router.go(-1);
        } else {
          Toast(res.data.errdes);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    }
  },
  components: {
    Top
  }
};
</script>


<style scoped lang="stylus">
@import '~@/common/stylus/variable';
.cont
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: $color-background;
  // overflow-y: scroll;
  z-index: 10;
  .pad_cont
    margin-top 60px
    box-sizing: border-box
    textarea
      font-size: $font-size-medium;
      width: 100%;
      padding 10px
      border: none;
      outline: none;
      box-sizing border-box
      line-height: 1.5;
      resize none
    .btn
      width 80%
      height 44px
      line-height 44px
      text-align center
      color #fff
      background $color-button
      background $color-button-webkit
      margin 40px auto 0
      border-radius 44px
      box-shadow 0 0 10px 5px #d9f6e4
</style>
