<!--
 * @Author      : Mr.bin
 * @Date        : 2023-03-02 17:48:59
 * @LastEditTime: 2023-03-03 17:45:22
 * @Description : 训练-项目选择
-->
<template>
  <div class="train-select">
    <div class="btn">
      <el-button
        class="item"
        :class="[isActiveRingHold]"
        :icon="isActiveRingHold === 'btn__active' ? 'el-icon-circle-check' : ''"
        type="danger"
        round
        @click="handleRingHold"
        >圆环保持训练</el-button
      >

      <el-button
        class="item"
        :class="[isActiveCircleHold]"
        :icon="
          isActiveCircleHold === 'btn__active' ? 'el-icon-circle-check' : ''
        "
        type="warning"
        round
        @click="handleCircleHold"
        >圆圈保持训练</el-button
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
  name: 'train-select',

  data() {
    return {
      /* 动态css */
      isActiveRingHold: '',
      isActiveCircleHold: ''
    }
  },

  watch: {
    '$route.path': {
      handler(newVal, oldval) {
        if (newVal === '/train-select/ring-hold-set') {
          this.isActiveRingHold = 'btn__active'
        } else {
          this.isActiveRingHold = ''
        }
        if (newVal === '/train-select/circle-hold-set') {
          this.isActiveCircleHold = 'btn__active'
        } else {
          this.isActiveCircleHold = ''
        }
      },
      immediate: true
    }
  },

  methods: {
    /**
     * @description: 圆环保持训练
     */
    handleRingHold() {
      this.$router.push({ path: '/train-select/ring-hold-set' })
    },

    /**
     * @description: 圆圈保持训练
     */
    handleCircleHold() {
      this.$router.push({ path: '/train-select/circle-hold-set' })
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

.train-select {
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
      width: 180px;
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
