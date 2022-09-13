/*
 * @Author      : Mr.bin
 * @Date        : 2021-09-13 16:45:54
 * @LastEditTime: 2022-04-24 14:34:15
 * @Description : vuex
 */
import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  // plugins: [
  //   createPersistedState({
  //     key: 'vuex-persistedstate', // 自定义Storage中的Key名，默认是vuex
  //     storage: window.sessionStorage, // 使用sessionStorage来固化数据
  //     reducer(val) {
  //       return {
  //         aaa: val.aaa,
  //         bbb: val.bbb,
  //         ccc: val.ccc
  //       }
  //     }
  //   })
  // ],

  state: {
    /* 当前登录管理员 */
    currentAdmin: {
      adminId: '', // 账号
      adminPassword: '' // 密码
    },

    /* 当前登录用户 */
    currentUser: {
      userId: '', // 账号
      userPassword: '', // 密码
      userName: '', // 姓名
      sex: '' // 性别
    },

    /* x，y调零基准值 */
    zeroStandard: {
      xStandard: null,
      yStandard: null
    },

    /* 是否展开、折叠侧边菜单栏 */
    isCollapse: false, // 默认展开

    /* 蓝牙连接与否 */
    isBluetooth: false
  },

  mutations: {
    /* 当前登录管理员 */
    SET_CURRENTADMIN(state, currentAdmin) {
      state.currentAdmin = currentAdmin
    },

    /* 当前登录用户 */
    SET_CURRENTUSER(state, currentUser) {
      state.currentUser = currentUser
    },

    /* x，y调零基准值 */
    SET_ZEROSTANDARD(state, zeroStandard) {
      state.zeroStandard = zeroStandard
    },

    /* 是否展开、折叠侧边菜单栏 */
    SET_ISCOLLAPSE(state, isCollapse) {
      state.isCollapse = isCollapse
    },

    /* 蓝牙连接与否 */
    SET_ISBLUETOOTH(state, isBluetooth) {
      state.isBluetooth = isBluetooth
    }
  },

  actions: {
    /* 当前登录管理员 */
    setCurrentAdmin({ commit }, currentAdmin) {
      return new Promise((resolve, reject) => {
        commit('SET_CURRENTADMIN', currentAdmin)
        resolve()
      })
    },

    /* 当前登录用户 */
    setCurrentUser({ commit }, currentUser) {
      return new Promise((resolve, reject) => {
        commit('SET_CURRENTUSER', currentUser)
        resolve()
      })
    },

    /* x，y调零基准值 */
    setZeroStandard({ commit }, zeroStandard) {
      return new Promise((resolve, reject) => {
        commit('SET_ZEROSTANDARD', zeroStandard)
        resolve()
      })
    },

    /* 是否展开、折叠侧边菜单栏 */
    setIsCollapse({ commit }, isCollapse) {
      return new Promise((resolve, reject) => {
        commit('SET_ISCOLLAPSE', isCollapse)
        resolve()
      })
    },

    /* 蓝牙连接与否 */
    setIsBluetooth({ commit }, isBluetooth) {
      return new Promise((resolve, reject) => {
        commit('SET_ISBLUETOOTH', isBluetooth)
        resolve()
      })
    }
  }
})
