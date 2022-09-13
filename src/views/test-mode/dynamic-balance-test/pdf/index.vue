<!--
 * @Author      : Mr.bin
 * @Date        : 2022-01-05 21:42:14
 * @LastEditTime: 2022-09-12 19:57:14
 * @Description : 动态平衡测试-PDF报告
-->
<template>
  <div
    class="dynamic-balance-test-pdf"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <!-- 打印区域 -->
    <div id="pdf" class="pdf-wrapper">
      <!-- 大标题 -->
      <div class="top">
        <div class="title">动态平衡测试报告</div>
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
          动态平衡测试平均得分：{{ averageScore }}%
        </div>
      </div>
      <!-- 主区域 -->
      <div class="main">
        <!-- 测试1 -->
        <div class="item">
          <div class="res">
            左右重心转移得分：{{ scoreOne }}% {{ scoreTextOne }}
          </div>
          <div class="one-wrapper">
            <div class="chart-line-one">
              <div
                id="chart-line-one"
                :style="{ width: '100%', height: '100%' }"
              ></div>
            </div>
            <div class="chart-scatter-one">
              <div
                id="chart-scatter-one"
                :style="{ width: '100%', height: '100%' }"
              ></div>
            </div>
          </div>
          <div class="analyze">
            分析：在向{{ oneDeflection }}侧移动的过程中更难以控制，建议针对{{
              oneDeflection
            }}侧下肢稳定性进行进一步评价。
          </div>
        </div>
        <!-- 测试2 -->
        <div class="item">
          <div class="res">
            前后重心转移得分：{{ scoreTwo }}% {{ scoreTextTwo }}
          </div>
          <div class="two-wrapper">
            <div class="chart-line-two">
              <div
                id="chart-line-two"
                :style="{ width: '100%', height: '100%' }"
              ></div>
            </div>
            <div class="chart-scatter-two">
              <div
                id="chart-scatter-two"
                :style="{ width: '100%', height: '100%' }"
              ></div>
            </div>
          </div>
          <div class="analyze">
            分析：在向{{ twoDeflection }}侧移动的过程中更难以控制，建议针对{{
              twoDeflection
            }}侧下肢稳定性进行进一步评价。
          </div>
        </div>
        <!-- 测试3 -->
        <div class="item">
          <div class="res">
            交叉重心转移得分：{{ scoreThree }}% {{ scoreTextThree }}
          </div>
          <div class="three-wrapper">
            <div class="chart-line-three">
              <div
                id="chart-line-three"
                :style="{ width: '100%', height: '100%' }"
              ></div>
            </div>
            <div class="chart-scatter-three">
              <div
                id="chart-scatter-three"
                :style="{ width: '100%', height: '100%' }"
              ></div>
            </div>
          </div>
          <div class="analyze">
            分析：在向{{ threeDeflection }}侧移动的过程中更难以控制，建议针对{{
              threeDeflection
            }}侧下肢稳定性进行进一步评价。
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
  name: 'dynamic-balance-test-pdf',

  data() {
    return {
      /* 路由传参 */
      userId: JSON.parse(this.$route.query.userId),
      pdfTime: JSON.parse(this.$route.query.pdfTime),
      routerName: JSON.parse(this.$route.query.routerName),

      /* 图形相关变量 */
      myChartLineOne: null,
      myChartScatterOne: null,
      myChartLineTwo: null,
      myChartScatterTwo: null,
      myChartLineThree: null,
      myChartScatterThree: null,
      optionLineOne: {},
      optionScatterOne: {},
      optionLineTwo: {},
      optionScatterTwo: {},
      optionLineThree: {},
      optionScatterThree: {},

      /* 其他 */
      fullscreenLoading: false,
      logoSrc: require('@/assets/img/Company_Logo/logo_1.png'), // 公司商标
      pdfData: {}, // 源数据

      scoreOne: 0, // 测试1得分
      scoreTwo: 0, // 测试2得分
      scoreThree: 0, // 测试3得分
      scoreTextOne: '', // 测试1得分评价
      scoreTextTwo: '', // 测试2得分评价
      scoreTextThree: '', // 测试3得分评价

      oneDeflection: '', // 测试1偏向
      twoDeflection: '', // 测试2偏向
      threeDeflection: '', // 测试3偏向

      averageScore: 0 // 平均得分
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
          type: '动态平衡测试'
        })
        .toArray()
        .then(res => {
          this.pdfData = res[0]
          const trackArrayOne = this.pdfData.trackArrayOne
          const trackArrayTwo = this.pdfData.trackArrayTwo
          const trackArrayThree = this.pdfData.trackArrayThree
          this.calculate(trackArrayOne, trackArrayTwo, trackArrayThree).then(
            () => {
              this.initChart()
              // 监听父容器的宽高变化，目的是实现echarts图形自适应父容器的宽高变化
              window.addEventListener('resize', this.resizeCharts)
            }
          )
        })
        .catch(err => {
          this.$alert(`${err}。点击返回按钮！`, `数据获取失败`, {
            type: 'error',
            showClose: false,
            center: true,
            confirmButtonText: '返回',
            callback: () => {
              this.handleGoBack()
            }
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

      this.myChartLineOne = this.$echarts.init(
        document.getElementById('chart-line-one'),
        'light',
        {
          renderer: 'canvas'
        }
      )
      this.myChartLineTwo = this.$echarts.init(
        document.getElementById('chart-line-two'),
        'light',
        {
          renderer: 'canvas'
        }
      )
      this.myChartLineThree = this.$echarts.init(
        document.getElementById('chart-line-three'),
        'light',
        {
          renderer: 'canvas'
        }
      )

      this.myChartScatterOne = this.$echarts.init(
        document.getElementById('chart-scatter-one'),
        'dark',
        {
          renderer: 'canvas'
        }
      )
      this.myChartScatterTwo = this.$echarts.init(
        document.getElementById('chart-scatter-two'),
        'dark',
        {
          renderer: 'canvas'
        }
      )
      this.myChartScatterThree = this.$echarts.init(
        document.getElementById('chart-scatter-three'),
        'dark',
        {
          renderer: 'canvas'
        }
      )

      this.optionLineOne = {
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
            data: this.pdfData.trackArrayOne,
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
      this.optionLineTwo = {
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
            data: this.pdfData.trackArrayTwo,
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
              [parseFloat((boundaryAngle / 8).toFixed(2)), boundaryAngle - 1],
              [-parseFloat((boundaryAngle / 8).toFixed(2)), boundaryAngle - 1],
              [-parseFloat((boundaryAngle / 8).toFixed(2)), -boundaryAngle + 1],
              [parseFloat((boundaryAngle / 8).toFixed(2)), -boundaryAngle + 1],
              [parseFloat((boundaryAngle / 8).toFixed(2)), boundaryAngle - 1]
            ],
            color: '#2E75B6',
            smooth: false,
            showSymbol: false
          }
        ],
        animation: false
      }
      this.optionLineThree = {
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
            data: this.pdfData.trackArrayThree,
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
          // 线框1
          {
            type: 'line',
            name: '线框1',
            data: [
              [
                parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 +
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                ),
                parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 -
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                )
              ],
              [
                parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 -
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                ),
                parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 +
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                )
              ],
              [
                -parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 +
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                ),
                -parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 -
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                )
              ],
              [
                -parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 -
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                ),
                -parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 +
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                )
              ],
              [
                parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 +
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                ),
                parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 -
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                )
              ]
            ],
            color: '#2E75B6',
            smooth: false,
            showSymbol: false
          },
          // 线框2
          {
            type: 'line',
            name: '线框2',
            data: [
              [
                -parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 +
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                ),
                parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 -
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                )
              ],
              [
                -parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 -
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                ),
                parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 +
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                )
              ],
              [
                parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 +
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                ),
                -parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 -
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                )
              ],
              [
                parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 -
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                ),
                -parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 +
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                )
              ],
              [
                -parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 +
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                ),
                parseFloat(
                  (
                    (boundaryAngle - 1) / 1.414 -
                    boundaryAngle / 8 / 1.414
                  ).toFixed(2)
                )
              ]
            ],
            color: '#2E75B6',
            smooth: false,
            showSymbol: false
          }
        ],
        animation: false
      }

      this.optionScatterOne = {
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
            data: this.pdfData.trackArrayOne,
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
      this.optionScatterTwo = {
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
            data: this.pdfData.trackArrayTwo,
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
      this.optionScatterThree = {
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
            data: this.pdfData.trackArrayThree,
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

      this.myChartLineOne.setOption(this.optionLineOne)
      this.myChartLineTwo.setOption(this.optionLineTwo)
      this.myChartLineThree.setOption(this.optionLineThree)
      this.myChartScatterOne.setOption(this.optionScatterOne)
      this.myChartScatterTwo.setOption(this.optionScatterTwo)
      this.myChartScatterThree.setOption(this.optionScatterThree)
    },

    /**
     * @description: 计算各种数值逻辑函数
     * @param {Array} trackArrayOne 测试1数组
     * @param {Array} trackArrayTwo 测试2数组
     * @param {Array} trackArrayThree 测试3数组
     */
    calculate(trackArrayOne, trackArrayTwo, trackArrayThree) {
      return new Promise((resolve, reject) => {
        /* 计算得分和评价 */
        const boundaryAngle = parseFloat(
          window.localStorage.getItem('boundaryAngle')
        ) // 最大角度

        const oneYes = []
        for (let i = 0; i < trackArrayOne.length; i++) {
          const x = trackArrayOne[i][0]
          const y = trackArrayOne[i][1]
          if (x >= -(boundaryAngle - 1) && x <= boundaryAngle - 1) {
            if (
              y >= -parseFloat((boundaryAngle / 8).toFixed(2)) &&
              y <= parseFloat((boundaryAngle / 8).toFixed(2))
            ) {
              oneYes.push(1)
            }
          }
        }
        this.scoreOne = parseInt(
          ((oneYes.length / trackArrayOne.length) * 100).toFixed(0)
        )
        if (this.scoreOne < 40) {
          this.scoreTextOne = '差'
        } else if (this.scoreOne >= 40 && this.scoreOne < 60) {
          this.scoreTextOne = '较差'
        } else if (this.scoreOne >= 60 && this.scoreOne < 80) {
          this.scoreTextOne = '一般'
        } else if (this.scoreOne >= 80 && this.scoreOne <= 100) {
          this.scoreTextOne = '优秀'
        } else {
          this.scoreTextOne = ''
        }

        const twoYes = []
        for (let i = 0; i < trackArrayTwo.length; i++) {
          const x = trackArrayTwo[i][0]
          const y = trackArrayTwo[i][1]
          if (
            x >= -parseFloat((boundaryAngle / 8).toFixed(2)) &&
            x <= parseFloat((boundaryAngle / 8).toFixed(2))
          ) {
            if (y >= -(boundaryAngle - 1) && y <= boundaryAngle - 1) {
              twoYes.push(1)
            }
          }
        }
        this.scoreTwo = parseInt(
          ((twoYes.length / trackArrayTwo.length) * 100).toFixed(0)
        )
        if (this.scoreTwo < 40) {
          this.scoreTextTwo = '差'
        } else if (this.scoreTwo >= 40 && this.scoreTwo < 60) {
          this.scoreTextTwo = '较差'
        } else if (this.scoreTwo >= 60 && this.scoreTwo < 80) {
          this.scoreTextTwo = '一般'
        } else if (this.scoreTwo >= 80 && this.scoreTwo <= 100) {
          this.scoreTextTwo = '优秀'
        } else {
          this.scoreTextTwo = ''
        }

        const threeYes = []
        for (let i = 0; i < trackArrayThree.length; i++) {
          const x = trackArrayThree[i][0]
          const y = trackArrayThree[i][1]
          if (x > 0) {
            if (y > 0) {
              let y1up =
                x + parseFloat(((boundaryAngle / 8) * 1.414).toFixed(2))
              let y1down =
                x - parseFloat(((boundaryAngle / 8) * 1.414).toFixed(2))
              if (y >= y1down && y <= y1up) {
                threeYes.push(1)
              }
            } else if (y < 0) {
              let y2up =
                -x + parseFloat(((boundaryAngle / 8) * 1.414).toFixed(2))
              let y2down =
                -x - parseFloat(((boundaryAngle / 8) * 1.414).toFixed(2))
              if (y >= y2down && y <= y2up) {
                threeYes.push(1)
              }
            }
          } else if (x < 0) {
            if (y > 0) {
              let y3up =
                -x + parseFloat(((boundaryAngle / 8) * 1.414).toFixed(2))
              let y3down =
                -x - parseFloat(((boundaryAngle / 8) * 1.414).toFixed(2))
              if (y >= y3down && y <= y3up) {
                threeYes.push(1)
              }
            } else if (y < 0) {
              let y4up =
                x + parseFloat(((boundaryAngle / 8) * 1.414).toFixed(2))
              let y4down =
                x - parseFloat(((boundaryAngle / 8) * 1.414).toFixed(2))
              if (y >= y4down && y <= y4up) {
                threeYes.push(1)
              }
            }
          }
        }
        this.scoreThree = parseInt(
          ((threeYes.length / trackArrayThree.length) * 100).toFixed(0)
        )
        if (this.scoreThree < 40) {
          this.scoreTextThree = '差'
        } else if (this.scoreThree >= 40 && this.scoreThree < 60) {
          this.scoreTextThree = '较差'
        } else if (this.scoreThree >= 60 && this.scoreThree < 80) {
          this.scoreTextThree = '一般'
        } else if (this.scoreThree >= 80 && this.scoreThree <= 100) {
          this.scoreTextThree = '优秀'
        } else {
          this.scoreTextThree = ''
        }

        /* 计算平均得分 */
        this.averageScore = parseInt(
          ((this.scoreOne + this.scoreTwo + this.scoreThree) / 3).toFixed(0)
        )

        /* 计算偏向 */
        const oneLeft = [] // 左
        const oneRight = [] // 右
        for (let i = 0; i < trackArrayOne.length; i++) {
          const x = trackArrayOne[i][0]
          if (x < 0) {
            oneLeft.push(x)
          } else if (x > 0) {
            oneRight.push(x)
          }
        }
        if (oneLeft.length > oneRight.length) {
          this.oneDeflection = '左'
        } else if (oneLeft.length <= oneRight.length) {
          this.oneDeflection = '右'
        }

        const twoFront = [] // 前
        const twoBack = [] // 后
        for (let i = 0; i < trackArrayTwo.length; i++) {
          const y = trackArrayTwo[i][1]
          if (y < 0) {
            twoBack.push(y)
          } else if (y > 0) {
            twoFront.push(y)
          }
        }
        if (twoFront.length >= twoBack.length) {
          this.twoDeflection = '前'
        } else if (twoFront.length < twoBack.length) {
          this.twoDeflection = '后'
        }

        const threeLeft = [] // 左
        const threeRight = [] // 右
        const threeFront = [] // 前
        const threeBack = [] // 后
        for (let i = 0; i < trackArrayThree.length; i++) {
          const x = trackArrayThree[i][0]
          const y = trackArrayThree[i][1]
          if (x < 0) {
            threeLeft.push(x)
          } else if (x > 0) {
            threeRight.push(x)
          }
          if (y < 0) {
            threeBack.push(y)
          } else if (y > 0) {
            threeFront.push(y)
          }
        }
        if (threeLeft.length > threeRight.length) {
          this.threeDeflection = '左'
        } else if (threeLeft.length <= threeRight.length) {
          this.threeDeflection = '右'
        }
        if (threeFront.length >= threeBack.length) {
          this.threeDeflection = this.threeDeflection + '前'
        } else if (threeFront.length < threeBack.length) {
          this.threeDeflection = this.threeDeflection + '后'
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
        `动态平衡测试报告 ${this.$moment().format('YYYY-MM-DD HH_mm_ss')}`,
        470
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
      if (this.myChartLineOne) {
        this.myChartLineOne.resize()
      }
      if (this.myChartLineTwo) {
        this.myChartLineTwo.resize()
      }
      if (this.myChartLineThree) {
        this.myChartLineThree.resize()
      }
      if (this.myChartScatterOne) {
        this.myChartScatterOne.resize()
      }
      if (this.myChartScatterTwo) {
        this.myChartScatterTwo.resize()
      }
      if (this.myChartScatterThree) {
        this.myChartScatterThree.resize()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dynamic-balance-test-pdf {
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
      margin-top: 30px;
      flex: 1;
      @include flex(row, space-between, stretch);
      .item {
        border: 1px solid green;
        width: 33%;
        @include flex(column, flex-start, center);
      }
      .res {
        padding-top: 4px;
        font-size: 20px;
      }
      .analyze {
        font-size: 20px;
        width: 90%;
        padding-bottom: 4px;
      }
      .one-wrapper {
        width: 100%;
        flex: 1;
        @include flex(row, space-between, center);
        padding: 0 10px;
        .chart-line-one {
          width: 50%;
          height: 90%;
        }
        .chart-scatter-one {
          width: 50%;
          height: 60%;
        }
      }
      .two-wrapper {
        width: 100%;
        flex: 1;
        @include flex(row, space-between, center);
        padding: 0 10px;
        .chart-line-two {
          width: 50%;
          height: 90%;
        }
        .chart-scatter-two {
          width: 50%;
          height: 60%;
        }
      }
      .three-wrapper {
        width: 100%;
        flex: 1;
        @include flex(row, space-between, center);
        padding: 0 10px;
        .chart-line-three {
          width: 50%;
          height: 90%;
        }
        .chart-scatter-three {
          width: 50%;
          height: 60%;
        }
      }
    }
  }

  /* 按钮组 */
  .btn {
    margin: 20px 0;
    @include flex(row, center, center);
    .btn__item {
      font-size: 28px;
      margin: 0 40px;
    }
  }
}
</style>
