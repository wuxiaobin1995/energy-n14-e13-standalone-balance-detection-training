<!--
 * @Author      : Mr.bin
 * @Date        : 2021-09-23 11:43:47
 * @LastEditTime: 2022-04-25 22:38:37
 * @Description : 管理员信息修改页面
-->
<template>
  <div class="admin-edit">
    <!-- 表单 -->
    <el-form
      class="edit-form"
      :model="editForm"
      :rules="editRules"
      ref="editForm"
      label-width="auto"
      label-position="right"
    >
      <!-- 账号 -->
      <el-form-item label="账号：">
        <el-input v-model.trim="editForm.adminId" disabled></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码：" prop="adminPassword">
        <el-input
          v-model.trim="editForm.adminPassword"
          placeholder="请输入管理员密码（限16字符）"
          maxlength="16"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div class="edit-form__btn">
          <!-- 修改按钮 -->
          <el-button
            class="edit-form__btn--edit"
            type="primary"
            @click="handleEdit('editForm')"
            >修 改</el-button
          >
          <!-- 表单重置按钮 -->
          <el-button type="text" @click="handleFormReset">表单重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'admin-edit',

  data() {
    return {
      /* 管理员 */
      editForm: {
        adminId: '',
        adminPassword: ''
      },
      editRules: {
        adminPassword: [
          { required: true, message: '请输入管理员密码', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getAdminData()
  },

  methods: {
    /**
     * @description: 从localStorage中获取管理员的校验账号、密码
     */
    getAdminData() {
      if (!window.localStorage.getItem('adminIdVerify')) {
        window.localStorage.setItem('adminIdVerify', 'energy')
      }
      this.editForm.adminId = window.localStorage.getItem('adminIdVerify')
      if (!window.localStorage.getItem('adminPasswordVerify')) {
        window.localStorage.setItem('adminPasswordVerify', 'energy')
      }
      this.editForm.adminPassword = window.localStorage.getItem(
        'adminPasswordVerify'
      )
    },

    /**
     * @description: 修改按钮
     * @param {*} formName 表单的ref名字
     */
    handleEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 只允许修改密码，账号永远是"energy"
          window.localStorage.setItem(
            'adminPasswordVerify',
            this.editForm.adminPassword
          )
          this.$store
            .dispatch('setCurrentAdmin', {
              adminId: this.editForm.adminId,
              adminPassword: this.editForm.adminPassword
            })
            .then(() => {
              this.$message({
                message: '修改管理员信息成功',
                type: 'success',
                duration: 2000
              })
            })
            .then(() => {
              this.handleFormReset()
            })
            .catch(() => {
              this.$alert(
                `请点击“刷新页面”按钮，然后重试！`,
                '修改管理员信息失败',
                {
                  type: 'error',
                  center: true,
                  showClose: false,
                  confirmButtonText: '刷新页面',
                  callback: () => {
                    this.handleFormReset()
                  }
                }
              )
            })
        } else {
          return false
        }
      })
    },

    /**
     * @description: 表单重置按钮
     */
    handleFormReset() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/layout/admin-edit'),
          duration: JSON.stringify(300)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-edit {
  width: 100%;
  height: 100%;
  @include flex(row, center, flex-start);

  /* 表单 */
  .edit-form {
    width: 36%;
    margin-top: 200px;
    .edit-form__btn {
      @include flex(row, space-between, center);
      .edit-form__btn--edit {
        width: 160px;
      }
    }
  }
}
</style>
