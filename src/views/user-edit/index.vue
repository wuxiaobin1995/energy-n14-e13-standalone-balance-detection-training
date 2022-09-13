<!--
 * @Author      : Mr.bin
 * @Date        : 2021-09-23 11:42:22
 * @LastEditTime: 2022-04-25 10:54:25
 * @Description : 个人信息修改页面
-->
<template>
  <div class="user-edit" v-loading.fullscreen.lock="fullscreenLoading">
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
        <el-input v-model.trim="editForm.userId" disabled></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码：" prop="userPassword">
        <el-input
          v-model.trim="editForm.userPassword"
          placeholder="请输入密码（必填，限16字符）"
          maxlength="16"
          show-password
        ></el-input>
      </el-form-item>
      <!-- 姓名 -->
      <el-form-item label="姓名：" prop="userName">
        <el-input
          v-model.trim="editForm.userName"
          placeholder="请输入姓名（必填，限10字符）"
          maxlength="10"
          show-word-limit
        ></el-input>
      </el-form-item>
      <!-- 性别 -->
      <el-form-item label="性别：">
        <el-radio-group v-model="editForm.sex">
          <el-radio label="男">男性</el-radio>
          <el-radio label="女">女性</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 基本信息 -->
      <el-form-item label="基本信息：">
        <el-input
          type="textarea"
          v-model.trim="editForm.information"
          placeholder="请输入基本信息（选填，限300字符）"
          maxlength="300"
          show-word-limit
          resize="none"
          :rows="10"
        ></el-input>
      </el-form-item>

      <!-- 按钮组 -->
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
import { initDB } from '@/db/index.js'

export default {
  name: 'user-edit',

  data() {
    return {
      fullscreenLoading: false, // 全屏加载动效

      /* 普通用户 */
      editForm: {
        userId: '', // 账号
        userPassword: '', // 密码
        userName: '', // 姓名
        sex: '', // 性别
        information: '' // 基本信息
      },
      editRules: {
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.getCurrentUserData()
  },

  methods: {
    /**
     * @description: 获取当前登录用户的信息数据
     */
    getCurrentUserData() {
      this.fullscreenLoading = true
      const db = initDB()
      // equals的用法：https://dexie.org/docs/WhereClause/WhereClause.equals()
      db.user
        .where('userId')
        .equals(this.$store.state.currentUser.userId)
        .toArray(res => {
          this.editForm = res[0]
        })
        .catch(err => {
          this.$confirm(`${err}`, '获取当前登录用户的信息失败', {
            type: 'error',
            center: true,
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            confirmButtonText: '刷新页面',
            cancelButtonText: '返 回'
          })
            .then(() => {
              this.handleFormReset()
            })
            .catch(() => {
              this.$router.push({ path: '/layout/home' })
            })
        })
        .finally(() => {
          this.fullscreenLoading = false
        })
    },

    /**
     * @description: 修改按钮
     * @param {*} formName 表单的ref名字
     */
    handleEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.fullscreenLoading = true
          const db = initDB()
          // update的用法：https://dexie.org/docs/Table/Table.update()
          db.user
            .update(this.editForm.userId, {
              userPassword: this.editForm.userPassword,
              userName: this.editForm.userName,
              sex: this.editForm.sex,
              information: this.editForm.information
            })
            .then(() => {
              this.$store
                .dispatch('setCurrentUser', {
                  userId: this.editForm.userId,
                  userPassword: this.editForm.userPassword,
                  userName: this.editForm.userName,
                  sex: this.editForm.sex
                })
                .then(() => {
                  this.$message({
                    message: '修改用户信息成功',
                    type: 'success',
                    duration: 2000
                  })
                })
                .then(() => {
                  this.getCurrentUserData()
                })
            })
            .catch(() => {
              this.$alert(
                `请点击“刷新页面”按钮，然后重试！`,
                '修改用户信息失败',
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
            .finally(() => {
              this.fullscreenLoading = false
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
          routerName: JSON.stringify('/layout/user-edit'),
          duration: JSON.stringify(100)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-edit {
  width: 100%;
  height: 100%;
  @include flex(row, center, flex-start);

  /* 表单 */
  .edit-form {
    width: 50%;
    margin-top: 50px;
    .edit-form__btn {
      @include flex(row, space-between);
      .edit-form__btn--edit {
        width: 200px;
      }
    }
  }
}
</style>
