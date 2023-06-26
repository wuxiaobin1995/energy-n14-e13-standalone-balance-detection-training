<!--
 * @Author      : Mr.bin
 * @Date        : 2021-09-13 16:45:54
 * @LastEditTime: 2023-06-26 10:44:30
 * @Description : 根组件
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',

  created() {
    this.initLocalStorage()
  },

  methods: {
    /**
     * @description: 软件启动后，初始化localStorage的一些值
     */
    initLocalStorage() {
      /* 初始化边界圆半径值 */
      if (!window.localStorage.getItem('boundaryAngle')) {
        window.localStorage.setItem('boundaryAngle', 12)
      }
      /* 初始化医院名称 */
      if (!window.localStorage.getItem('hospital')) {
        window.localStorage.setItem('hospital', '')
      }
      /* 初始化免责声明的终端用户名称 */
      if (!window.localStorage.getItem('disclaimer_name')) {
        window.localStorage.setItem('disclaimer_name', '')
      }
      /* 初始化免责声明的设备编号 */
      if (!window.localStorage.getItem('disclaimer_device_id')) {
        window.localStorage.setItem('disclaimer_device_id', '')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
