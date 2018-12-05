import Vue from 'vue'
import Vuex from 'vuex'
import {
  loadUid,
  saveUid,
  loadIMEI,
  saveIMEI
} from '@/common/js/cache'
Vue.use(Vuex)

const state = {
  uid: loadUid(),
  appkey:1,
  imei: loadIMEI()
}
const mutations = {
  set_uid(state, id) {
    state.uid = id
  },
  set_imei(state, id) {
    state.imei = id
  }
}
const getters = {
  uid: state => state.uid,
  appkey: state => state.appkey,
  imei: state => state.imei
}
const actions = {
  save_uid({
    commit
  }, cont) {
    commit('set_uid', saveUid(cont))
  },
  save_imei({
    commit
  }, cont) {
    commit('set_imei', saveIMEI(cont))
  },
}
export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})