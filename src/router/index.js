/*
 * @Author      : Mr.bin
 * @Date        : 2021-09-13 16:45:54
 * @LastEditTime: 2023-03-04 11:20:20
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
   */

  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout'),
    redirect: '/home',
    children: [
      // 首页
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home'),
        meta: ['首页']
      },
      // 用户
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user'),
        meta: ['用户']
      },
      // 添加用户
      {
        path: 'user-add',
        name: 'user-add',
        component: () => import('@/views/user-add'),
        meta: ['添加用户']
      },
      // 用户信息修改
      {
        path: 'user-edit',
        name: 'user-edit',
        component: () => import('@/views/user-edit'),
        meta: ['用户信息修改']
      },
      // 设置医院名称
      {
        path: 'set-hospital',
        name: 'set-hospital',
        component: () => import('@/views/set/set-hospital'),
        meta: ['设置医院名称']
      },
      // 蓝牙连接
      {
        path: 'set-bluetooth-connect',
        name: 'set-bluetooth-connect',
        component: () => import('@/views/set/set-bluetooth-connect'),
        meta: ['蓝牙连接']
      },
      // 调零
      {
        path: 'set-zero',
        name: 'set-zero',
        component: () => import('@/views/set/set-zero'),
        meta: ['调零']
      },
      // 数据迁移
      {
        path: 'set-data-migration',
        name: 'set-data-migration',
        component: () => import('@/views/set/set-data-migration'),
        meta: ['数据迁移']
      },
      // 开发者
      {
        path: 'set-developer',
        name: 'set-developer',
        component: () => import('@/views/set/set-developer'),
        meta: ['开发者']
      },

      /* 测试模块 */
      // 测试项目选择
      {
        path: 'test-select',
        name: 'test-select',
        component: () => import('@/views/test-mode'),
        meta: ['测试项目选择'],
        redirect: '/test-select/static-balance-set',
        children: [
          // 静态平衡测试
          {
            path: 'static-balance-set',
            name: 'static-balance-set',
            component: () => import('@/views/test-mode/static-balance/set'),
            meta: ['静态平衡测试']
          },
          // 动态平衡测试
          {
            path: 'dynamic-balance-set',
            name: 'dynamic-balance-set',
            component: () => import('@/views/test-mode/dynamic-balance/set'),
            meta: ['动态平衡测试']
          }
        ]
      },
      // 静态平衡测试-测前体验
      {
        path: 'test-static-balance-experience',
        name: 'test-static-balance-experience',
        component: () => import('@/views/test-mode/static-balance/experience'),
        meta: ['静态平衡测试-测前体验']
      },
      // 静态平衡测试-测量
      {
        path: 'test-static-balance-measure',
        name: 'test-static-balance-measure',
        component: () => import('@/views/test-mode/static-balance/measure'),
        meta: ['静态平衡测试-测量']
      },
      // 动态平衡测试-测前体验1
      {
        path: 'test-dynamic-balance-experience-one',
        name: 'test-dynamic-balance-experience-one',
        component: () =>
          import('@/views/test-mode/dynamic-balance/experience/one'),
        meta: ['动态平衡测试-测前体验1']
      },
      // 动态平衡测试-测前体验2
      {
        path: 'test-dynamic-balance-experience-two',
        name: 'test-dynamic-balance-experience-two',
        component: () =>
          import('@/views/test-mode/dynamic-balance/experience/two'),
        meta: ['动态平衡测试-测前体验2']
      },
      // 动态平衡测试-测前体验3
      {
        path: 'test-dynamic-balance-experience-three',
        name: 'test-dynamic-balance-experience-three',
        component: () =>
          import('@/views/test-mode/dynamic-balance/experience/three'),
        meta: ['动态平衡测试-测前体验3']
      },
      // 动态平衡测试-测量1
      {
        path: 'test-dynamic-balance-measure-one',
        name: 'test-dynamic-balance-measure-one',
        component: () =>
          import('@/views/test-mode/dynamic-balance/measure/one'),
        meta: ['动态平衡测试-测量1']
      },
      // 动态平衡测试-测量2
      {
        path: 'test-dynamic-balance-measure-two',
        name: 'test-dynamic-balance-measure-two',
        component: () =>
          import('@/views/test-mode/dynamic-balance/measure/two'),
        meta: ['动态平衡测试-测量2']
      },
      // 动态平衡测试-测量3
      {
        path: 'test-dynamic-balance-measure-three',
        name: 'test-dynamic-balance-measure-three',
        component: () =>
          import('@/views/test-mode/dynamic-balance/measure/three'),
        meta: ['动态平衡测试-测量3']
      },

      /* 训练模块 */
      // 训练项目选择
      {
        path: 'train-select',
        name: 'train-select',
        component: () => import('@/views/train-mode'),
        meta: ['训练项目选择'],
        redirect: '/train-select/ring-hold-set',
        children: [
          // 圆环保持训练
          {
            path: 'ring-hold-set',
            name: 'ring-hold-set',
            component: () => import('@/views/train-mode/ring-hold/set'),
            meta: ['圆环保持训练']
          },
          // 圆圈保持训练
          {
            path: 'circle-hold-set',
            name: 'circle-hold-set',
            component: () => import('@/views/train-mode/circle-hold/set'),
            meta: ['圆圈保持训练']
          }
        ]
      },
      // 圆环保持训练-测量
      {
        path: 'train-ring-hold-measure',
        name: 'train-ring-hold-measure',
        component: () => import('@/views/train-mode/ring-hold/measure'),
        meta: ['圆环保持训练-测量']
      },
      // 圆圈保持训练-测量
      {
        path: 'train-circle-hold-measure',
        name: 'train-circle-hold-measure',
        component: () => import('@/views/train-mode/circle-hold/measure'),
        meta: ['圆圈保持训练-测量']
      },

      /* 数据记录 */
      // 测试
      {
        path: 'test-record',
        name: 'test-record',
        component: () => import('@/views/record/test'),
        meta: ['测试-数据记录'],
        redirect: '/test-record/static-balance',
        children: [
          // 静态平衡测试
          {
            path: 'static-balance',
            name: 'static-balance',
            component: () => import('@/views/record/test/static-balance'),
            meta: ['静态平衡测试']
          },
          // 动态平衡测试
          {
            path: 'dynamic-balance',
            name: 'dynamic-balance',
            component: () => import('@/views/record/test/dynamic-balance'),
            meta: ['动态平衡测试']
          }
        ]
      },
      // 训练
      {
        path: 'train-record',
        name: 'train-record',
        component: () => import('@/views/record/train'),
        meta: ['训练-数据记录'],
        redirect: '/train-record/ring-hold',
        children: [
          // 圆环保持训练
          {
            path: 'ring-hold',
            name: 'ring-hold',
            component: () => import('@/views/record/train/ring-hold'),
            meta: ['圆环保持训练']
          },
          // 圆圈保持训练
          {
            path: 'circle-hold',
            name: 'circle-hold',
            component: () => import('@/views/record/train/circle-hold'),
            meta: ['圆圈保持训练']
          }
        ]
      }
    ]
  },

  /* 测试报告 */
  // 静态平衡测试-PDF报告
  {
    path: '/test-static-balance-pdf',
    name: 'test-static-balance-pdf',
    component: () => import('@/views/test-mode/static-balance/pdf'),
    meta: ['静态平衡测试-PDF报告']
  },
  // 静态平衡测试-长期趋势报告
  {
    path: '/test-static-balance-secular-trend-pdf',
    name: 'test-static-balance-secular-trend-pdf',
    component: () =>
      import('@/views/record/test/static-balance/secular-trend-pdf'),
    meta: ['静态平衡测试-长期趋势报告']
  },
  // 动态平衡测试-PDF报告
  {
    path: '/test-dynamic-balance-pdf',
    name: 'test-dynamic-balance-pdf',
    component: () => import('@/views/test-mode/dynamic-balance/pdf'),
    meta: ['动态平衡测试-PDF报告']
  },
  // 动态平衡测试-长期趋势报告
  {
    path: '/test-dynamic-balance-secular-trend-pdf',
    name: 'test-dynamic-balance-secular-trend-pdf',
    component: () =>
      import('@/views/record/test/dynamic-balance/secular-trend-pdf'),
    meta: ['动态平衡测试-长期趋势报告']
  },

  /* 训练报告 */
  // 圆环保持训练-PDF报告
  {
    path: '/train-ring-hold-pdf',
    name: 'train-ring-hold-pdf',
    component: () => import('@/views/train-mode/ring-hold/pdf'),
    meta: ['圆环保持训练-PDF报告']
  },
  // 圆环保持训练-长期趋势报告
  {
    path: '/train-ring-hold-secular-trend-pdf',
    name: 'train-ring-hold-secular-trend-pdf',
    component: () => import('@/views/record/train/ring-hold/secular-trend-pdf'),
    meta: ['圆环保持训练-长期趋势报告']
  },
  // 圆圈保持训练-PDF报告
  {
    path: '/train-circle-hold-pdf',
    name: 'train-circle-hold-pdf',
    component: () => import('@/views/train-mode/circle-hold/pdf'),
    meta: ['圆圈保持训练-PDF报告']
  },
  // 圆圈保持训练-长期趋势报告
  {
    path: '/train-circle-hold-secular-trend-pdf',
    name: 'train-circle-hold-secular-trend-pdf',
    component: () =>
      import('@/views/record/train/circle-hold/secular-trend-pdf'),
    meta: ['圆圈保持训练-长期趋势报告']
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
