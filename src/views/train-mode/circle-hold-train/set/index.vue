<!--
 * @Author      : Mr.bin
 * @Date        : 2021-12-27 16:16:13
 * @LastEditTime: 2022-04-21 15:06:11
 * @Description : 圆圈保持训练-参数设置
-->
<template>
  <div class="circle-hold-train-set">
    <!-- 标题 -->
    <div class="title">圆圈保持训练</div>

    <!-- 提示 -->
    <div class="tip">
      提示语：请双腿平稳站立在平台上，在规定的范围内，控制重心做训练。
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
        <!-- 圆圈半径 -->
        <div class="parameter__item">
          <div class="parameter__item--text">圆圈半径：</div>
          <el-slider
            class="parameter__item--slider"
            v-model="circle"
            :show-tooltip="false"
            :step="1"
            :min="1"
            :max="boundaryAngle"
            @input="handleChange"
          ></el-slider>
          <div class="parameter__item--value">{{ circle }}</div>
        </div>
        <!-- x轴坐标 -->
        <div class="parameter__item">
          <div class="parameter__item--text">x轴坐标：</div>
          <el-slider
            class="parameter__item--slider"
            v-model="xAxis"
            :show-tooltip="false"
            :step="1"
            :min="-boundaryAngle"
            :max="boundaryAngle"
            @input="handleChange"
          ></el-slider>
          <div class="parameter__item--value">{{ xAxis }}</div>
        </div>
        <!-- y轴坐标 -->
        <div class="parameter__item">
          <div class="parameter__item--text">y轴坐标：</div>
          <el-slider
            class="parameter__item--slider"
            v-model="yAxis"
            :show-tooltip="false"
            :step="1"
            :min="-boundaryAngle"
            :max="boundaryAngle"
            @input="handleChange"
          ></el-slider>
          <div class="parameter__item--value">{{ yAxis }}</div>
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
  name: 'circle-hold-train-set',

  data() {
    return {
      /* 图形相关变量 */
      myChart: null,
      option: {},

      /* 其他 */
      trainTime: 30, // 训练时长
      circle: 1, // 圆圈半径
      xAxis: 0, // x轴坐标
      yAxis: 0, // y轴坐标

      boundaryAngle: parseFloat(window.localStorage.getItem('boundaryAngle'))
    }
  },

  created() {
    this.$store.dispatch('setIsCollapse', false)

    this.checkOutZeroStandard()
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
     * @description: 初始化echarts图形
     */
    initChart() {
      /* 相关计算 */
      const boundaryAngle = parseFloat(
        window.localStorage.getItem('boundaryAngle')
      ) // 最大角度

      const borderRound = setCircle(0, 0, boundaryAngle) // 边界圆

      const round = setCircle(0, 0, this.circle) // 圆圈半径

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
          // 圆圈
          {
            type: 'line',
            name: '圆圈',
            data: round,
            color: 'green',
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
    handleChange() {
      const newRound = setCircle(this.xAxis, this.yAxis, this.circle)
      this.option.series[1].data = newRound
      this.myChart.setOption(this.option)
    },

    /**
     * @description: 开始训练
     */
    handleStart() {
      this.$router.push({
        path: '/layout/circle-hold-train-measure',
        query: {
          trainTime: JSON.stringify(this.trainTime),
          circle: JSON.stringify(this.circle),
          xAxis: JSON.stringify(this.xAxis),
          yAxis: JSON.stringify(this.yAxis)
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
.circle-hold-train-set {
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
