<!--
 * @Author      : Mr.bin
 * @Date        : 2021-09-13 16:45:54
 * @LastEditTime: 2022-07-26 14:56:54
 * @Description : 根组件
-->
<template>
  <div id="app">
    <transition mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',

  created() {
    this.initBoundaryAngle()
  },

  methods: {
    /**
     * @description: 初始化边界圆半径值
     */
    initBoundaryAngle() {
      if (!window.localStorage.getItem('boundaryAngle')) {
        window.localStorage.setItem('boundaryAngle', 12)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 路由过渡动效
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}
</style>
