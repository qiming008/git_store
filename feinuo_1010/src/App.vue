<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import { Toast } from 'vant'

export default {
  computed:{
    ...mapGetters(['uid','appkey','imei'])
  },
  mounted(){
    if(String(this.uid).length > 0){
      this.$router.push('/home/pro_list')
    } else {
      this.$router.push('/login')
    }
    this.repeat_login()
  },
  methods:{
    repeat_login(){
      var that = this
      setTimeout(() => {
        if(String(this.uid).length > 0){
          axios.get(`/userinfo/is_only_one/${that.appkey}?uid=${that.uid}&imei=${that.imei}`)
          .then(function (res) {
            if(res.data.code==400){
              Toast('账号已在别处登录')
              that.save_uid('')
              that.save_imei('')
              that.$router.push('/login')
            }else{
              that.repeat_login()
            }
          })
          .catch(function (error) {
            console.log(error);
          })
        }else{
          that.repeat_login()
        }
      }, 30000);
    },
    ...mapActions([
      'save_uid',
      'save_imei'
    ])
  }
}
</script>

<style>
#app {
  height:100%;
  overflow-y: scroll
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
