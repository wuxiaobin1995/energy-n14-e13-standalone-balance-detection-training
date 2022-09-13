<!--
 * @Author      : Mr.bin
 * @Date        : 2022-01-05 14:09:57
 * @LastEditTime: 2022-07-26 15:02:51
 * @Description : 动态平衡测试-测量2
-->
<template>
  <div class="dynamic-balance-test-measure-two">
    <!-- 标题 -->
    <div class="title">动态平衡测试</div>

    <!-- 测试类型 -->
    <div class="type">测试内容：前后重心转移</div>

    <!-- 主体 -->
    <div class="main">
      <!-- 参数 -->
      <div class="parameter">
        <div class="parameter__visual">
          视觉反馈：{{ isVisual === true ? '有' : '无' }}
        </div>
        <div class="parameter__barycenter">
          重心轨迹：{{ isBarycenter === true ? '有' : '无' }}
        </div>
        <div class="parameter__time">测试时长：{{ testTime }}秒</div>
      </div>

      <!-- 图形区 -->
      <div class="chart" v-show="isVisual">
        <div id="chart" :style="{ width: '100%', height: '100%' }"></div>
      </div>

      <!-- 倒计时 -->
      <div class="count-down">
        <div class="count-down__text">倒 计 时</div>
        <div class="count-down__nowTime">{{ nowTime }} S</div>
      </div>
    </div>

    <!-- 按钮组 -->
    <div class="btn">
      <el-button
        class="btn__item"
        :disabled="isStarting"
        round
        type="primary"
        @click="handleStart"
        >开始测试</el-button
      >
      <el-button
        class="btn__item"
        :disabled="!isStarting"
        round
        type="danger"
        @click="handleFinish"
        >结束测试</el-button
      >
      <el-button
        class="btn__item"
        :disabled="!isFinish"
        round
        type="success"
        @click="handleToNext"
        >下一项</el-button
      >
      <el-button class="btn__item" round type="info" @click="handleGoBack"
        >返回</el-button
      >
    </div>
  </div>
</template>

<script>
/* 计算圆的相关参数 */
import { setCircle } from '@/utils/setCircle.js'

/* 串口通信库 */
import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

