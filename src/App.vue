<!--
 * @Author      : Mr.bin
 * @Date        : 2021-09-13 16:45:54
 * @LastEditTime: 2023-03-02 11:54:06
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
    /* 初始化边界圆半径值 */
    if (!window.localStorage.getItem('boundaryAngle')) {
      window.localStorage.setItem('boundaryAngle', 12)
    }
    /* 初始化医院名称 */
    if (!window.localStorage.getItem('hospital')) {
      window.localStorage.setItem('hospital', '')
    }
  }
}
</script>

<style lang="scss" scoped></style>
