<!--
 * @Author      : Mr.bin
 * @Date        : 2021-09-25 11:20:04
 * @LastEditTime: 2022-07-26 14:54:39
 * @Description : 动态平衡测试-参数设置
-->
<template>
  <div class="dynamic-balance-test">
    <!-- 标题 -->
    <div class="title">动态平衡测试</div>

    <!-- 提示 -->
    <div class="tip">
      提示语：请双腿平稳站立在平台上，按要求完成左右重心转移、前后重心转移、重心交叉对角线转移，测试站立时动态平衡功能状况。
    </div>

    <!-- 示意图 -->
    <div class="img">
      <el-image
        class="img__sketchMap"
        :src="oneSrc"
        fit="scale-down"
      ></el-image>
      <div class="arrows">➡</div>
      <el-image
        class="img__sketchMap"
        :src="twoSrc"
        fit="scale-down"
      ></el-image>
      <div class="arrows">➡</div>
      <el-image
        class="img__sketchMap"
        :src="threeSrc"
        fit="scale-down"
      ></el-image>
    </div>

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
      <div class="parameter__visual">
        <el-checkbox v-model="isVisual" border label="视觉反馈"></el-checkbox>
      </div>
      <!-- 重心轨迹 -->
      <div class="parameter__barycenter">
        <el-checkbox
          v-model="isBarycenter"
          border
          label="重心轨迹"
          :disabled="!isVisual"
        ></el-checkbox>
      </div>
    </div>

    <!-- 按钮组 -->
    <div class="btn">
      <el-button class="btn__item" round type="success" @click="handleStart"
        >测前体验</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'dynamic-balance-test-set',

  data() {
    return {
      oneSrc: require('@/assets/img/Test_Mode/dynamic-balance-test-set/1.png'),
      twoSrc: require('@/assets/img/Test_Mode/dynamic-balance-test-set/2.png'),
      threeSrc: require('@/assets/img/Test_Mode/dynamic-balance-test-set/3.png'),

      testTime: 30, // 测试时长
      isVisual: true, // 是否开启视觉反馈
      isBarycenter: true // 是否开启重心轨迹
    }
  },

  created() {
    this.$store.dispatch('setIsCollapse', false)

    this.checkOutZeroStandard()
  },

  watch: {
    /* 如果视觉反馈为false，则重心轨迹也要设为false */
    isVisual: {
      handler(newValue, oldValue) {
        if (newValue === false) {
          this.isBarycenter = false
        }
      },
      immediate: true
    }
  },

  methods: {
    /**
     * @description: 校验是否已经调零
     */
    checkOutZeroStandard() {
      const xStandard = this.$store.state.zeroStandard.xStandard
      const yStandard = this.$store.state.zeroStandard.yStandard
      if (xStandard === null || yStandard === null) {
        this.$alert(
          `请前往校准调零页面，进行“调零”操作！`,
          '提示：检测到仍未调零',
          {
            type: 'warning',
            showClose: false,
            center: true,
            confirmButtonText: '确 定',
            callback: () => {
              this.$router.push({
                path: '/layout/calibrate-zero'
              })
            }
          }
        )
      }
    },

    /**
     * @description: 测前体验按钮
     */
    handleStart() {
      this.$router.push({
        path: '/layout/dynamic-balance-test-experience-one',
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
.dynamic-balance-test {
  width: 100%;
  height: 100%;
  padding: 20px 100px 40px 100px;
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

  // 示意图
  .img {
    height: 30vh;
    @include flex(row, center, center);
    .arrows {
      font-size: 6vw;
      color: #5b9bd5;
    }
    .img__sketchMap {
      height: 100%;
    }
  }

  // 参数设置
  .parameter {
    margin-top: 20px;
    flex: 1;
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
      margin-top: 30px;
      & /deep/ .el-checkbox__label {
        font-size: 20px;
      }
    }
    // 重心轨迹
    .parameter__barycenter {
      margin-top: 30px;
      & /deep/ .el-checkbox__label {
        font-size: 20px;
      }
    }
  }

  /* 按钮组 */
  .btn {
    @include flex(row, center, center);
    .btn__item {
      font-size: 30px;
    }
  }
}
</style>
