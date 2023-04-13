<!--
 * @Author      : Mr.bin
 * @Date        : 2021-12-22 20:06:59
 * @LastEditTime: 2023-04-12 15:03:58
 * @Description : 左右平衡测试-PDF报告
-->
<template>
  <div
    class="test-lr-balance-pdf"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <!-- 打印区域 -->
    <div id="pdf" class="pdf-wrapper">
      <!-- 大标题 -->
      <div class="top">
        <div class="title">
          左右平衡测试报告({{ pdfData.hospital ? pdfData.hospital : '' }})
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
        <div class="info__item">测试时间：{{ pdfData.pdfTime }}</div>
      </div>

      <!-- 参数 -->
      <div class="argument">
        <div class="argument__title">测试参数</div>
        <div class="argument__item">
          视觉反馈：{{ pdfData.isVisual === true ? '有' : '无' }}
        </div>
        <div class="argument__item">
          重心轨迹：{{ pdfData.isBarycenter === true ? '有' : '无' }}
        </div>
        <div class="argument__item">测试时长：{{ pdfData.testTime }} 秒</div>
      </div>

      <!-- 结果 -->
      <div class="result">
        <div class="result__title">测试结果</div>
        <div class="result__item">
          左右平衡测试得分为{{ score }}%，表现{{ scoreText }}
        </div>
      </div>

      <!-- 分析建议 -->
      <div class="analyze">
        <div class="analyze__title">分析建议</div>
        <div class="analyze__item">
          在向“{{ deflection }}侧”移动的过程中更难以控制，建议针对{{
            deflection
          }}侧下肢稳定性进行进一步锻炼
        </div>
      </div>

      <!-- 主区域 -->
      <div class="main">
        <div class="chart-line">
          <div id="chart-line" :style="{ width: '100%', height: '100%' }"></div>
        </div>
        <div class="right">
          <div class="headline">重心分布图</div>
          <div class="chart-scatter">
            <div
              id="chart-scatter"
              :style="{ width: '100%', height: '100%' }"
            ></div>
          </div>
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
  name: 'test-lr-balance-pdf',

  data() {
    return {
      /* 路由传参 */
      userId: JSON.parse(this.$route.query.userId),
      pdfTime: JSON.parse(this.$route.query.pdfTime),
      routerName: JSON.parse(this.$route.query.routerName),

      /* 图形相关变量 */
      myChartLine: null,
      myChartScatter: null,
      optionLine: {},
      optionScatter: {},

      /* 其他 */
      fullscreenLoading: false,
      logoSrc: require('@/assets/img/Company_Logo/logo_1.png'), // 公司商标
      pdfData: {}, // 源数据

      score: 0, // 得分
      scoreText: '', // 评价
      deflection: '' // 偏向
    }
  },

  mounted() {
    this.getTestData()
  },
  beforeDestroy() {
    // 注销echarts图形自适应监听事件
    window.removeEventListener('resize', this.resizeCharts)
  },

  methods: {
    /**
     * @description: 获取报告数据
     */
    getTestData() {
      const db = initDB()
      this.fullscreenLoading = true
      db.test_data
        .where({
          userId: this.userId,
          pdfTime: this.pdfTime,
          type: '左右平衡测试'
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

      this.myChartLine = this.$echarts.init(
        document.getElementById('chart-line'),
        'light',
        {
          renderer: 'canvas'
        }
      )

      this.myChartScatter = this.$echarts.init(
        document.getElementById('chart-scatter'),
        'dark',
        {
          renderer: 'canvas'
        }
      )

      this.optionLine = {
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
        // tooltip: {},
        series: [
          // 重心移动轨迹
          {
            type: 'line',
            name: '重心移动轨迹',
            data: this.pdfData.trackArray,
            color: 'red',
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
          // 线框
          {
            type: 'line',
            name: '线框',
            data: [
              [boundaryAngle - 1, parseFloat((boundaryAngle / 8).toFixed(2))],
              [-boundaryAngle + 1, parseFloat((boundaryAngle / 8).toFixed(2))],
              [-boundaryAngle + 1, -parseFloat((boundaryAngle / 8).toFixed(2))],
              [boundaryAngle - 1, -parseFloat((boundaryAngle / 8).toFixed(2))],
              [boundaryAngle - 1, parseFloat((boundaryAngle / 8).toFixed(2))]
            ],
            color: '#2E75B6',
            smooth: false,
            showSymbol: false
          }
        ],
        animation: false
      }

      this.optionScatter = {
        grid: {
          left: '10%',
          right: '10%',
          top: '10%',
          bottom: '10%'
        },
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
          // 重心分布散点
          {
            type: 'scatter',
            symbolSize: 4,
            name: '重心分布散点',
            data: this.pdfData.trackArray,
            color: 'red',
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
          }
        ],
        animation: false
      }

      this.myChartLine.setOption(this.optionLine)
      this.myChartScatter.setOption(this.optionScatter)
    },

    /**
     * @description: 计算各种数值逻辑函数
     * @param {Array} trackArray
     */
    calculate(trackArray) {
      return new Promise((resolve, reject) => {
        const boundaryAngle = parseFloat(
          window.localStorage.getItem('boundaryAngle')
        ) // 最大角度

        /* 计算得分和评价 */
        const yes = []
        for (let i = 0; i < trackArray.length; i++) {
          const x = trackArray[i][0]
          const y = trackArray[i][1]
          if (x >= -(boundaryAngle - 1) && x <= boundaryAngle - 1) {
            if (
              y >= -parseFloat((boundaryAngle / 8).toFixed(2)) &&
              y <= parseFloat((boundaryAngle / 8).toFixed(2))
            ) {
              yes.push(1)
            }
          }
        }
        this.score = parseInt(
          ((yes.length / trackArray.length) * 100).toFixed(0)
        )
        if (this.score < 40) {
          this.scoreText = '差'
        } else if (this.score >= 40 && this.score < 60) {
          this.scoreText = '较差'
        } else if (this.score >= 60 && this.score < 80) {
          this.scoreText = '一般'
        } else if (this.score >= 80 && this.score <= 100) {
          this.scoreText = '优秀'
        } else {
          this.scoreText = ''
        }

        /* 计算偏向 */
        const left = [] // 左
        const right = [] // 右
        for (let i = 0; i < trackArray.length; i++) {
          const x = trackArray[i][0]
          if (x < 0) {
            left.push(x)
          } else if (x > 0) {
            right.push(x)
          }
        }
        if (left.length > right.length) {
          this.deflection = '左'
        } else if (left.length <= right.length) {
          this.deflection = '右'
        }

        return resolve()
      })
    },

    /**
     * @description: 保存PDF按钮
     */
    handlePrint() {
      this.$htmlToPdf(
        'pdf',
        `左右平衡测试报告 ${this.$moment().format('YYYY-MM-DD HH_mm_ss')}`,
        420
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
      if (this.myChartLine) {
        this.myChartLine.resize()
      }
      if (this.myChartScatter) {
        this.myChartScatter.resize()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.test-lr-balance-pdf {
  width: 100%;
  height: 100%;
  @include flex(column, stretch, stretch);

  /* 打印区域 */
  .pdf-wrapper {
    padding: 10px 40px;
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

    /* 参数 */
    .argument {
      margin-top: 10px;
      @include flex(row, flex-start, center);
      .argument__title {
        font-size: 24px;
        padding: 4px 10px;
        background-color: rgb(112, 173, 71);
        color: #ffffff;
      }
      .argument__item {
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

    /* 分析建议 */
    .analyze {
      margin-top: 10px;
      @include flex(row, flex-start, center);
      .analyze__title {
        font-size: 24px;
        padding: 4px 10px;
        background-color: rgb(112, 173, 71);
        color: #ffffff;
      }
      .analyze__item {
        font-size: 22px;
        margin: 0 30px;
      }
    }

    /* 主区域 */
    .main {
      margin-top: 10px;
      flex: 1;
      @include flex(row, space-around, stretch);
      .chart-line {
        width: 25%;
        height: 100%;
      }
      .right {
        @include flex(column, stretch, center);
        width: 40%;
        margin-top: 20px;
        @include flex(column, center, center);
        .headline {
          font-size: 24px;
          font-weight: 700;
        }
        .chart-scatter {
          margin-top: 5px;
          width: 46%;
          height: 70%;
        }
      }
    }
  }

  /* 按钮组 */
  .btn {
    @include flex(row, center, center);
    margin: 20px 0;
    .item {
      font-size: 28px;
      margin: 0 40px;
    }
  }
}
</style>
