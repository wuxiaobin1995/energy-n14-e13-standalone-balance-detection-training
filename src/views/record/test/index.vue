<!--
 * @Author      : Mr.bin
 * @Date        : 2023-03-03 15:50:23
 * @LastEditTime: 2023-04-10 16:36:36
 * @Description : 测试-数据记录
-->
<template>
  <div class="test-record">
    <div class="wrapper">
      <div class="btn">
        <el-button class="item" type="danger" round plain @click="handleBalance"
          >平衡测试</el-button
        >

        <el-button
          class="item"
          type="primary"
          round
          plain
          @click="handleProprioceptionBalance"
          >本体感觉测试</el-button
        >

        <el-button
          class="item"
          type="warning"
          round
          plain
          @click="handleDynamicBalance"
          >动态平衡测试</el-button
        >
      </div>

      <div class="divider"></div>

      <transition mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'test-record',

  methods: {
    /**
     * @description: 平衡测试
     */
    handleBalance() {
      this.$router.push({ path: '/test-record/balance' })
    },

    /**
     * @description: 本体感觉平衡测试
     */
    handleProprioceptionBalance() {
      this.$router.push({ path: '/test-record/proprioception-balance' })
    },

    /**
     * @description: 动态平衡测试
     */
    handleDynamicBalance() {
      this.$router.push({ path: '/test-record/dynamic-balance' })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 路由过渡动效 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}

.test-record {
  width: 100%;
  height: 100%;
  @include flex(row, center, center);

  .wrapper {
    width: 96%;
    height: 96%;
    border-radius: 20px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 20px;

    .btn {
      @include flex(row, space-around, center);
      .item {
        width: 180px;
        font-size: 22px;
      }
    }

    .divider {
      margin-top: 20px;
      border: 1px solid rgb(204, 204, 204);
      width: 100%;
    }
  }
}
</style>
