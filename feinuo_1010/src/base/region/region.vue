<template>
  <van-popup v-model="show" position="bottom" :overlay="true">
    <van-area :area-list="areaList" @confirm="confirm" @cancel="cancel"/>
  </van-popup>
</template>

<script>
import data from '@/common/js/Area.js'  
export default{
  data(){
    return {
      areaList: data
    }
  },
  props: {
    show: {
      type:Boolean,
      default: false
    }
  },
  methods: {
    confirm:function(area){
      this.$emit('confirm', area)
    },
    cancel:function(){
      this.$emit('cancel')
    }
  }
}
</script>

