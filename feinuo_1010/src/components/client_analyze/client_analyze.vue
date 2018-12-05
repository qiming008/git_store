<template>
  <div class="cont">
    <top title_name="客户分析"></top>
    <div class="analyze">
      <div class="box" ref="mychart">
      </div>
      <div class="pm">
        <h1 class="tit">最匹配该客户的房产类型排名：</h1>
        <ul>
          <li class="item" v-for="(item,index) in list" :class="index%3==1?'center':index%3==2?'right':''">
            <span class="num">{{index+1}}</span>
            <span class="txt">{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Top from '@/base/top/top'
import {Toast} from 'vant'
import {mapGetters} from 'vuex'
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/radar');

export default {
  data() {
    return {
      id: this.$route.query.userid,
      list: [],
      myChart:{},
      ind:[
        {text: '投资',color:'#6d6d6d'},
        {text: '文化',color:'#6d6d6d'},
        {text: '景点',color:'#6d6d6d'},
        {text: '养老',color:'#6d6d6d'},
        {text: '自用',color:'#6d6d6d'},
        {text: '海外',color:'#6d6d6d'}
      ],
      num_arr:[],
      echart_data: []
    }
  },
  computed: {
    ...mapGetters(['appkey']),
    opt(){
      let obj = {
        radar: [
          {
            indicator: this.ind,
            radius: 100,
            center: ['50%','50%'],
          }
        ],
        series: [
          {
            type: 'radar',
            data: [
              {
                value: this.echart_data,
                name: ''
              }
            ]
          }
        ]
      }
      return obj
    }
  },
  mounted() {
    this.get_analyze()
  },
  methods: {
    setEchart () {
      let dom = this.$refs.mychart;
      this.myChart = echarts.init(dom);
      this.myChart.setOption(this.opt);
    },
    sortNumber(a,b) {
      return b.num - a.num
    },
    get_analyze() {
      var that = this
      axios.get(`/app/relevant/get_analysis_number/${this.appkey}?userid=${this.id}`)
      .then(function(res) {
        if (res.data.code == 200) {
          let max = 100;
          that.list = res.data.retvalue.list.sort(that.sortNumber)
          for(var i=0;i<that.list.length;i++){
            that.num_arr.push(that.list[i].num)
          }

          max  = Math.max.apply(null, that.num_arr)
          // for(var i=0;i<that.list.length;i++){
          //   let obj = {
          //     text: that.list[i].name, max: max+5,color:'#000000'
          //   }
          //   that.ind.push(obj)
          // }
          for(var i=0;i<that.ind.length;i++){
            var idx = that.list.findIndex((item)=>{
              return item.name === that.ind[i].text
            })
            that.echart_data.push(that.list[idx].num)
            that.ind[i].max = max+5
          }
          that.setEchart()
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
}
</script>

<style scoped lang="stylus">
@import '~@/common/stylus/variable'
  .cont
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    z-index 999
    background-color $color-background-cont
    overflow-y auto
    .analyze
      margin-top 60px
      padding 20px
      margin-bottom 80px
      .box,.pm
        box-shadow:0px 0px 10px 4px rgba(0,0,0,0.05)
        border-radius 5px
      .box
        margin-bottom 15px
        width 100%
        height 336px
        display flex 
        align-items center
      .pm
        padding 36px
        .tit
          line-height 45px
          color #2f2f2f
          font-weight bold
        ul
          display flex
          flex-wrap wrap
        .item
          width 33.3%
          flex-shrink 0
          line-height 45px
          font-size $font-size-medium
          color #6d6d6d
          &.center
            text-align center
          &.right
            text-align right
          .num
            margin-right 8px
            padding 0 2px
            line-height 14px
            color #2C66ED
</style>
