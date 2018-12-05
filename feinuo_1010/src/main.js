import 'babel-polyfill'
import fastclick from 'fastclick'
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from '@/vuex/store'
import Mui from 'vue-awesome-mui'
import {
  Tabbar,
  TabbarItem,
  Tab, Tabs,
  List, PullRefresh,
  Lazyload,
  Area, Popup, Dialog, Swipe, SwipeItem
} from 'vant'

Vue.use(Tabbar).use(TabbarItem).use(Tab).use(Tabs).use(List).use(PullRefresh).use(Area).use(Dialog).use(Popup).use(Swipe).use(SwipeItem).use(Lazyload, {
  loading: require('@/common/images/load.gif')
});
Vue.use(Mui)
import '@/common/stylus/index.styl'
import '@/common/js/iconfont.js'
import '@/common/js/vConsole.js'
Vue.config.productionTip = false
fastclick.attach(document.body)

axios.defaults.baseURL = "http://web.51fth.com/fth-fino"
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})


