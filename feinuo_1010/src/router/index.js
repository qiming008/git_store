import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const Login = (resolve) => {
  import ('@/components/login/login').then((module) => {
    resolve(module)
  })
}
const Register = (resolve) => {
  import ('@/components/register/register').then((module) => {
    resolve(module)
  })
}
const Request = (resolve) => {
  import ('@/components/request/request').then((module) => {
    resolve(module)
  })
}
const Home = (resolve) => {
  import ('@/components/home/home').then((module) => {
    resolve(module)
  })
}
const Prolist = (resolve) => {
  import ('@/components/pro-list/pro-list').then((module) => {
    resolve(module)
  })
}
const Me = (resolve) => {
  import ('@/components/me/me').then((module) => {
    resolve(module)
  })
}
const Tongzhi = (resolve) => {
  import('@/components/tongzhi/tongzhi').then((module) => {
    resolve(module)
  })
}
const Proone = (resolve) => {
  import ('@/components/pro-one/pro-one').then((module) => {
    resolve(module)
  })
}
const Liuyan = (resolve) => {
  import ('@/components/liuyan/liuyan').then((module) => {
    resolve(module)
  })
}

const InfoPP = (resolve) => {
  import('@/components/info-pp/info-pp').then((module) => {
    resolve(module)
  })
}
const TongzhiInfo = (resolve) => {
  import ('@/components/tongzhi-info/tongzhi-info').then((module) => {
    resolve(module)
  })
}
// const Shenhe = (resolve) => {
//   import ('@/components/shenhe/shenhe').then((module) => {
//     resolve(module)
//   })
// }
// const Kehu = (resolve) => {
//   import ('@/components/kehu/kehu').then((module) => {
//     resolve(module)
//   })
// }
// const KehuDetail = (resolve) => {
//   import ('@/components/kehu-detail/kehu-detail').then((module) => {
//     resolve(module)
//   })
// }
// const FenxiaoList = (resolve) => {
//   import ('@/components/fenxiao-list/fenxiao-list').then((module) => {
//     resolve(module)
//   })
// }
// const FenxiaoDetail = (resolve) => {
//   import ('@/components/fenxiao-detail/fenxiao-detail').then((module) => {
//     resolve(module)
//   })
// }
const Paihang = (resolve) => {
  import ('@/components/paihang/paihang').then((module) => {
    resolve(module)
  })
}
const Yaoqing = (resolve) => {
  import ('@/components/yaoqing/yaoqing').then((module) => {
    resolve(module)
  })
}
// const Dongtai = (resolve) => {
//   import('@/components/dongtai-one/dongtai-one').then((module) => {
//     resolve(module)
//   })
// }
// const DongtaiList = (resolve) => {
//   import ('@/components/dongtai-list/dongtai-list').then((module) => {
//     resolve(module)
//   })
// }
const UserXy = (resolve) => {
  import ('@/components/user-xy/user-xy').then((module) => {
    resolve(module)
  })
}
// const Shezhi = (resolve) => {
//   import ('@/components/shezhi/shezhi').then((module) => {
//     resolve(module)
//   })
// }
const Tousu = (resolve) => {
  import('@/components/tousu/tousu').then((module) => {
    resolve(module)
  })
}
const instruction = (resolve) => {
  import('@/components/instruction/instruction').then((module) => {
    resolve(module)
  })
}
const client = (resolve) => {
  import('@/components/client/client').then((module) => {
    resolve(module)
  })
}
const clientSearch = (resolve) => {
  import('@/components/client_search/client_search').then((module) => {
    resolve(module)
  })
}
const itemSearch = (resolve) => {
  import('@/components/item_search/item_search').then((module) => {
    resolve(module)
  })
}
const clientDetail = (resolve) => {
  import('@/components/client_detail/client_detail').then((module) => {
    resolve(module)
  })
}
const clientXmxx = (resolve) => {
  import('@/components/client_xmxx/client_xmxx').then((module) => {
    resolve(module)
  })
}
const clientCjxx = (resolve) => {
  import('@/components/client_cjxx/client_cjxx').then((module) => {
    resolve(module)
  })
}
const clientAnalyze = (resolve) => {
  import('@/components/client_analyze/client_analyze').then((module) => {
    resolve(module)
  })
}
const clientEdit = (resolve) => {
  import('@/components/client_edit/client_edit').then((module) => {
    resolve(module)
  })
}
const shenhetongguo = (resolve) => {
  import('@/components/shenhetongguo/shenhetongguo').then((module) => {
    resolve(module)
  })
}
const picture = (resolve) => {
  import('@/components/picture/picture').then((module) => {
    resolve(module)
  })
}
const team = (resolve) => {
  import('@/components/team/team').then((module) => {
    resolve(module)
  })
}
const zhanghao = (resolve) => {
  import('@/components/zhanghao/zhanghao').then((module) => {
    resolve(module)
  })
}
const editTel = (resolve) => {
  import('@/components/edit_tel/edit_tel').then((module) => {
    resolve(module)
  })
}
const kctd = (resolve) => {
  import('@/components/kctd/kctd').then((module) => {
    resolve(module)
  })
}
const rule = (resolve) => {
  import('@/components/rule/rule').then((module) => {
    resolve(module)
  })
}
const intro = (resolve) => {
  import('@/components/pro_intro/pro_intro').then((module) => {
    resolve(module)
  })
}
const clientCjxq = (resolve) => {
  import('@/components/client_cjxq/client_cjxq').then((module) => {
    resolve(module)
  })
}
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/request',
      component: Request
    },
    {
      path: '/user-xy',
      component: UserXy
    },
    {
      path: '/kctd/:id',
      component: kctd
    },
    {
      path: '/home',
      component: Home,
      children:[
        {
          path: '/home/pro_list',
          component: Prolist,
          children:[
            {
              path: '/pro_list/tongzhi',
              component: Tongzhi,
              children:[
                {
                  path: ':id',
                  component: TongzhiInfo
                }
              ]
            },
            {
              path: '/pro_list/instruction',
              component: instruction
            },
            {
              path: ':id',
              component: Proone,
              children:[
                {
                  path: '/liuyan',
                  component: Liuyan
                },
                {
                  path: '/rule',
                  component: rule
                },
                {
                  path: '/intro',
                  component: intro
                }
                // {
                //   path: '/info_pp',
                //   component: InfoPP
                // },
                // {
                //   path: '/dongtai',
                //   component: Dongtai
                // },
                // {
                //   path: '/dongtai-list',
                //   component: DongtaiList
                // }
              ]
            }
          ]
        },
        {
          path: '/home/me',
          component: Me,
          children: [
            // {
            //   path: '/shenhe',
            //   component: Shenhe
            // },
            // {
            //   path: '/kehu',
            //   component: Kehu,
            //   children: [{
            //     path: '/kehu/:id',
            //     component: KehuDetail
            //   }]
            // },
            // {
            //   path: '/fenxiao_list',
            //   component: FenxiaoList,
            //   children: [{
            //     path: '/fenxiao_list/:id',
            //     component: FenxiaoDetail
            //   }]
            // },
            {
              path: '/paihang',
              component: Paihang
            },
            {
              path: '/yaoqing',
              component: Yaoqing
            },
            {
              path: '/clientCjxq',
              component: clientCjxq
            },
            // {
            //   path:'/shezhi',
            //   component: Shezhi,
            //   children:[{
            //     path: '/tousu',
            //     component: Tousu
            //   }]
            // },
            {
              path: '/tousu',
              component: Tousu
            },
            {
              path: '/picture',
              component: picture
            }, {
              path: '/zhanghao',
              component: zhanghao,
              children: [
                {
                  path: '/edit_tel',
                  component: editTel
                }
              ]
            }, {
              path: '/team',
              component: team,
              children:[
                {
                  path: '/item_search',
                  component: itemSearch
                }
              ]
            }
          ]
        },
        {
          path: '/home/client',
          component: client,
          children: [{
            path: ':id',
            component: clientDetail,
            children: [{
              path: '/client_xmxx',
              component: clientXmxx,
              children: [{
                path: '/client_cjxx',
                component: clientCjxx
              }]
            }, {
              path: '/client_analyze',
              component: clientAnalyze
            }, {
              path: '/client_edit',
              component: clientEdit
            }
          ]
          },{
            path: '/shenhetongguo',
            component: shenhetongguo
          },{
            path: '/client_search',
            component: clientSearch
          }
        ]
        }
      ]
    }
  ]
})
