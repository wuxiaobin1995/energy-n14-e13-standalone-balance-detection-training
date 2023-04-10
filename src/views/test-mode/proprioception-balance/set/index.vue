<!--
 * @Author      : Mr.bin
 * @Date        : 2021-09-25 11:19:13
 * @LastEditTime: 2023-04-10 17:32:27
 * @Description : 本体感觉平衡测试-参数设置
-->
<template>
  <div class="proprioception-balance-set">
    <!-- 语音播放 -->
    <audio ref="audio" controls="controls" hidden :src="audioSrc" />

    <!-- 标题 -->
    <div class="title">本体感觉平衡测试</div>

    <!-- 提示 -->
    <div class="tip">
      提示语：请双腿平稳站立在平台上，测试静态平衡站立时的平衡功能状况。
    </div>

    <!-- 主体 -->
    <div class="main">
      <!-- 参数配置 -->
      <div class="parameter">
        <!-- 测试时长 -->
        <div class="parameter__time">
          <div class="parameter__time--text">测试时长：</div>
          <el-slider
            class="parameter__time--slider"
            v-model="testTime"
            :show-tooltip="false"
            :min="10"
            :max="60"
            :step="5"
          ></el-slider>
          <div class="parameter__time--testTime">{{ testTime }}s</div>
        </div>
        <!-- 视觉反馈 -->
        <div :style="{ display: 'none' }" class="parameter__visual">
          <el-checkbox v-model="isVisual" border label="视觉反馈"></el-checkbox>
        </div>
        <!-- 重心轨迹 -->
        <div :style="{ display: 'none' }" class="parameter__barycenter">
          <el-checkbox
            v-model="isBarycenter"
            border
            label="重心轨迹"
            :disabled="!isVisual"
          ></el-checkbox>
        </div>
      </div>

      <!-- 示意图 -->
      <div class="img">
        <el-image
          class="img__sketchMap"
          :src="sketchMapSrc"
          fit="scale-down"
        ></el-image>
      </div>
    </div>

    <!-- 按钮组 -->
    <div class="btn">
      <el-button class="item" round type="success" @click="handleStart"
        >测 前 体 验</el-button
      >
    </div>
  </div>
</template>

<script>
/* 路径模块 */
import path from 'path'

export default {
  name: 'proprioception-balance-set',

  data() {
    return {
      sketchMapSrc: require('@/assets/img/Test/Balance/1.png'), // 示意图

      /* 语音相关 */
      audioOpen: this.$store.state.voiceSwitch,
      audioSrc: path.join(__static, `narrate/mandarin/本体感觉平衡测试.mp3`),

      testTime: 30, // 测试时长
      isVisual: true, // 是否开启视觉反馈
      isBarycenter: false // 是否开启重心轨迹
    }
  },

  mounted() {
    if (this.audioOpen === true) {
      setTimeout(() => {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      }, 500)
    }
  },

  methods: {
    /**
     * @description: 测前体验按钮
     */
    handleStart() {
      this.$router.push({
        path: '/test-proprioception-balance-experience',
        query: {
          testTime: JSON.stringify(this.testTime), // 测试时长
          isVisual: JSON.stringify(this.isVisual), // 是否开启视觉反馈
          isBarycenter: JSON.stringify(this.isBarycenter) // 是否开启重心轨迹
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.proprioception-balance-set {
  width: 100%;
  height: 100%;
  @include flex(column, stretch, stretch);

  /* 标题 */
  .title {
    font-size: 36px;
    color: green;
  }

  /* 提示 */
  .tip {
    margin-top: 30px;
    font-size: 22px;
  }

  /* 主体 */
  .main {
    flex: 1;
    @include flex(row, space-between, center);
    // 参数设置
    .parameter {
      margin-left: 50px;
      // 测试时长
      .parameter__time {
        @include flex(row, flex-start, center);
        .parameter__time--text {
          margin-right: 20px;
          font-size: 22px;
        }
        .parameter__time--slider {
          width: 22vw;
        }
        .parameter__time--testTime {
          margin-left: 20px;
          font-size: 20px;
        }
      }
      // 视觉反馈
      .parameter__visual {
        margin-top: 70px;
        & /deep/ .el-checkbox__label {
          font-size: 20px;
        }
      }
      // 重心轨迹
      .parameter__barycenter {
        margin-top: 40px;
        & /deep/ .el-checkbox__label {
          font-size: 20px;
        }
      }
    }

    // 示意图
    .img {
      margin-right: 100px;
      @include flex(row, center, center);
      .img__sketchMap {
        width: 100%;
      }
    }
  }

  /* 按钮组 */
  .btn {
    @include flex(row, center, center);
    .item {
      font-size: 30px;
    }
  }
}
</style>
