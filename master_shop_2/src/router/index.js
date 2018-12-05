import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const home = (resolve) => {
  import('@/components/home/home').then((module) => {
    resolve(module)
  })
}
const shoppingCar = (resolve) => {
  import('@/components/shoppingcar/shoppingcar').then((module) => {
    resolve(module)
  })
}
const order = (resolve) => {
  import('@/components/order/order').then((module) => {
    resolve(module)
  })
}
const chat = (resolve) => {
  import('@/components/chat/chat').then((module) => {
    resolve(module)
  })
}
const chatTo = (resolve) => {
  import('@/components/chatTo/chatTo').then((module) => {
    resolve(module)
  })
}

const success = (resolve) => {
  import('@/components/pay_success/pay_success').then((module) => {
    resolve(module)
  })
}
const guige = (resolve) => {
  import('@/components/guige/guige').then((module) => {
    resolve(module)
  })
}
const goods_info = (resolve) => {
  import('@/components/commodityDetails/commodityDetails').then((module) => {
    resolve(module)
  })
}
const ordersure = (resolve) => {
  import('@/components/ordersure/ordersure').then((module) => {
    resolve(module)
  })
}
const address = (resolve) => {
  import('@/components/address/address').then((module) => {
    resolve(module)
  })
}
const addaddress = (resolve) => {
  import('@/components/addaddress/addaddress').then((module) => {
    resolve(module)
  })
}
const editaddress = (resolve) => {
  import('@/components/editaddress/editaddress').then((module) => {
    resolve(module)
  })
}
const beizhu = (resolve) => {
  import('@/components/beizhu/beizhu').then((module) => {
    resolve(module)
  })
}
const orderDetal = (resolve) => {
  import('@/components/orderdetail/orderdetail').then((module) => {
    resolve(module)
  })
}
const refund = (resolve) => {
  import('@/components/refund/refund').then((module) => {
    resolve(module)
  })
}
const payMid = (resolve) => {
  import('@/components/pay_middle/pay_middle').then((module) => {
    resolve(module)
  })
}
const reGoods = (resolve) => {
  import('@/components/return_goods/return_goods').then((module) => {
    resolve(module)
  })
}
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    }, {
      path: '/home',
      component: home,
      children: [{
        path: ':id',
        component: goods_info,
        children: [{
          path: '/guige',
          component: guige
        }]
      }]
    },
    {
      path: '/success_pay',
      component: success
    },
    {
      path: '/ordsure',
      component: ordersure,
      children: [
         {
        path: '/address',
        component: address,
        children: [{
            path: '/addaddress',
            component: addaddress
          },
          {
            path: ':id',
            component: editaddress
          }
        ]
      }, {
        path: '/beizhu',
        component: beizhu
      }]
    },
    {
      path: '/shopping_car',
      component: shoppingCar
    },
    {
      path: '/pay_mid',
      component: payMid
    },
    {
      path: '/order',
      component: order,
      children: [ {
        path: ':id',
        component: orderDetal,
        children: [{
          path: '/refund',
          component: refund
        }, {
            path: '/regoods',
            component: reGoods
          }]
      }]
    },
    {
      path: '/chat',
      component: chat,
      children: [{
        path: '/chatTo',
        component: chatTo
      }]
    }
  ]
})
