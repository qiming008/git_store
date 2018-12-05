import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  buluo:{
    uid: '',
    blid:'',
    blname:''
  },
  shop:{
    area:'',
    shengid:'',
    shiid:'',
    xianid:'',
    did: '',
    tel:''
  },
  wx:1
}

const mutations = {
  set_buluo (state, json) {
    state.buluo = json
  },
  set_shop (state, json) {
    state.shop = json
  },
  set_wx(state, num) {
    state.wx = num
  },
}

const getters = {
  buluo: state => state.buluo,
  shop: state => state.shop,
  wx: state => state.wx
}

const actions = {
  
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
