import 'babel-polyfill'
import fastclick from 'fastclick'
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'
import axios from 'axios'
import store from '@/vuex/store'
import '@/common/stylus/index.styl'
import {
  Icon,
  Popup,
  Area,
  NavBar,
  Swipe,
  SwipeItem,
  Row,
  Col,
  Tabbar,
  TabbarItem,
  Uploader,
  Tab,
  Tabs,
  Picker,
  Dialog,
  Rate,
  List,
  PullRefresh,
  Loading,
  Cell,
  CellGroup,
  RadioGroup, Radio,
  Stepper,
  checkbox,
  CheckboxGroup
} from 'vant'
Vue.use(Vuex)
Vue.use(Icon).use(Popup).use(Area).use(NavBar).use(Swipe).use(SwipeItem).use(Row).use(Col).use(Tabbar).use(TabbarItem).use(Uploader).use(Tab).use(Tabs).use(Picker).use(Dialog).use(Rate).use(List).use(PullRefresh).use(Loading).use(Cell).use(CellGroup).use(RadioGroup).use(Radio).use(Stepper).use(checkbox).use(CheckboxGroup);

Vue.use(VueLazyLoad, {
  loading: require('@/common/image/load.gif')
})

// import '@/common/js/vConsole.js'

fastclick.attach(document.body)

axios.defaults.baseURL = "http://web.51fth.com/fth-gjxd"
// axios.defaults.timeout = 3500
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
