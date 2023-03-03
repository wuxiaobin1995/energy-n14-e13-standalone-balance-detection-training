<!--
 * @Author      : Mr.bin
 * @Date        : 2021-12-27 21:19:32
 * @LastEditTime: 2022-03-05 19:15:37
 * @Description : 圆环保持训练-长期趋势报告
-->
<template>
  <div
    class="ring-hold-train-secular-trend-pdf"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <!-- PDF区域 -->
    <div id="pdf" class="pdf-wrapper">
      <div class="up">
        <div class="title">圆环保持训练-长期趋势报告</div>
        <div class="logo-img">
          <el-image :src="logoSrc" fit="scale-down"></el-image>
        </div>
      </div>

      <div class="chart">
        <div id="chart" :style="{ width: '100%', height: '100%' }"></div>
      </div>
    </div>

    <!-- 按钮组 -->
    <div class="btn">
      <el-button class="btn__item" type="primary" @click="handlePrint"
        >保存PDF</el-button
      >
      <el-button class="btn__item" type="success" plain @click="handleGoBack"
        >返回</el-button
      >
    </div>
  </div>
</template>

<script>
import { initDB } from '@/db/index.js'

export default {
  name: 'ring-hold-train-secular-trend-pdf',

  data() {
    return {
      /* 路由传参 */
      routerName: JSON.parse(this.$route.query.routerName),

      /* 图形相关变量 */
      myChart: null,
      option: {},
      xData: [], // 横坐标数组

      /* 其他 */
      fullscreenLoading: false,
      logoSrc: require('@/assets/img/Company_Logo/logo_1.png'), // 公司商标
      scoreArray: [] // 综合得分数组
    }
  },

  mounted() {
    this.getData()
  },
  beforeDestroy() {
    // 注销echarts图形自适应监听事件
    window.removeEventListener('resize', this.resizeCharts)
  },

  watch: {
    '$store.state.isCollapse': {
      handler(newValue, oldValue) {
        setTimeout(() => {
          this.resizeCharts()
        }, 500)
      },
      immediate: true // 开启初次触发
    }
  },

  methods: {
    /**
     * @description: 获取数据
     */
    getData() {
      const db = initDB()
      this.fullscreenLoading = true
      db.train_data
        .where({
          userId: this.$store.state.currentUserInfo.userId,
          type: '圆环保持训练'
        })
        .toArray()
        .then(res => {
          for (let i = 0; i < res.length; i++) {
            const element = res[i]

            /* 计算横坐标 */
            this.xData.push(element.pdfTime)

            /* 计算综合得分 */
            const yesArray = [] // 圆环内
            for (let i = 0; i < element.trackArray.length; i++) {
              const x = element.trackArray[i][0]
              const y = element.trackArray[i][1]
              const r = parseFloat(
                Math.sqrt(Math.abs(Math.pow(x, 2) + Math.pow(y, 2))).toFixed(2)
              )
              if (r >= element.smallCircle && r <= element.bigCircle) {
                yesArray.push(r)
              }
            }
            const score = parseInt(
              ((yesArray.length / element.trackArray.length) * 100).toFixed(0)
            )
            this.scoreArray.push(score)
          }
        })
        .then(() => {
          this.initChart()
          // 监听父容器的宽高变化，目的是实现echarts图形自适应父容器的宽高变化
          window.addEventListener('resize', this.resizeCharts)
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
      this.myChart = this.$echarts.init(document.getElementById('chart'))
      this.option = {
        xAxis: {
          type: 'category',
          name: '训练时间',
          data: this.xData,
          boundaryGap: true // 从0点开始
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false // 隐藏背景网格线
          }
        },
        legend: {},
        // tooltip: {},
        series: [
          {
            name: '综合得分',
            data: this.scoreArray,
            color: 'green',
            type: 'line',
            smooth: false,
            showSymbol: false
          }
        ],
        animation: false
      }
      this.myChart.setOption(this.option)
    },

    /**
     * @description: 保存PDF按钮
     */
    handlePrint() {
      this.$htmlToPdf(
        'pdf',
        `圆环保持训练-长期趋势报告 ${this.$moment().format(
          'YYYY-MM-DD HH_mm_ss'
        )}`,
        580
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
.ring-hold-train-secular-trend-pdf {
  width: 100%;
  height: 100%;
  @include flex(column, stretch, stretch);

  /* PDF区域 */
  .pdf-wrapper {
    padding: 20px 40px;
    flex: 1;
    @include flex(column, stretch, stretch);
    .up {
      @include flex(row, space-between, stretch);
      .title {
        font-size: 34px;
        color: green;
      }
      .logo-img {
        width: 260px;
      }
    }

    .chart {
      flex: 1;
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
