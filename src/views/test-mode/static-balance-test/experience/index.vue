<!--
 * @Author      : Mr.bin
 * @Date        : 2021-09-26 16:19:06
 * @LastEditTime: 2022-07-26 15:03:42
 * @Description : 静态平衡测试-测前体验
-->
<template>
  <div class="static-balance-test-experience">
    <!-- 倒计时 -->
    <div class="count-down">
      <div class="count-down__text">倒 计 时</div>
      <div class="count-down__nowTime">{{ nowTime }}</div>
    </div>

    <!-- 图形区 -->
    <div class="chart">
      <div id="chart" :style="{ width: '100%', height: '100%' }"></div>
    </div>

    <!-- 按钮组 -->
    <div class="btn">
      <el-button
        class="btn__start"
        type="primary"
        :disabled="isStarting"
        @click="handleStart"
        >开始体验</el-button
      >
      <el-button class="btn__cancel" type="danger" @click="handleGoBack"
        >返回</el-button
      >
      <el-button
        class="btn__toTest"
        type="success"
        :disabled="!isFinish"
        @click="handleToMeasure"
        >完成</el-button
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
  name: 'static-balance-test-experience',

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
      nowTime: 5, // 倒计时，默认5s
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
      this.myChart.setOption(this.option)
    },

    /**
     * @description: 开始体验按钮
     */
    handleStart() {
      this.isFinish = false
      this.isStarting = true
      this.nowTime = 5
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
          // 清除计时器
          if (this.timeClock) {
            clearInterval(this.timeClock)
          }

          this.usbPort.write('N')

          this.isFinish = true
          this.isStarting = false
          this.nowTime = 5
        }
      }, 1000)
    },

    /**
     * @description: 返回按钮
     */
    handleGoBack() {
      this.$router.push({
        path: '/layout/static-balance-test-set'
      })
    },

    /**
     * @description: 完成按钮，跳转至测量页面
     */
    handleToMeasure() {
      this.$router.push({
        path: '/layout/static-balance-test-measure',
        query: {
          testTime: JSON.stringify(this.testTime), // 测试时长
          isVisual: JSON.stringify(this.isVisual), // 是否开启视觉反馈
          isBarycenter: JSON.stringify(this.isBarycenter) // 是否开启重心轨迹
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
.static-balance-test-experience {
  width: 100%;
  height: 100%;
  padding: 20px 100px 40px 100px;
  @include flex(column, stretch, center);

  /* 倒计时 */
  .count-down {
    padding: 4px 50px;
    background-color: rgb(112, 173, 71);
    @include flex(column, center, center);
    .count-down__text {
      font-size: 34px;
      color: #ffffff;
    }
    .count-down__nowTime {
      font-size: 30px;
      color: #ffffff;
    }
  }

  /* 图形区 */
  .chart {
    width: 30vw;
    height: 63vh;
  }

  /* 按钮组 */
  .btn {
    @include flex(row, center, center);
    .btn__start {
      font-size: 24px;
    }
    .btn__cancel {
      font-size: 24px;
      margin: 0 100px;
    }
    .btn__toTest {
      font-size: 24px;
    }
  }
}
</style>
