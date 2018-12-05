<template>
  <div class="editinfo">
    <h1 class="editinfo_tit">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-right1"></use>
      </svg>
      已添加
    </h1>
    <ul v-if="lists.select && lists.select.length>0">
      <li class="item" v-for="(item,index) in lists.select" @click="delone(index,item)">
        {{item.label}}
        <svg class="icon jian" aria-hidden="true">
          <use xlink:href="#icon-subtract"></use>
        </svg>
      </li>
    </ul>
    <h1 class="editinfo_tit">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-wrong"></use>
      </svg>
      未添加
    </h1>
    <ul v-show="lists.unselected&&lists.unselected.length>0">
      <li class="item" v-for="(item,index) in lists.unselected" @click="addone(item,index)">
        {{item.label}}
        <svg class="icon jia" aria-hidden="true">
          <use xlink:href="#icon-add"></use>
        </svg>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import {Toast} from 'vant'
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    userid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      lists: []
    }
  },
  mounted() {
    this.get_label()
  },
  methods: {
    get_label() {
      var that = this
      axios.get(`/customer_analysis/get_all_analysis_label?lv1=${this.id}&userid=${this.userid}`)
      .then(function(res) {
        if (res.data.code == 200) {
          that.lists = res.data.retvalue
        } else {
          Toast(res.data.errdes);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    addone(item,idx) {
      this.lists.select.push(item)
      this.lists.unselected.splice(idx,1)
      this.$emit('addlabel',item.id)
    },
    delone(idx,item) {
      this.lists.select.splice(idx,1)
      this.lists.unselected.push(item)
      this.$emit('dellabel',item.id)
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@/common/stylus/variable'
@import '~@/common/stylus/mixin'
  .editinfo
    padding 10px 20px
    .editinfo_tit
      line-height 60px
      font-size $font-size-medium-x
      color #2f2f2f
      font-weight bold

    ul
      display flex
      flex-wrap wrap
      padding-top 6px
    .item
      flex-shrink 0
      position relative
      width 80px
      line-height 55px
      margin 0 8px 20px 0
      text-align center
      background #F8F8F8
      border 1px solid #ECECEC
      border-radius 5px
      color #6d6d6d
      font-size $font-size-medium
      box-sizing border-box
      .jia
        position absolute
        right 4px
        top 4px
        color #2C66ED
        z-index 99
      .jian
        position absolute
        right 4px
        top 4px
        color #DFDFDF
        z-index 99
</style>
