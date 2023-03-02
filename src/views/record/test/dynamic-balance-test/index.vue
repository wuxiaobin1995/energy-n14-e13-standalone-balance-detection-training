<!--
 * @Author      : Mr.bin
 * @Date        : 2021-12-27 22:02:23
 * @LastEditTime: 2022-04-21 16:54:56
 * @Description : 动态平衡测试-数据记录
-->
<template>
  <div class="dynamic-balance-test-record">
    <!-- 表格 -->
    <el-table
      class="table"
      :data="showData"
      style="width: 100%"
      height="100%"
      :default-sort="{ prop: 'pdfTime', order: 'descending' }"
      :stripe="false"
      :border="true"
      :highlight-current-row="true"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <!-- No -->
      <el-table-column align="center" type="index" width="50"></el-table-column>
      <!-- 测试时间 -->
      <el-table-column
        align="center"
        prop="pdfTime"
        label="测试时间"
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
      <el-button class="btn__item" type="success" @click="handleSecularTrend"
        >长期趋势报告</el-button
      >
      <el-button class="btn__item" type="primary" @click="handleRefreshTable"
        >刷 新 表 格</el-button
      >
    </div>
  </div>
</template>

<script>
import { initDB } from '@/db/index.js'

export default {
  name: 'dynamic-balance-test-record',

  data() {
    return {
      tableLoading: true, // 表格加载动画
      showData: [] // 表格显示的数据
    }
  },

  created() {
    this.$store.dispatch('setIsCollapse', false)
    this.getData()
  },

  methods: {
    /**
     * @description: 获取数据
     */
    getData() {
      const db = initDB()
      this.tableLoading = true
      db.test_data
        .where({
          userId: this.$store.state.currentUser.userId,
          type: '动态平衡测试'
        })
        .toArray()
        .then(res => {
          this.showData = res
        })
        .catch(err => {
          this.$message({
            message: `数据获取失败：${err}`,
            type: 'error'
          })
        })
        .finally(() => {
          this.tableLoading = false
        })
    },

    /**
     * @description: 查看报告
     * @param {*} index
     * @param {*} row
     */
    handleToPdf(index, row) {
      this.$router.push({
        path: '/layout/dynamic-balance-test-pdf',
        query: {
          userId: JSON.stringify(row.userId),
          pdfTime: JSON.stringify(row.pdfTime),
          routerName: JSON.stringify('/layout/dynamic-balance-test-record')
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
          this.tableLoading = true
          db.test_data
            .where({
              userId: row.userId,
              pdfTime: row.pdfTime,
              type: row.type
            })
            .delete()
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success'
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
              this.tableLoading = false
            })
        })
        .catch(() => {})
    },

    /**
     * @description: 查看长期趋势报告
     */
    handleSecularTrend() {
      this.$router.push({
        path: '/layout/dynamic-balance-test-secular-trend-pdf',
        query: {
          routerName: JSON.stringify('/layout/dynamic-balance-test-record')
        }
      })
    },

    /**
     * @description: 刷新表格数据，通过路由跳转的方式实现
     */
    handleRefreshTable() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/layout/dynamic-balance-test-record'),
          duration: JSON.stringify(100)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dynamic-balance-test-record {
  width: 100%;
  height: 100%;
  padding: 20px 40px;
  @include flex(column, stretch, stretch);

  /* 表格 */
  .table {
    flex: 1;
  }

  /* 按钮组 */
  .btn {
    margin-top: 20px;
    @include flex(row, center, center);
    .btn__item {
      margin: 0 40px;
    }
  }
}
</style>
