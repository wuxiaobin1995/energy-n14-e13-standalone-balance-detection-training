/*
 * @Author      : Mr.bin
 * @Date        : 2021-09-13 16:45:54
 * @LastEditTime: 2023-03-02 10:55:36
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
    /* x，y调零基准值 */
    zeroStandard: {
      xStandard: null,
      yStandard: null
    },

    /* 当前选择的用户及其信息 */
    currentUserInfo: {
      userId: '', // 唯一id
      userName: '', // 姓名
      sex: '', // 性别
      affectedSide: '', // 患侧
      height: '', // 身高
      weight: '', // 体重
      birthday: '', // 出生日期
      remarks: '', // 备注
      lastLoginTime: '' // 最后登录时间
    },

    /* 蓝牙连接与否 */
    isBluetooth: false,

    /* 语音开关 */
    voiceSwitch: true
  },

  mutations: {
    /* x，y调零基准值 */
    SET_ZEROSTANDARD(state, zeroStandard) {
      state.zeroStandard = zeroStandard
    },

    // 当前选择的用户及其信息
    CHANGE_CURRENTUSERINFO(state, currentUserInfo) {
      state.currentUserInfo = currentUserInfo
    },

    /* 蓝牙连接与否 */
    SET_ISBLUETOOTH(state, isBluetooth) {
      state.isBluetooth = isBluetooth
    },

    /* 语音开关 */
    SET_VOICESWITCH(state, voiceSwitch) {
      state.voiceSwitch = voiceSwitch
    }
  },

  actions: {
    /* x，y调零基准值 */
    setZeroStandard({ commit }, zeroStandard) {
      return new Promise((resolve, reject) => {
        commit('SET_ZEROSTANDARD', zeroStandard)
        resolve()
      })
    },

    // 当前选择的用户及其信息
    changeCurrentUserInfo({ commit }, currentUserInfo) {
      return new Promise((resolve, reject) => {
        commit('CHANGE_CURRENTUSERINFO', currentUserInfo)
        resolve()
      })
    },

    /* 蓝牙连接与否 */
    setIsBluetooth({ commit }, isBluetooth) {
      return new Promise((resolve, reject) => {
        commit('SET_ISBLUETOOTH', isBluetooth)
        resolve()
      })
    },

    /* 语音开关 */
    setVoiceSwitch({ commit }, voiceSwitch) {
      return new Promise((resolve, reject) => {
        commit('SET_VOICESWITCH', voiceSwitch)
        resolve()
      })
    }
  }
})