export default {
  name: 'dynamic-balance-test-measure-two',

  data() {
    return {
      /* 路由传参 */
      testTime: JSON.parse(this.$route.query.testTime), // 测试时长
      isVisual: JSON.parse(this.$route.query.isVisual), // 是否开启视觉反馈
      isBarycenter: JSON.parse(this.$route.query.isBarycenter), // 是否开启重心轨迹

      /* 按钮控制 */
      isStarting: false, // 是否正在开始体验
      isFinish: false, // 是否完成了体验

      /* 串口相关 */
      usbPort: null,
      parser: null,
      scmBaudRate: 115200,

      /* 图形相关变量 */
      myChart: null,
      option: {},

      /* 其他 */
      timeClock: null, // 倒计时计时器
      nowTime: JSON.parse(this.$route.query.testTime), // 倒计时
      trackArray: [], // 轨迹数组

      xStandard: null,
      yStandard: null
    }
  },

  created() {
    this.$store.dispatch('setIsCollapse', true)

    this.xStandard = this.$store.state.zeroStandard.xStandard
    this.yStandard = this.$store.state.zeroStandard.yStandard

    this.initSerialPort() // 初始化串口对象
  },
  mounted() {
    this.initChart() // 初始化echarts图形
    // 监听父容器的宽高变化，目的是实现echarts图形自适应父容器的宽高变化
    window.addEventListener('resize', this.resizeCharts)
  },
  beforeDestroy() {
    // 清除计时器
    if (this.timeClock) {
      clearInterval(this.timeClock)
    }
    // 关闭串口
    if (this.usbPort) {
      if (this.usbPort.isOpen) {
        this.usbPort.close()
      }
    }
    // 注销echarts图形自适应监听事件
    window.removeEventListener('resize', this.resizeCharts)
  },

  methods: {
    /**
     * @description: 初始化串口对象
     */
    initSerialPort() {
      SerialPort.list()
        .then(ports => {
          /* 遍历设备的USB串口，目标设备需安装驱动 */
          let comPath = ''
          for (const port of ports) {
            if (/^USB/.test(port.pnpId)) {
              comPath = port.path
              break
            }
          }

          /* 验证USB有没有连接到电脑，但不能验证有无数据发送给上位机 */
          if (comPath) {
            /**
             * @description: 创建串口实例
             * @param {String} comPath 串行端口的系统路径。例如：在Mac、Linux上的/dev/tty.XXX或Windows上的COM1
             * @param {Object} 配置项
             */
            this.usbPort = new SerialPort(comPath, {
              baudRate: this.scmBaudRate, // 默认波特率115200
              autoOpen: false // 是否自动开启串口
            })
            /* 调用 this.usbPort.open() 成功时触发（开启串口成功） */
            this.usbPort.on('open', () => {})
            /* 调用 this.usbPort.open() 失败时触发（开启串口失败） */
            this.usbPort.on('error', () => {
              this.$alert(
                `请重新连接USB线，然后点击"返回"按钮，重新尝试！`,
                '串口开启失败',
                {
                  type: 'error',
                  showClose: false,
                  center: true,
                  confirmButtonText: '返回',
                  callback: () => {
                    this.handleGoBack()
                  }
                }
              )
            })

            /* Readline解析器将数据转换成字符串 */
            this.parser = this.usbPort.pipe(new Readline({ delimiter: '\n' }))
            this.parser.on('data', data => {
              const dataArray = data.split(',')
              const x = parseFloat(dataArray[0]) // 绕Y角度，左右
              const y = parseFloat(dataArray[1]) // 绕X角度，前后

              /* 数据验证 */
              if (!isNaN(x) && !isNaN(y)) {
                const xCalibration = parseFloat((x - this.xStandard).toFixed(2))
                const yCalibration = parseFloat((y - this.yStandard).toFixed(2))

                this.trackArray.push([xCalibration, yCalibration])

                if (this.isBarycenter) {
                  this.option.series[0].data = this.trackArray
                  this.myChart.setOption(this.option)
                }
              }
            })
          } else {
            this.$alert(
              `请重新连接USB线，然后点击"返回"按钮，重新尝试！`,
              '没有检测到USB连接',
              {
                type: 'error',
                showClose: false,
                center: true,
                confirmButtonText: '返回',
                callback: () => {
                  this.handleGoBack()
                }
              }
            )
          }
        })
        .catch(err => {
          this.$alert(
            `${err}。请重新连接USB线，然后点击"返回"按钮，重新尝试！`,
            '初始化SerialPort.list失败',
            {
              type: 'error',
              showClose: false,
              center: true,
              confirmButtonText: '返回',
              callback: () => {
                this.handleGoBack()
              }
            }
          )
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
        // tooltip: {},
        series: [
          // 重心移动轨迹
          {
            type: 'line',
            name: '重心移动轨迹',
            data: [],
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
      this.myChart.setOption(this.option)
    },

    /**
     * @description: 保存数据逻辑函数
     */
    saveData() {
      // 清除计时器
      if (this.timeClock) {
        clearInterval(this.timeClock)
      }

      this.usbPort.write('N')

      this.isStarting = false
      this.nowTime = this.testTime

      // 数据暂存到sessionStorage中
      const sessionData = JSON.stringify(this.trackArray)
      window.sessionStorage.setItem(
        'dynamic-balance-test-measure-two',
        sessionData
      )
      const getSessionData = JSON.parse(
        window.sessionStorage.getItem('dynamic-balance-test-measure-two')
      )
      if (getSessionData.length) {
        this.isFinish = true
        this.$message({
          message: '数据暂存成功',
          type: 'success',
          duration: 2500
        })
      } else {
        this.isFinish = false
        this.$message({
          message: '数据暂存失败，请重新测量！',
          type: 'error'
        })
      }
    },

    /**
     * @description: 开始测试
     */
    handleStart() {
      this.isFinish = false
      this.isStarting = true
      this.nowTime = this.testTime
      this.trackArray = []

      if (this.usbPort) {
        if (!this.usbPort.isOpen) {
          this.usbPort.open()
        }
      }

      this.usbPort.write('Y')

      // 倒计时计时器
      this.timeClock = setInterval(() => {
        this.nowTime -= 1
        if (this.nowTime === 0) {
          this.saveData()
        }
      }, 1000)
    },

    /**
     * @description: 结束测试
     */
    handleFinish() {
      this.saveData()
    },

    /**
     * @description: 下一项
     */
    handleToNext() {
      this.$router.push({
        path: '/layout/dynamic-balance-test-experience-three',
        query: {
          testTime: JSON.stringify(this.testTime), // 测试时长
          isVisual: JSON.stringify(this.isVisual), // 是否开启视觉反馈
          isBarycenter: JSON.stringify(this.isBarycenter) // 是否开启重心轨迹
        }
      })
    },

    /**
     * @description: 返回
     */
    handleGoBack() {
      this.$router.push({
        path: '/layout/dynamic-balance-test-set'
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
.dynamic-balance-test-measure-two {
  width: 100%;
  height: 100%;
  padding: 20px 100px;
  @include flex(column, stretch, stretch);

  /* 标题 */
  .title {
    font-size: 36px;
    color: green;
  }

  /* 测试类型 */
  .type {
    margin-top: 20px;
    font-size: 22px;
  }

  /* 主体 */
  .main {
    flex: 1;
    @include flex(row, space-between, center);
    // 参数
    .parameter {
      width: 20%;
      .parameter__visual {
        font-size: 22px;
      }
      .parameter__barycenter {
        margin-top: 100px;
        font-size: 22px;
      }
      .parameter__time {
        margin-top: 100px;
        font-size: 22px;
      }
    }

    // 图形区
    .chart {
      width: 30vw;
      height: 63vh;
    }

    // 倒计时
    .count-down {
      width: 20%;
      @include flex(column, center, center);
      .count-down__text {
        font-size: 28px;
      }
      .count-down__nowTime {
        margin-top: 10px;
        padding: 4px 0;
        width: 100px;
        background-color: rgb(112, 173, 71);
        @include flex(row, center, center);
        font-size: 28px;
        color: #ffffff;
      }
    }
  }

  /* 按钮组 */
  .btn {
    @include flex(row, center, center);
    .btn__item {
      font-size: 30px;
      margin: 0 40px;
    }
  }
}
</style>
