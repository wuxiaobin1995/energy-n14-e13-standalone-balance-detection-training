<!--
 * @Author      : Mr.bin
 * @Date        : 2021-12-27 11:30:36
 * @LastEditTime: 2022-07-26 15:05:19
 * @Description : 圆环保持训练-PDF报告
-->
<template>
  <div
    class="train-ring-hold-pdf"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <!-- 打印区域 -->
    <div id="pdf" class="pdf-wrapper">
      <!-- 大标题 -->
      <div class="top">
        <div class="title">
          圆环保持训练报告({{ pdfData.hospital ? pdfData.hospital : '' }})
        </div>
        <div class="logo">
          <el-image :src="logoSrc" fit="scale-down"></el-image>
        </div>
      </div>
      <!-- 个人信息 -->
      <div class="info">
        <div class="info__title">个人信息</div>
        <div class="info__item">姓名：{{ pdfData.userName }}</div>
        <div class="info__item">性别：{{ pdfData.sex }}</div>
        <div class="info__item">训练时间：{{ pdfData.pdfTime }}</div>
      </div>
      <!-- 训练时长 -->
      <div class="train-time">
        <div class="train-time__title">训练时长</div>
        <div class="train-time__item">{{ this.pdfData.trainTime }}秒</div>
      </div>
      <!-- 结果 -->
      <div class="result">
        <div class="result__title">训练结果</div>
        <div class="result__item">本次训练得分：{{ this.score }}%</div>
      </div>
      <!--图形 -->
      <div class="chart-wrapper">
        <div class="chart">
          <div id="chart" :style="{ width: '100%', height: '100%' }"></div>
        </div>
      </div>
    </div>

    <!-- 按钮组 -->
    <div class="btn">
      <el-button class="item" type="primary" @click="handlePrint"
        >保存PDF</el-button
      >
      <el-button class="item" type="danger" @click="handleGoBack"
        >返回</el-button
      >
    </div>
  </div>
</template>

<script>
/* 计算圆的相关参数 */
import { setCircle } from '@/utils/setCircle.js'

import { initDB } from '@/db/index.js'

export default {
  name: 'train-ring-hold-pdf',

  data() {
    return {
      /* 路由传参 */
      userId: JSON.parse(this.$route.query.userId),
      pdfTime: JSON.parse(this.$route.query.pdfTime),
      routerName: JSON.parse(this.$route.query.routerName),

      /* 图形相关变量 */
      myChart: null,
      option: {},

      /* 其他 */
      fullscreenLoading: false,
      logoSrc: require('@/assets/img/Company_Logo/logo_1.png'), // 公司商标
      pdfData: {}, // 源数据

      score: 0 // 综合得分
    }
  },

  mounted() {
    this.getTrainData()
  },
  beforeDestroy() {
    // 注销echarts图形自适应监听事件
    window.removeEventListener('resize', this.resizeCharts)
  },

  methods: {
    /**
     * @description: 获取报告数据
     */
    getTrainData() {
      const db = initDB()
      this.fullscreenLoading = true
      db.train_data
        .where({
          userId: this.userId,
          pdfTime: this.pdfTime,
          type: '圆环保持训练'
        })
        .toArray()
        .then(res => {
          this.pdfData = res[0]
          const trackArray = this.pdfData.trackArray
          this.calculate(trackArray).then(() => {
            this.initChart()
            // 监听父容器的宽高变化，目的是实现echarts图形自适应父容器的宽高变化
            window.addEventListener('resize', this.resizeCharts)
          })
        })
        .catch(err => {
          this.$message({
            message: `数据获取失败：${err}`,
            type: 'error'
          })
        })
        .finally(() => {
          this.fullscreenLoading = false
        })
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

      const smallRound = setCircle(0, 0, this.pdfData.smallCircle) // 小圆
      const bigRound = setCircle(0, 0, this.pdfData.bigCircle) // 大圆

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
          // 重心移动轨迹
          {
            type: 'line',
            name: '重心移动轨迹',
            data: this.pdfData.trackArray,
            color: 'orange',
            smooth: true,
            showSymbol: false
          },
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
     * @description: 计算综合得分
     * @param {Array} trackArray
     */
    calculate(trackArray) {
      return new Promise((resolve, reject) => {
        const yesArray = [] // 圆环内
        for (let i = 0; i < trackArray.length; i++) {
          const x = trackArray[i][0]
          const y = trackArray[i][1]
          const r = parseFloat(
            Math.sqrt(Math.abs(Math.pow(x, 2) + Math.pow(y, 2))).toFixed(2)
          )
          if (r >= this.pdfData.smallCircle && r <= this.pdfData.bigCircle) {
            yesArray.push(r)
          }
        }
        this.score = parseInt(
          ((yesArray.length / trackArray.length) * 100).toFixed(0)
        )

        return resolve()
      })
    },

    /**
     * @description: 保存PDF按钮
     */
    handlePrint() {
      this.$htmlToPdf(
        'pdf',
        `圆环保持训练报告 ${this.$moment().format('YYYY-MM-DD HH_mm_ss')}`,
        400
      )
    },

    /**
     * @description: 返回按钮
     */
    handleGoBack() {
      this.$router.push({
        path: this.routerName
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
.train-ring-hold-pdf {
  width: 100%;
  height: 100%;
  @include flex(column, stretch, stretch);

  /* 打印区域 */
  .pdf-wrapper {
    padding: 10px 80px;
    flex: 1;
    @include flex(column, stretch, stretch);
    /* 大标题 */
    .top {
      @include flex(row, space-between, center);
      .title {
        font-size: 34px;
        color: green;
      }
      .logo {
        width: 220px;
      }
    }
    /* 个人信息 */
    .info {
      margin-top: 10px;
      @include flex(row, flex-start, center);
      .info__title {
        font-size: 24px;
        padding: 4px 10px;
        background-color: rgb(112, 173, 71);
        color: #ffffff;
      }
      .info__item {
        font-size: 22px;
        margin: 0 30px;
      }
    }
    /* 训练时长 */
    .train-time {
      margin-top: 10px;
      @include flex(row, flex-start, center);
      .train-time__title {
        font-size: 24px;
        padding: 4px 10px;
        background-color: rgb(112, 173, 71);
        color: #ffffff;
      }
      .train-time__item {
        font-size: 22px;
        margin: 0 30px;
      }
    }
    /* 结果 */
    .result {
      margin-top: 10px;
      @include flex(row, flex-start, center);
      .result__title {
        font-size: 24px;
        padding: 4px 10px;
        background-color: rgb(112, 173, 71);
        color: #ffffff;
      }
      .result__item {
        font-size: 22px;
        margin: 0 30px;
      }
    }
    /* 图形 */
    .chart-wrapper {
      flex: 1;
      @include flex(row, center, center);
      .chart {
        width: 30%;
        height: 100%;
      }
    }
  }

  /* 按钮组 */
  .btn {
    @include flex(row, center, center);
    margin: 0 0 20px 0;
    .item {
      font-size: 28px;
      margin: 0 40px;
    }
  }
}
</style>
