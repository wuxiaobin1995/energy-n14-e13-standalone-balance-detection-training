/*
 * @Author      : Mr.bin
 * @Date        : 2021-09-13 16:45:54
 * @LastEditTime: 2022-10-09 10:52:10
 * @Description : 路由
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  /*
   * 前面加"/"表示绝对路径，不加"/"表示相对路径
   * 一般嵌套路由中的子路由不需要加"/"，它会在父路由后自动加上"/子路由"
   * 比如父 "/father"，子 "child"，要想访问子路由，跳转链接需要写成 "/father/child"
   * meta的配置用于动态面包屑
   */

  /* 登录主页面 */
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/login')
  },

  /* 注册页面 */
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register')
  },

  /* 布局组件 */
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/layout'),
    children: [
      // 首页
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home'),
        meta: ['首页']
      },

      // 蓝牙连接
      {
        path: 'bluetooth-connect',
        name: 'bluetooth-connect',
        component: () => import('@/views/bluetooth-connect'),
        meta: ['蓝牙连接']
      },

      // 校准调零
      {
        path: 'calibrate-zero',
        name: 'calibrate-zero',
        component: () => import('@/views/calibrate-zero'),
        meta: ['校准调零']
      },

      // 个人信息修改
      {
        path: 'user-edit',
        name: 'user-edit',
        component: () => import('@/views/user-edit'),
        meta: ['个人信息修改']
      },

      // 管理员信息修改
      {
        path: 'admin-edit',
        name: 'admin-edit',
        component: () => import('@/views/admin-edit'),
        meta: ['管理员信息修改']
      },

      // 用户管理
      {
        path: 'user-manage',
        name: 'user-manage',
        component: () => import('@/views/user-manage'),
        meta: ['用户管理']
      },

      // 开发者页面
      {
        path: 'developer',
        name: 'developer',
        component: () => import('@/views/developer'),
        meta: ['开发者页面']
      },

      /* 测试模式 */
      // 静态平衡测试-参数设置
      {
        path: 'static-balance-test-set',
        name: 'static-balance-test-set',
        component: () => import('@/views/test-mode/static-balance-test/set'),
        meta: ['静态平衡测试-参数设置']
      },
      // 静态平衡测试-测前体验
      {
        path: 'static-balance-test-experience',
        name: 'static-balance-test-experience',
        component: () =>
          import('@/views/test-mode/static-balance-test/experience'),
        meta: ['静态平衡测试-测前体验']
      },
      // 静态平衡测试-测量
      {
        path: 'static-balance-test-measure',
        name: 'static-balance-test-measure',
        component: () =>
          import('@/views/test-mode/static-balance-test/measure'),
        meta: ['静态平衡测试-测量']
      },
      // 静态平衡测试-PDF报告
      {
        path: 'static-balance-test-pdf',
        name: 'static-balance-test-pdf',
        component: () => import('@/views/test-mode/static-balance-test/pdf'),
        meta: ['静态平衡测试-PDF报告']
      },
      // 动态平衡测试-参数设置
      {
        path: 'dynamic-balance-test-set',
        name: 'dynamic-balance-test-set',
        component: () => import('@/views/test-mode/dynamic-balance-test/set'),
        meta: ['动态平衡测试']
      },
      // 动态平衡测试-测前体验1
      {
        path: 'dynamic-balance-test-experience-one',
        name: 'dynamic-balance-test-experience-one',
        component: () =>
          import('@/views/test-mode/dynamic-balance-test/experience/one'),
        meta: ['动态平衡测试-测前体验1']
      },
      // 动态平衡测试-测前体验2
      {
        path: 'dynamic-balance-test-experience-two',
        name: 'dynamic-balance-test-experience-two',
        component: () =>
          import('@/views/test-mode/dynamic-balance-test/experience/two'),
        meta: ['动态平衡测试-测前体验2']
      },
      // 动态平衡测试-测前体验3
      {
        path: 'dynamic-balance-test-experience-three',
        name: 'dynamic-balance-test-experience-three',
        component: () =>
          import('@/views/test-mode/dynamic-balance-test/experience/three'),
        meta: ['动态平衡测试-测前体验3']
      },
      // 动态平衡测试-测量1
      {
        path: 'dynamic-balance-test-measure-one',
        name: 'dynamic-balance-test-measure-one',
        component: () =>
          import('@/views/test-mode/dynamic-balance-test/measure/one'),
        meta: ['动态平衡测试-测量1']
      },
      // 动态平衡测试-测量2
      {
        path: 'dynamic-balance-test-measure-two',
        name: 'dynamic-balance-test-measure-two',
        component: () =>
          import('@/views/test-mode/dynamic-balance-test/measure/two'),
        meta: ['动态平衡测试-测量2']
      },
      // 动态平衡测试-测量3
      {
        path: 'dynamic-balance-test-measure-three',
        name: 'dynamic-balance-test-measure-three',
        component: () =>
          import('@/views/test-mode/dynamic-balance-test/measure/three'),
        meta: ['动态平衡测试-测量3']
      },
      // 动态平衡测试-PDF报告
      {
        path: 'dynamic-balance-test-pdf',
        name: 'dynamic-balance-test-pdf',
        component: () => import('@/views/test-mode/dynamic-balance-test/pdf'),
        meta: ['动态平衡测试-PDF报告']
      },

      /* 训练模式 */
      // 圆环保持训练-参数设置
      {
        path: 'ring-hold-train-set',
        name: 'ring-hold-train-set',
        component: () => import('@/views/train-mode/ring-hold-train/set'),
        meta: ['圆环保持训练-参数设置']
      },
      // 圆环保持训练-测量
      {
        path: 'ring-hold-train-measure',
        name: 'ring-hold-train-measure',
        component: () => import('@/views/train-mode/ring-hold-train/measure'),
        meta: ['圆环保持训练-测量']
      },
      // 圆环保持训练-PDF报告
      {
        path: 'ring-hold-train-pdf',
        name: 'ring-hold-train-pdf',
        component: () => import('@/views/train-mode/ring-hold-train/pdf'),
        meta: ['圆环保持训练-PDF报告']
      },
      // 圆圈保持训练-参数设置
      {
        path: 'circle-hold-train-set',
        name: 'circle-hold-train-set',
        component: () => import('@/views/train-mode/circle-hold-train/set'),
        meta: ['圆圈保持训练-参数设置']
      },
      // 圆圈保持训练-测量
      {
        path: 'circle-hold-train-measure',
        name: 'circle-hold-train-measure',
        component: () => import('@/views/train-mode/circle-hold-train/measure'),
        meta: ['圆圈保持训练-测量']
      },
      // 圆圈保持训练-PDF报告
      {
        path: 'circle-hold-train-pdf',
        name: 'circle-hold-train-pdf',
        component: () => import('@/views/train-mode/circle-hold-train/pdf'),
        meta: ['圆圈保持训练-PDF报告']
      },

      /* 数据记录 */
      /* 测试 */
      // 静态平衡测试-数据记录
      {
        path: 'static-balance-test-record',
        name: 'static-balance-test-record',
        component: () => import('@/views/test-record/static-balance-test'),
        meta: ['静态平衡测试-数据记录']
      },
      // 静态平衡测试-长期趋势报告
      {
        path: 'static-balance-test-secular-trend-pdf',
        name: 'static-balance-test-secular-trend-pdf',
        component: () =>
          import('@/views/test-record/static-balance-test/secular-trend-pdf'),
        meta: ['静态平衡测试-长期趋势报告']
      },
      // 动态平衡测试-数据记录
      {
        path: 'dynamic-balance-test-record',
        name: 'dynamic-balance-test-record',
        component: () => import('@/views/test-record/dynamic-balance-test'),
        meta: ['动态平衡测试-数据记录']
      },
      // 动态平衡测试-长期趋势报告
      {
        path: 'dynamic-balance-test-secular-trend-pdf',
        name: 'dynamic-balance-test-secular-trend-pdf',
        component: () =>
          import('@/views/test-record/dynamic-balance-test/secular-trend-pdf'),
        meta: ['动态平衡测试-长期趋势报告']
      },

      /* 训练 */
      // 圆环保持训练-数据记录
      {
        path: 'ring-hold-train-record',
        name: 'ring-hold-train-record',
        component: () => import('@/views/train-record/ring-hold-train'),
        meta: ['圆环保持训练-数据记录']
      },
      // 圆环保持训练-长期趋势报告
      {
        path: 'ring-hold-train-secular-trend-pdf',
        name: 'ring-hold-train-secular-trend-pdf',
        component: () =>
          import('@/views/train-record/ring-hold-train/secular-trend-pdf'),
        meta: ['圆环保持训练-长期趋势报告']
      },
      // 圆圈保持训练-数据记录
      {
        path: 'circle-hold-train-record',
        name: 'circle-hold-train-record',
        component: () => import('@/views/train-record/circle-hold-train'),
        meta: ['圆圈保持训练-数据记录']
      },
      // 圆圈保持训练-长期趋势报告
      {
        path: 'circle-hold-train-secular-trend-pdf',
        name: 'circle-hold-train-secular-trend-pdf',
        component: () =>
          import('@/views/train-record/circle-hold-train/secular-trend-pdf'),
        meta: ['圆圈保持训练-长期趋势报告']
      }
    ]
  },

  /* 刷新中转页 */
  {
    path: '/refresh',
    name: 'refresh',
    component: () => import('@/views/refresh')
  },

  /* 路由出错时跳转至登录页 */
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes,
  /* 自定义路由切换时页面如何滚动 */
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 } // 回到顶部
  }
})

export default router
