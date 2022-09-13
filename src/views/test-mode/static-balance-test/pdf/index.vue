<!--
 * @Author      : Mr.bin
 * @Date        : 2021-12-22 20:06:59
 * @LastEditTime: 2022-09-12 19:53:59
 * @Description : 静态平衡测试-PDF报告
-->
<template>
  <div
    class="static-balance-test-pdf"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <!-- 打印区域 -->
    <div id="pdf" class="pdf-wrapper">
      <!-- 大标题 -->
      <div class="top">
        <div class="title">静态平衡测试报告</div>
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
        <div class="result__item" v-if="lr && !fb">
          测试过程中姿势偏向于<span :style="{ color: '#B65DCF' }">{{ lr }}</span
          >侧，综合得分{{ score }}%，{{ scoreText }}。
        </div>
        <div class="result__item" v-if="fb && !lr">
          测试过程中姿势偏向于<span :style="{ color: '#B65DCF' }">{{ fb }}</span
          >侧，综合得分{{ score }}%，{{ scoreText }}。
        </div>
        <div class="result__item" v-if="lr && fb">
          测试过程中姿势偏向于<span :style="{ color: '#B65DCF' }"
            >{{ lr }}、{{ fb }}</span
          >侧，综合得分{{ score }}%，{{ scoreText }}。
        </div>
        <div class="result__item" v-if="!lr && !fb">
          测试过程中姿势无偏向，综合得分{{ score }}%，{{ scoreText }}。
        </div>
      </div>
      <!-- 主区域 -->
      <div class="main">
        <div class="chart-line">
          <div id="chart-line" :style="{ width: '100%', height: '100%' }"></div>
        </div>
        <div class="right">
          <div class="right-top">
            <div class="headline">平均偏移角度</div>
            <div class="content">
              <div class="item">
                <div class="title">前</div>
                <div class="value">{{ frontAverageAngle }}°</div>
              </div>
              <div class="item">
                <div class="title">后</div>
                <div class="value">{{ backAverageAngle }}°</div>
              </div>
              <div class="item">
                <div class="title">左</div>
                <div class="value">{{ leftAverageAngle }}°</div>
              </div>
              <div class="item">
                <div class="title">右</div>
                <div class="value">{{ rightAverageAngle }}°</div>
              </div>
            </div>
          </div>
          <div class="right-down">
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
    </div>

    <!-- 按钮组 -->
    <div class="btn">
      <el-button class="btn__item" type="primary" @click="handlePrint"
        >保存PDF</el-button
      >
      <el-button class="btn__item" type="danger" @click="handleGoBack"
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
  name: 'static-balance-test-pdf',

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

      lr: '', // 左右偏向
      fb: '', // 前后偏向

      score: 0, // 综合得分
      scoreText: '暂无评价', // 得分评价

      leftAverageAngle: 0, // 左平均偏移角度
      rightAverageAngle: 0, // 右平均偏移角度
      frontAverageAngle: 0, // 前平均偏移角度
      backAverageAngle: 0 // 后平均偏移角度
    }
  },

  created() {
    this.$store.dispatch('setIsCollapse', true)
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
          type: '静态平衡测试'
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
      const oneRound = setCircle(
        0,
        0,
        parseFloat((boundaryAngle / 4).toFixed(2))
      ) // 第一个圆
      const twoRound = setCircle(
        0,
        0,
        parseFloat((boundaryAngle / 2).toFixed(2))
      ) // 第二个圆

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
          // 第一个圆
          {
            type: 'line',
            name: '第一个圆',
            data: oneRound,
            color: 'green',
            smooth: true,
            showSymbol: false
          },
          // 第二个圆
          {
            type: 'line',
            name: '第二个圆',
            data: twoRound,
            color: 'blue',
            smooth: true,
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
        /* 计算综合得分和评价 */
        const boundaryAngle = parseFloat(
          window.localStorage.getItem('boundaryAngle')
        ) // 最大角度

        const oneArray = [] // 圈一内
        const twoArray = [] // 圈二内、圈一外
        const threeArray = [] // 圈二外
        for (let i = 0; i < trackArray.length; i++) {
          const x = trackArray[i][0]
          const y = trackArray[i][1]
          const r = parseFloat(
            Math.sqrt(Math.abs(Math.pow(x, 2) + Math.pow(y, 2))).toFixed(2)
          )
          if (r >= 0 && r <= parseFloat((boundaryAngle / 4).toFixed(2))) {
            oneArray.push(r)
          } else if (
            r > parseFloat((boundaryAngle / 4).toFixed(2)) &&
            r <= parseFloat((boundaryAngle / 2).toFixed(2))
          ) {
            twoArray.push(r)
          } else {
            threeArray.push(r)
          }
        }
        this.score = parseInt(
          (
            ((oneArray.length * 10 +
              twoArray.length * 5 +
              threeArray.length * 0) /
              (trackArray.length * 10)) *
            100
          ).toFixed(0)
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
          this.scoreText = '暂无评价'
        }

        const xLeft = [] // 左
        const xRight = [] // 右
        const yFront = [] // 前
        const yBack = [] // 后
        for (let i = 0; i < trackArray.length; i++) {
          const x = trackArray[i][0]
          const y = trackArray[i][1]
          if (x < 0) {
            xLeft.push(x)
          } else if (x > 0) {
            xRight.push(x)
          }
          if (y < 0) {
            yBack.push(y)
          } else if (y > 0) {
            yFront.push(y)
          }
        }

        /* 计算平均偏移角度 */
        if (xLeft.length) {
          this.leftAverageAngle = Math.abs(
            parseFloat(
              (
                xLeft.reduce((total, currentValue) => total + currentValue, 0) /
                xLeft.length
              ).toFixed(1)
            )
          )
        } else {
          this.leftAverageAngle = 0
        }
        if (xRight.length) {
          this.rightAverageAngle = Math.abs(
            parseFloat(
              (
                xRight.reduce(
                  (total, currentValue) => total + currentValue,
                  0
                ) / xRight.length
              ).toFixed(1)
            )
          )
        } else {
          this.rightAverageAngle = 0
        }
        if (yFront.length) {
          this.frontAverageAngle = Math.abs(
            parseFloat(
              (
                yFront.reduce(
                  (total, currentValue) => total + currentValue,
                  0
                ) / yFront.length
              ).toFixed(1)
            )
          )
        } else {
          this.frontAverageAngle = 0
        }
        if (yBack.length) {
          this.backAverageAngle = Math.abs(
            parseFloat(
              (
                yBack.reduce((total, currentValue) => total + currentValue, 0) /
                yBack.length
              ).toFixed(1)
            )
          )
        } else {
          this.backAverageAngle = 0
        }

        /* 计算偏向 */
        if (this.leftAverageAngle > this.rightAverageAngle) {
          this.lr = '左'
        } else if (this.leftAverageAngle < this.rightAverageAngle) {
          this.lr = '右'
        } else {
          this.lr = ''
        }
        if (this.backAverageAngle > this.frontAverageAngle) {
          this.fb = '后'
        } else if (this.backAverageAngle < this.frontAverageAngle) {
          this.fb = '前'
        } else {
          this.fb = ''
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
        `静态平衡测试报告 ${this.$moment().format('YYYY-MM-DD HH_mm_ss')}`,
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
.static-balance-test-pdf {
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
    /* 主区域 */
    .main {
      margin-top: 10px;
      flex: 1;
      @include flex(row, space-around, stretch);
      .chart-line {
        width: 28%;
        height: 100%;
      }
      .right {
        @include flex(column, stretch, center);
        width: 40%;
        .right-top {
          @include flex(column, center, center);
          .headline {
            font-size: 24px;
            font-weight: 700;
          }
          .content {
            margin-top: 5px;
            @include flex(row, center, center);
            .item {
              @include flex(column, center, center);
              font-size: 28px;
              margin: 0 1px;
              .title {
                @include flex(row, center, center);
                width: 120px;
                padding: 4px 0;
                background-color: #70ad47;
                color: #ffffff;
                font-weight: 700;
              }
              .value {
                @include flex(row, center, center);
                width: 120px;
                padding: 4px 0;
                margin-top: 4px;
                background-color: #d5e3cf;
              }
            }
          }
        }
        .right-down {
          width: 100%;
          height: 100%;
          margin-top: 20px;
          @include flex(column, center, center);
          .headline {
            font-size: 24px;
            font-weight: 700;
          }
          .chart-scatter {
            margin-top: 5px;
            width: 46%;
            height: 100%;
          }
        }
      }
    }
  }

  /* 按钮组 */
  .btn {
    @include flex(row, center, center);
    margin: 20px 0;
    .btn__item {
      font-size: 28px;
      margin: 0 40px;
    }
  }
}
</style>
