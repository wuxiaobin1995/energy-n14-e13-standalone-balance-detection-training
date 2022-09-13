<!--
 * @Author      : Mr.bin
 * @Date        : 2022-03-03 09:30:27
 * @LastEditTime: 2022-04-28 15:41:37
 * @Description : 蓝牙连接
-->
<template>
  <div class="bluetooth-connect">
    <div class="btn">
      <el-button
        class="btn__connect"
        type="success"
        :loading="bluetoothLoading"
        @click="handleConnectBluetooth"
        >连 接 蓝 牙</el-button
      >
    </div>

    <div class="btn">
      <el-button class="btn__refresh" type="info" @click="handleRefresh"
        >刷 新 页 面</el-button
      >
    </div>
  </div>
</template>

<script>
/* 串口通信库 */
import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

export default {
  name: 'bluetooth-connect',

  data() {
    return {
      /* 串口相关 */
      usbPort: null,
      parser: null,
      scmBaudRate: 115200,

      /* 其他 */
      bluetoothLoading: false, // 加载动画

      xStandard: null,
      yStandard: null
    }
  },

  created() {
    this.$store.dispatch('setIsCollapse', false)

    this.xStandard = this.$store.state.zeroStandard.xStandard
    this.yStandard = this.$store.state.zeroStandard.yStandard

    this.initSerialPort()
  },
  beforeDestroy() {
    if (this.usbPort) {
      if (this.usbPort.isOpen) {
        this.usbPort.close()
      }
    }
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
            this.$notify({
              title: '通知',
              message: `连接到串口：${comPath}；波特率为：${this.scmBaudRate}`,
              type: 'success',
              position: 'bottom-right',
              duration: 2000
            })

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
              this.$getLogger('串口开启失败')
              this.$alert(
                `请重新连接USB蓝牙适配器，然后点击"刷新页面"按钮！`,
                '串口开启失败',
                {
                  type: 'error',
                  showClose: false,
                  center: true,
                  confirmButtonText: '刷新页面',
                  callback: () => {
                    this.handleRefresh()
                  }
                }
              )
            })

            /* Readline解析器将数据转换成字符串 */
            this.parser = this.usbPort.pipe(new Readline({ delimiter: '\n' }))
            this.parser.on('data', data => {
              console.log(data)

              /* 蓝牙相关逻辑 */
              // 蓝牙连接
              if (data.slice(0, data.length - 1).includes('Chars Found')) {
                // 成功
                this.$store.dispatch('setIsBluetooth', true).then(() => {
                  this.bluetoothLoading = false

                  if (this.xStandard === null || this.yStandard === null) {
                    this.$alert(
                      `请前往校准调零页面，进行“调零”操作！`,
                      '蓝牙连接成功',
                      {
                        type: 'success',
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
                  } else {
                    this.$message({
                      message: '蓝牙连接成功',
                      type: 'success',
                      duration: 2500
                    })
                  }
                })
              } else if (
                data
                  .slice(0, data.length - 1)
                  .includes('Can not find the device')
              ) {
                // 失败
                this.$store.dispatch('setIsBluetooth', false).finally(() => {
                  this.$message({
                    message: `蓝牙连接失败，${data.slice(0, data.length - 1)}`,
                    type: 'error',
                    duration: 5000
                  })
                  this.bluetoothLoading = false
                })
              }
              // 蓝牙断开
              if (data.slice(0, data.length - 1).includes('OK+LOST')) {
                this.$store.dispatch('setIsBluetooth', false).finally(() => {
                  this.$message({
                    message: '蓝牙连接已断开！等待重连......',
                    type: 'warning',
                    duration: 3000
                  })
                })
              }
            })
          } else {
            this.$getLogger('没有检测到USB蓝牙适配器')
            this.$confirm(
              `请重新连接USB蓝牙适配器，然后点击"刷新页面"按钮！`,
              '没有检测到USB蓝牙适配器',
              {
                type: 'error',
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                center: true,
                confirmButtonText: '刷新页面',
                cancelButtonText: '返回首页'
              }
            )
              .then(() => {
                this.handleRefresh()
              })
              .catch(() => {
                this.$router.push({
                  path: '/layout/home'
                })
              })
          }
        })
        .catch(err => {
          this.$getLogger('初始化SerialPort.list失败')
          this.$confirm(
            `${err}。请重新连接USB蓝牙适配器，然后点击"刷新页面"按钮！`,
            `初始化SerialPort.list失败`,
            {
              type: 'error',
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              center: true,
              confirmButtonText: '刷新页面',
              cancelButtonText: '返回首页'
            }
          )
            .then(() => {
              this.handleRefresh()
            })
            .catch(() => {
              this.$router.push({
                path: '/layout/home'
              })
            })
        })
    },

    /**
     * @description: 打开串口，并连接蓝牙按钮
     */
    handleConnectBluetooth() {
      if (this.usbPort) {
        if (!this.usbPort.isOpen) {
          this.usbPort.open()
        }
      }

      const bluetoothName = '636PHT'
      this.bluetoothLoading = true
      this.usbPort.write('AT+DISCON') // 先做一次关闭蓝牙，防止出错
      setTimeout(() => {
        this.usbPort.write(`AT+CONM${bluetoothName}`) // 连接蓝牙
      }, 3000)
    },

    /**
     * @description: 刷新页面按钮
     */
    handleRefresh() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/layout/bluetooth-connect'),
          duration: JSON.stringify(300)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bluetooth-connect {
  width: 100%;
  height: 100%;
  @include flex(column, center, center);

  .btn {
    margin: 20px 0;
    .btn__connect {
      font-size: 30px;
    }
    .btn__refresh {
      font-size: 30px;
    }
  }
}
</style>
