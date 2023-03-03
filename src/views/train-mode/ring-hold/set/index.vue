<!--
 * @Author      : Mr.bin
 * @Date        : 2021-12-23 17:07:59
 * @LastEditTime: 2023-03-03 17:45:03
 * @Description : 圆环保持训练-参数设置
-->
<template>
  <div class="ring-hold-train-set">
    <!-- 标题 -->
    <div class="title">圆环保持训练</div>

    <!-- 提示 -->
    <div class="tip">
      提示语：请双腿平稳站立在平台上，在规定的范围内，控制重心做环绕训练。
    </div>

    <!-- 主体 -->
    <div class="main">
      <!-- 参数配置 -->
      <div class="parameter">
        <!-- 训练时长 -->
        <div class="parameter__item">
          <div class="parameter__item--text">训练时长：</div>
          <el-slider
            class="parameter__item--slider"
            v-model="trainTime"
            :show-tooltip="false"
            :min="30"
            :max="300"
            :step="5"
          ></el-slider>
          <div class="parameter__item--value">{{ trainTime }}s</div>
        </div>
        <!-- 小圆半径 -->
        <div class="parameter__item">
          <div class="parameter__item--text">小圆半径：</div>
          <el-slider
            class="parameter__item--slider"
            v-model="smallCircle"
            :show-tooltip="false"
            :step="1"
            :min="1"
            :max="bigCircle - 1"
            @input="handleSmallCircleChange"
          ></el-slider>
          <div class="parameter__item--value">{{ smallCircle }}</div>
        </div>
        <!-- 大圆半径 -->
        <div class="parameter__item">
          <div class="parameter__item--text">大圆半径：</div>
          <el-slider
            class="parameter__item--slider"
            v-model="bigCircle"
            :show-tooltip="false"
            :step="1"
            :min="smallCircle + 1"
            :max="boundaryAngle"
            @input="handleBigCircleChange"
          ></el-slider>
          <div class="parameter__item--value">{{ bigCircle }}</div>
        </div>
      </div>

      <!-- 图形 -->
      <div class="chart">
        <div id="chart" :style="{ width: '100%', height: '100%' }"></div>
      </div>
    </div>

    <!-- 按钮组 -->
    <div class="btn">
      <el-button class="btn__item" round type="primary" @click="handleStart"
        >开始训练</el-button
      >
    </div>
  </div>
</template>

<script>
/* 计算圆的相关参数 */
import { setCircle } from '@/utils/setCircle.js'

export default {
  name: 'ring-hold-train-set',

  data() {
    return {
      /* 图形相关变量 */
      myChart: null,
      option: {},

      /* 其他 */
      trainTime: 30, // 训练时长
      smallCircle: 1, // 小圆半径
      bigCircle: 2, // 大圆半径

      boundaryAngle: parseFloat(window.localStorage.getItem('boundaryAngle'))
    }
  },

  mounted() {
    this.initChart() // 初始化echarts图形
    // 监听父容器的宽高变化，目的是实现echarts图形自适应父容器的宽高变化
    window.addEventListener('resize', this.resizeCharts)
  },
  beforeDestroy() {
    // 注销echarts图形自适应监听事件
    window.removeEventListener('resize', this.resizeCharts)
  },

  methods: {
    /**
     * @description: 初始化echarts图形
     */
    initChart() {
      /* 相关计算 */
      const boundaryAngle = parseFloat(
        window.localStorage.getItem('boundaryAngle')
      ) // 最大角度

      const borderRound = setCircle(0, 0, boundaryAngle) // 边界圆

      const smallRound = setCircle(0, 0, this.smallCircle) // 小圆
      const bigRound = setCircle(0, 0, this.bigCircle) // 大圆

      this.myChart = this.$echarts.init(
        document.getElementById('chart'),
        'light',
        {
          renderer: 'canvas'
        }
      )
      this.option = {
        xAxis: {
          type: 'value',
          min: -boundaryAngle,
          max: boundaryAngle,
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          min: -boundaryAngle,
          max: boundaryAngle,
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        series: [
          // 边界圆
          {
            type: 'line',
            name: '边界圆',
            data: borderRound,
            color: '#6E7079',
            smooth: true,
            showSymbol: false
          },
          // 小圆
          {
            type: 'line',
            name: '小圆',
            data: smallRound,
            color: 'green',
            smooth: true,
            showSymbol: false
          },
          // 大圆
          {
            type: 'line',
            name: '大圆',
            data: bigRound,
            color: 'blue',
            smooth: true,
            showSymbol: false
          }
        ],
        animation: false
      }
      this.myChart.setOption(this.option)
    },

    /**
     * @description: 数据改变时触发（使用鼠标拖曳时，活动过程实时触发）
     */
    handleSmallCircleChange() {
      const smallRound = setCircle(0, 0, this.smallCircle) // 小圆
      this.option.series[1].data = smallRound
      this.myChart.setOption(this.option)
    },
    /**
     * @description: 数据改变时触发（使用鼠标拖曳时，活动过程实时触发）
     */
    handleBigCircleChange() {
      const bigRound = setCircle(0, 0, this.bigCircle) // 大圆
      this.option.series[2].data = bigRound
      this.myChart.setOption(this.option)
    },

    /**
     * @description: 开始训练
     */
    handleStart() {
      this.$router.push({
        path: '/layout/ring-hold-train-measure',
        query: {
          trainTime: JSON.stringify(this.trainTime),
          smallCircle: JSON.stringify(this.smallCircle),
          bigCircle: JSON.stringify(this.bigCircle)
        }
      })
    },

    /**
     * @description: 重新刷新画布（即重新获取父容器宽高），目的是实现echarts图形自适应父容器的宽高变化
     */
    resizeCharts() {
      if (this.myChart) {
        this.myChart.resize()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ring-hold-train-set {
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
      .parameter__item {
        margin: 60px 0;
        @include flex(row, flex-start, center);
        .parameter__item--text {
          margin-right: 20px;
          font-size: 22px;
        }
        .parameter__item--slider {
          width: 22vw;
        }
        .parameter__item--value {
          margin-left: 20px;
          font-size: 20px;
        }
      }
    }

    // 图形
    .chart {
      width: 30vw;
      height: 63vh;
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
