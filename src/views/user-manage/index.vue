<!--
 * @Author      : Mr.bin
 * @Date        : 2021-09-23 15:35:50
 * @LastEditTime: 2022-06-22 09:14:37
 * @Description : 用户管理页面
-->
<template>
  <div class="user-manage" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- 搜索栏 -->
    <div class="search">
      <el-input
        placeholder="请输入筛选内容"
        v-model.trim="selectInput"
        clearable
        @clear="handleSearchResect"
      >
        <el-select
          v-model="select"
          slot="prepend"
          placeholder="请选择"
          :style="{ width: '80px' }"
        >
          <el-option value="姓名"></el-option>
          <el-option value="账号"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="handleSelect"
          >筛选</el-button
        >
      </el-input>
    </div>

    <!-- 表格 -->
    <el-table
      class="table"
      style="width: 100%"
      height="100%"
      :data="tableShow"
      highlight-current-row
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :default-sort="{ prop: 'lastLoginTime', order: 'descending' }"
    >
      <!-- 详细内容展开行 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table__expand">
            <el-form-item label="密码：">
              <span>{{ props.row.userPassword }}</span>
            </el-form-item>
            <el-form-item label="性别：">
              <span>{{ props.row.sex }}</span>
            </el-form-item>
            <el-form-item label="基本信息：">
              <span>{{ props.row.information }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <!-- 账号 -->
      <el-table-column
        align="center"
        prop="userId"
        label="账号"
        width="220"
      ></el-table-column>
      <!-- 姓名 -->
      <el-table-column
        align="center"
        prop="userName"
        label="姓名"
        width="220"
      ></el-table-column>
      <!-- 最后登录时间 -->
      <el-table-column
        align="center"
        prop="lastLoginTime"
        label="最后登录时间"
        sortable
      >
        <template slot-scope="scope">
          <i class="el-icon-time" v-if="scope.row.lastLoginTime"></i>
          <span style="margin-left: 10px">{{ scope.row.lastLoginTime }}</span>
        </template>
      </el-table-column>

      <!-- 删除按钮 -->
      <el-table-column align="center" label="删除" width="180">
        <template slot-scope="scope">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            @click="handleDeleteUser(scope.$index, scope.row)"
            >删 除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 按钮组 -->
    <div class="btn">
      <!-- 刷新页面按钮 -->
      <el-button
        class="btn__item"
        type="info"
        icon="el-icon-refresh"
        @click="handleRefresh"
        >刷新页面</el-button
      >
      <!-- 导出Excel按钮 -->
      <el-button
        class="btn__item"
        type="success"
        icon="el-icon-document"
        :loading="exportExcelLoading"
        @click="handleExportExcel"
        >导出 Excel</el-button
      >
    </div>
  </div>
</template>

<script>
import { initDB } from '@/db/index.js'

export default {
  name: 'user-manage',

  data() {
    return {
      /* 搜索栏 */
      selectInput: '',
      select: '姓名',

      /* 表格 */
      tableShow: [], // 表格显示的数据
      allData: [], // 所有用户信息数据
      loading: false, // 表格加载动画

      /* 导出Excel */
      exportExcelLoading: false, // 导出Excel加载动画

      /* 其他 */
      fullscreenLoading: false // 全屏加载动效
    }
  },

  created() {
    this.getAllUsersData()
  },

  methods: {
    /**
     * @description: 获取所有用户信息数据
     */
    getAllUsersData() {
      this.loading = true
      const db = initDB()
      db.user
        .toArray()
        .then(res => {
          this.tableShow = res
          this.allData = res
        })
        .catch(err => {
          this.$confirm(`${err}`, '获取所有用户信息数据失败', {
            type: 'error',
            center: true,
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            confirmButtonText: '刷新页面',
            cancelButtonText: '返 回'
          })
            .then(() => {
              this.handleRefresh()
            })
            .catch(() => {
              this.$router.push({ path: '/layout/home' })
            })
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * @description: 筛选按钮
     */
    handleSelect() {
      if (this.selectInput !== '') {
        if (this.select === '姓名') {
          this.loading = true
          const db = initDB()
          db.user
            .where('userName')
            .equals(this.selectInput)
            .toArray(res => {
              this.tableShow = res
            })
            .catch(err => {
              this.$message({
                message: `姓名筛选出错，请重试：${err}`,
                type: 'error',
                duration: 3000
              })
            })
            .finally(() => {
              this.loading = false
            })
        } else if (this.select === '账号') {
          this.loading = true
          const db = initDB()
          db.user
            .where('userId')
            .equals(this.selectInput)
            .toArray(res => {
              this.tableShow = res
            })
            .catch(err => {
              this.$message({
                message: `账号筛选出错，请重试：${err}`,
                type: 'error',
                duration: 3000
              })
            })
            .finally(() => {
              this.loading = false
            })
        }
      }
    },

    /**
     * @description: 重置表格
     */
    handleSearchResect() {
      this.getAllUsersData()
    },

    /**
     * @description: 删除按钮
     */
    handleDeleteUser(index, row) {
      this.$confirm('此操作将"永久删除"该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.fullscreenLoading = true
          const db = initDB()
          // delete的用法：https://dexie.org/docs/Table/Table.delete()
          db.user
            .delete(row.userId)
            .then(() => {
              this.$message({
                message: '用户删除成功',
                type: 'success',
                duration: 2000
              })
            })
            .then(() => {
              this.getAllUsersData()
            })
            .catch(() => {
              this.$alert(`请点击“刷新页面”按钮，然后重试！`, '用户删除失败', {
                type: 'error',
                center: true,
                showClose: false,
                confirmButtonText: '刷新页面',
                callback: () => {
                  this.handleRefresh()
                }
              })
            })
            .finally(() => {
              this.selectInput = ''
              this.fullscreenLoading = false
            })
        })
        .catch(() => {})
    },

    /**
     * @description: 导出Excel按钮
     */
    handleExportExcel() {
      if (this.allData.length) {
        this.exportExcelLoading = true
        // 此处使用懒加载的方式
        import('@/utils/Export2Excel.js')
          .then(excel => {
            const excelTitle = {
              userId: '账号',
              userPassword: '密码',
              userName: '姓名',
              sex: '性别',
              lastLoginTime: '最后登录时间',
              information: '基本信息'
            }
            const tHeader = Object.values(excelTitle)
            // 会根据key键的顺序、属性值等动态变化
            const filterVal = Object.keys(excelTitle)
            const exportData = this.formatJson(filterVal, this.allData)
            excel.export_json_to_excel({
              header: tHeader, // 表头 必填
              data: exportData, // 具体数据 必填
              filename: `全部用户信息 ${this.$moment().format(
                'YYYY-MM-DD HH_mm_ss'
              )}`, // 导出文件名，非必填
              autoWidth: true, // 自适应列宽，非必填
              bookType: 'xlsx' // 导出格式，非必填
            })
          })
          .then(() => {
            this.$message({
              message: '导出Excel成功',
              type: 'success',
              duration: 2000
            })
          })
          .catch(err => {
            this.$alert(
              `请点击“刷新页面”按钮，然后重试：${err}`,
              '导出Excel失败',
              {
                type: 'error',
                center: true,
                showClose: false,
                confirmButtonText: '刷新页面',
                callback: () => {
                  this.handleRefresh()
                }
              }
            )
          })
          .finally(() => {
            this.exportExcelLoading = false
          })
      } else {
        this.$message({
          message: '表格数据不能为空！',
          type: 'error',
          duration: 3000
        })
      }
    },
    /**
     * @description: 数据格式化，将 [{},{},...] => [[],[],...]
     * @param {Array} filterVal key键
     * @param {Array} jsonData [{},{},...]
     * @return {Array} 二维数组 [[],[],...]
     */
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    },

    /**
     * @description: 刷新页面
     */
    handleRefresh() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/layout/user-manage'),
          duration: JSON.stringify(100)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-manage {
  width: 100%;
  height: 100%;
  padding: 20px 40px;
  @include flex(column, stretch, stretch);

  /* 搜索栏 */
  .search {
    width: 50%;
  }

  /* 表格 */
  .table {
    flex: 1;
    // 设置一下展开行的样式
    .table__expand {
      & /deep/ label {
        color: #99a9bf;
      }
    }
  }

  /* 按钮组 */
  .btn {
    @include flex(row, center, center);
    margin: 20px 0 0 0;
    .btn__item {
      margin: 0 20px;
    }
  }
}
</style>
