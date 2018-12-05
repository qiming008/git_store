<template>
  <div class="clientedit">
    <top title_name="编辑信息" :change="change" :active="active" @wc="tj"></top>
    <van-tabs swipeable class="clientedit_van" v-model="activeIdx" @click="onClick" v-if="list.length>0">
      <van-tab>
        <div slot="title">身份证号</div>
        <div class="clientedit_sfz">
          <input type='text' v-model="sfz" placeholder="请输入身份证号" class="field_box" maxlength="18"/>
        </div>
      </van-tab>
      <van-tab v-for="(item,index) in list" :key="item.id">
        <div slot="title">{{item.name}}</div>
        <div class="clientedit_con">
          <editinfo ref="editinfo" :id="item.id" :userid="userid" @addlabel="add" @dellabel="del"></editinfo>
        </div>
      </van-tab>
      
      <van-tab>
        <div slot="title">备注</div>
        <div class="pad_cont">
          <textarea placeholder="请输入备注信息" rows="10" v-model="nr"></textarea>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import Top from '@/base/top/top'
import editinfo from '@/components/edit_info/edit_info'
import {Toast} from 'vant'
import {mapGetters} from 'vuex'
import qs from 'qs'
export default {
  data() {
    return {
      userid: this.$route.query.userid,
      list: [], // 分类列表
      change:true, // 右上角文字是否显示
      classid: this.$route.query.classid,
      activeIdx: 0, //当前激活的标签索引
      sfz: this.$route.query.sfz, // 身份证号
      label: [], // 已选标签
      nr: this.$route.query.note // 备注内容
    }
  },
  computed:{
    active() {// 右上角文字颜色
      if (this.label.length>0 || this.sfz!='' || this.nr!=''){
        return true
      } else {
        return false
      }
    },
    ...mapGetters(['appkey'])
  },
  mounted() {
    if (this.$route.query.sel != '') {
      var arr = this.$route.query.sel.split(',')
      arr.forEach(item => {
        this.label.push(parseInt(item))
      });
    }
    this.get_list()
  },
  methods: {
    get_list() {
      var that = this
      axios.get(`/customer_analysis/sel_analysis_class?pid=0`)
      .then(function(res) {
        if (res.data.code == 200) {
          that.list = res.data.retvalue
          if (that.classid === 0) {
            that.activeIdx = 0
          } else if (that.classid == -1) {
            that.activeIdx = that.list.length + 1
          } else {
            that.activeIdx = that.list.findIndex((item) => {
              return item.id === that.classid
            })+ 1
          }
        } else {
          Toast(res.data.errdes);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    tj() {
      var sfz = this.sfz.replace(/\s*/g,'')
      var nr = this.nr.replace(/\s*/g,'')
      let par = {userid: this.userid, label: this.label.toString(), note: nr, identity: sfz}
      if (this.label.length == 0 && sfz == '' && nr == '') {
        Toast('信息不能为空')
      }else if (sfz != '' && !sfz.match(/^\d{17}[\w\d]$/)) {
        Toast('身份证不正确')
      } else {
        var that = this
        axios.post(`/app/relevant/update_app_user_info_1_1_0/${this.appkey}`, qs.stringify(par))
        .then(function(res) {
          if (res.data.code == 200) {
            that.$router.go(-1)
          } else {
            Toast(res.data.errdes);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      }
    },
    add(id) {
      this.label.push(id)
    },
    del(id) {
      var idx = this.label.indexOf(id)
      this.label.splice(idx, 1)
    }
  },
  components: {
    Top,
    editinfo
  }
}
</script>
<style>
  input::-webkit-input-placeholder{
    color:#9e9e9e
  }
</style>

<style lang="stylus">
@import '~@/common/stylus/variable'
  .clientedit
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    z-index 999
    display flex
    flex-direction column
    background-color $color-background-cont
    .clientedit_van
      flex 1
      display flex
      flex-direction column
      margin-top 59px
      box-sizing border-box
      .van-tabs__content
        flex 1
        overflow-y scroll
        -webkit-overflow-scrolling touch
        .clientedit_sfz
          padding 25px 15px
          .field_box
            width 100%
            height 50px
            padding-left 10px
            box-sizing border-box
            border 1px solid #f0f0f0
            border-radius 5px
            text-align center
            font-size $font-size-medium
  .pad_cont
    padding 30px 20px 0 20px
    textarea
      font-size: $font-size-medium;
      width: 100%
      padding 10px
      outline none
      border 1px solid #f0f0f0
      box-sizing border-box
      line-height 1.5
      resize none
      border-radius 5px
</style>
