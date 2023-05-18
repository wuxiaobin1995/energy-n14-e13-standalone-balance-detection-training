<!--
 * @Author      : Mr.bin
 * @Date        : 2021-12-27 21:45:13
 * @LastEditTime: 2023-05-18 11:09:52
 * @Description : 开发者页面
-->
<template>
  <div class="set-developer">
    <div class="wrapper">
      <el-page-header
        class="page"
        title="返回首页"
        content="开发者（单机版）"
        @back="handleToHome"
      ></el-page-header>

      <div class="btn">
        <el-button class="item" type="success" round @click="handleOpenDev"
          >打开控制台</el-button
        >
      </div>

      <!-- 边界圆半径值 -->
      <div class="set-boundaryAngle">
        <div>
          <span>边界圆半径值（°）：</span>
          <el-input-number
            v-model="boundaryAngle"
            :precision="2"
            :min="1"
            :max="90"
            @change="handleBoundaryAngleChange"
          ></el-input-number>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* 用于打开控制台 */
import { remote } from 'electron'

export default {
  name: 'set-developer',

  data() {
    return {
      boundaryAngle: 12
    }
  },

  created() {
    this.boundaryAngle = parseFloat(
      window.localStorage.getItem('boundaryAngle')
    )
  },

  methods: {
    /**
     * @description: 回到首页
     */
    handleToHome() {
      this.$router.push({
        path: '/home'
      })
    },

    /**
     * @description: 打开控制台
     */
    handleOpenDev() {
      try {
        remote.getCurrentWebContents().openDevTools()
      } catch (err) {
        this.$message({
          type: 'error',
          message: `打开控制台失败：${err}`
        })
      }
    },

    /**
     * @description: 边界圆半径值变化时触发
     * @param {*} value
     */
    handleBoundaryAngleChange(value) {
      if (!value) {
        value = 12
      }
      window.localStorage.setItem('boundaryAngle', value)
      this.$message({
        message: '修改边界圆半径值成功',
        type: 'success',
        duration: 500
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.set-developer {
  width: 100%;
  height: 100%;
  @include flex(row, center, center);

  .wrapper {
    width: 86%;
    height: 90%;
    border-radius: 34px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 40px;
    @include flex(column, center, center);
    position: relative;

    .page {
      position: absolute;
      top: 20px;
      left: 30px;
    }

    .btn {
      @include flex(column, center, center);
      .item {
        font-size: 28px;
      }
    }

    .set-boundaryAngle {
      margin-top: 70px;
      @include flex(row, center, center);
    }
  }
}
</style>
