<!--
 * @Author      : Mr.bin
 * @Date        : 2021-12-27 21:31:40
 * @LastEditTime: 2022-04-21 16:57:53
 * @Description : 圆圈保持训练-数据记录
-->
<template>
  <div class="circle-hold">
    <!-- 顶部 -->
    <div class="top-wrapper">
      <!-- 标题 -->
      <el-page-header
        title="返回首页"
        content="圆圈保持训练"
        @back="handleToHome"
      ></el-page-header>
      <!-- 日期筛选 -->
      <el-date-picker
        class="data-select"
        v-model="selectDateValue"
        type="daterange"
        :picker-options="pickerOptions"
        range-separator="——"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        :editable="false"
        :clearable="false"
        :unlink-panels="true"
        align="right"
        @change="changeData"
      >
      </el-date-picker>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      class="table-wrapper"
      style="width: 80%"
      height="100%"
      :default-sort="{ prop: 'pdfTime', order: 'descending' }"
      :stripe="true"
      :border="true"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <!-- No -->
      <el-table-column type="index" width="50" align="center" />
      <!-- 训练时间 -->
      <el-table-column
        align="center"
        prop="pdfTime"
        label="训练时间"
        sortable
      ></el-table-column>

      <!-- 查看报告按钮 -->
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            @click="handleToPdf(scope.$index, scope.row)"
            >查看报告</el-button
          >
        </template>
      </el-table-column>
      <!-- 删除报告按钮 -->
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="danger"
            plain
            @click="handleDelete(scope.$index, scope.row)"
            >删除报告</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 按钮组 -->
    <div class="btn">
      <el-button class="item" type="success" @click="handleSecularTrend"
        >长期趋势报告</el-button
      >
      <el-button class="item" type="primary" @click="handleRefreshTable"
        >刷 新 表 格</el-button
      >
    </div>
  </div>
</template>

<script>
import { initDB } from '@/db/index.js'

export default {
  name: 'circle-hold',

  data() {
    return {
      tableData: [],
      loading: false, // 表格加载动画
      // 日期选择器的筛选值
      selectDateValue: [
        this.$moment().format('YYYY-MM-DD 00:00:00'),
        this.$moment().format('YYYY-MM-DD 23:59:59')
      ],
      /* 日期选择器快捷选项 */
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一年',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 360)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '该用户所有数据',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 36000)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },

  created() {
    this.initData()
  },

  methods: {
    /**
     * @description: 返回首页
     */
    handleToHome() {
      this.$router.push({
        path: '/home'
      })
    },

    /**
     * @description: 表格数据初始化
     */
    initData() {
      const db = initDB()
      this.loading = true
      db.train_data
        .where({
          userId: this.$store.state.currentUserInfo.userId,
          type: '圆圈保持训练'
        })
        .toArray()
        .then(res => {
          this.tableData = res
        })
        .catch(err => {
          this.$confirm(`${err}。获取数据失败，请点击刷新按钮重试！`, '提示', {
            type: 'warning',
            center: true,
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            confirmButtonText: '刷 新',
            cancelButtonText: '返回首页'
          })
            .then(() => {
              this.handleRefresh()
            })
            .catch(() => {
              this.handleToHome()
            })
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * @description: 根据日期选择获取表格数据
     */
    getData() {
      const db = initDB()
      this.loading = true
      db.train_data
        .where(['userId', 'type', 'pdfTime'])
        .between(
          [
            this.$store.state.currentUserInfo.userId,
            '圆圈保持训练',
            this.selectDateValue[0]
          ],
          [
            this.$store.state.currentUserInfo.userId,
            '圆圈保持训练',
            this.selectDateValue[1]
          ],
          true,
          true
        )
        .toArray()
        .then(res => {
          this.tableData = res
        })
        .catch(err => {
          this.$confirm(
            `${err}。根据日期获取数据失败，请点击刷新按钮重试！`,
            '提示',
            {
              type: 'warning',
              center: true,
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              confirmButtonText: '刷 新',
              cancelButtonText: '返回首页'
            }
          )
            .then(() => {
              this.handleRefresh()
            })
            .catch(() => {
              this.handleToHome()
            })
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * @description: 用户确认选定的值时触发
     * @param {*} value 选择的日期数组
     */
    changeData(value) {
      this.selectDateValue = value
      this.getData()
    },

    /**
     * @description: 查看报告
     * @param {*} index
     * @param {*} row
     */
    handleToPdf(index, row) {
      this.$router.push({
        path: '/train-circle-hold-pdf',
        query: {
          userId: JSON.stringify(row.userId),
          pdfTime: JSON.stringify(row.pdfTime),
          routerName: JSON.stringify('/train-record/circle-hold')
        }
      })
    },

    /**
     * @description: 删除报告
     * @param {*} index
     * @param {*} row
     */
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false
      })
        .then(() => {
          const db = initDB()
          this.loading = true
          db.train_data
            .where({
              userId: row.userId,
              pdfTime: row.pdfTime,
              type: row.type
            })
            .delete()
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            })
            .then(() => {
              this.getData()
            })
            .catch(() => {
              this.$message({
                message: '删除失败！',
                type: 'error'
              })
            })
            .finally(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    },

    /**
     * @description: 查看长期趋势报告
     */
    handleSecularTrend() {
      this.$router.push({
        path: '/train-circle-hold-secular-trend-pdf',
        query: {
          userId: JSON.stringify(this.$store.state.currentUserInfo.userId),
          routerName: JSON.stringify('/train-record/circle-hold'),
          type: JSON.stringify('圆圈保持训练')
        }
      })
    },

    /**
     * @description: 刷新页面
     */
    handleRefreshTable() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/train-record/circle-hold'),
          duration: JSON.stringify(300)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.circle-hold {
  width: 100%;
  height: 90%;
  @include flex(column, stretch, center);

  /* 顶部 */
  .top-wrapper {
    width: 80%;
    margin: 10px 0;
    @include flex(row, space-between, center);
    // 标题
    .text {
      font-size: 32px;
      color: green;
    }
  }

  /* 表格 */
  .table-wrapper {
    flex: 1;
  }

  /* 按钮组 */
  .btn {
    margin-top: 20px;
    @include flex(row, center, center);
    .item {
      margin: 0 40px;
    }
  }
}
</style>
