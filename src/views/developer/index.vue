<!--
 * @Author      : Mr.bin
 * @Date        : 2021-12-27 21:45:13
 * @LastEditTime: 2022-07-26 14:56:46
 * @Description : 开发者页面
-->
<template>
  <div class="developer">
    <el-card>
      <div class="main">
        <!-- 按钮 -->
        <el-button class="btn" type="success" round @click="handleOpenDev"
          >打开控制台</el-button
        >

        <!-- 边界圆半径值 -->
        <div class="set-boundaryAngle">
          <div>
            <span>边界圆半径值（°）：</span>
            <el-input-number
              v-model="boundaryAngle"
              :precision="2"
              :min="1"
              :max="50"
              @change="handleBoundaryAngleChange"
            ></el-input-number>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
/* 用于打开控制台 */
import { remote } from 'electron'

export default {
  name: 'developer',

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
     * @description: 打开控制台
     */
    handleOpenDev() {
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^htpm$/,
        inputErrorMessage: '密码不正确',
        showClose: true,
        closeOnClickModal: false
      })
        .then(() => {
          try {
            remote.getCurrentWebContents().openDevTools()
          } catch (err) {
            this.$message({
              type: 'error',
              message: `打开控制台失败：${err}`
            })
          }
        })
        .catch(() => {})
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
.developer {
  width: 100%;
  height: 100%;
  padding: 40px;

  .main {
    @include flex(column, center, center);
    // 按钮
    .btn {
      font-size: 30px;
      margin-bottom: 100px;
    }

    // 边界圆半径值
    .set-boundaryAngle {
      @include flex(row, center, center);
    }
  }
}
</style>
