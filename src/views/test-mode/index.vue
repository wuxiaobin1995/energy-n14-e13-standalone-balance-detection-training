<!--
 * @Author      : Mr.bin
 * @Date        : 2023-03-02 17:48:59
 * @LastEditTime: 2023-04-12 17:19:51
 * @Description : 测试-项目选择
-->
<template>
  <div class="test-select">
    <div class="btn">
      <el-button
        class="item"
        :class="[isActiveBalance]"
        :icon="isActiveBalance === 'btn__active' ? 'el-icon-circle-check' : ''"
        type="danger"
        round
        @click="handleBalance"
        >平衡测试</el-button
      >

      <el-button
        class="item"
        :class="[isActiveProprioceptionBalance]"
        :icon="
          isActiveProprioceptionBalance === 'btn__active'
            ? 'el-icon-circle-check'
            : ''
        "
        type="primary"
        round
        @click="handleProprioceptionBalance"
        >本体感觉测试</el-button
      >

      <el-button
        class="item"
        :class="[isActiveLRBalance]"
        :icon="
          isActiveLRBalance === 'btn__active' ? 'el-icon-circle-check' : ''
        "
        type="warning"
        round
        @click="handleLRBalance"
        >左右平衡测试</el-button
      >

      <el-button
        class="item"
        :class="[isActiveFBBalance]"
        :icon="
          isActiveFBBalance === 'btn__active' ? 'el-icon-circle-check' : ''
        "
        type="success"
        round
        @click="handleFBBalance"
        >前后平衡测试</el-button
      >

      <el-button
        class="item"
        :class="[isActiveDiagonalBalance]"
        :icon="
          isActiveDiagonalBalance === 'btn__active'
            ? 'el-icon-circle-check'
            : ''
        "
        type="info"
        round
        @click="handleDiagonalBalance"
        >对角线平衡测试</el-button
      >
    </div>

    <div class="wrapper">
      <transition mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'test-select',

  data() {
    return {
      /* 动态css */
      isActiveBalance: '',
      isActiveProprioceptionBalance: '',
      isActiveLRBalance: '',
      isActiveFBBalance: '',
      isActiveDiagonalBalance: ''
    }
  },

  watch: {
    '$route.path': {
      handler(newVal, oldval) {
        if (newVal === '/test-select/balance-set') {
          this.isActiveBalance = 'btn__active'
        } else {
          this.isActiveBalance = ''
        }
        if (newVal === '/test-select/proprioception-balance-set') {
          this.isActiveProprioceptionBalance = 'btn__active'
        } else {
          this.isActiveProprioceptionBalance = ''
        }
        if (newVal === '/test-select/lr-balance-set') {
          this.isActiveLRBalance = 'btn__active'
        } else {
          this.isActiveLRBalance = ''
        }
        if (newVal === '/test-select/fb-balance-set') {
          this.isActiveFBBalance = 'btn__active'
        } else {
          this.isActiveFBBalance = ''
        }
        if (newVal === '/test-select/diagonal-balance-set') {
          this.isActiveDiagonalBalance = 'btn__active'
        } else {
          this.isActiveDiagonalBalance = ''
        }
      },
      immediate: true
    }
  },

  methods: {
    /**
     * @description: 平衡测试
     */
    handleBalance() {
      this.$router.push({ path: '/test-select/balance-set' })
    },

    /**
     * @description: 本体感觉平衡测试
     */
    handleProprioceptionBalance() {
      this.$router.push({ path: '/test-select/proprioception-balance-set' })
    },

    /**
     * @description: 左右平衡测试
     */
    handleLRBalance() {
      this.$router.push({ path: '/test-select/lr-balance-set' })
    },

    /**
     * @description: 前后平衡测试
     */
    handleFBBalance() {
      this.$router.push({ path: '/test-select/fb-balance-set' })
    },

    /**
     * @description: 对角线平衡测试
     */
    handleDiagonalBalance() {
      this.$router.push({ path: '/test-select/diagonal-balance-set' })
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

.test-select {
  width: 100%;
  height: 100%;
  position: relative;
  @include flex(row, center, center);

  .btn {
    position: absolute;
    left: -16px;
    top: 0;
    margin-top: 13px;
    @include flex(column, stretch, stretch);
    .item {
      margin: 6px 0;
      width: 190px;
      font-size: 22px;
    }
    .btn__active {
      width: 230px;
    }
  }

  .wrapper {
    width: 96%;
    height: 96%;
    border-radius: 20px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 20px 20px 20px 220px;
  }
}
</style>
