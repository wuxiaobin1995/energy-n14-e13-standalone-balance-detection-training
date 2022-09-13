<!--
 * @Author      : Mr.bin
 * @Date        : 2021-09-14 16:35:41
 * @LastEditTime: 2022-04-25 11:52:44
 * @Description : 登录页面
-->
<template>
  <div class="login" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- Logo -->
    <div class="logo">
      <el-image class="logo__img" :src="logoSrc" fit="fit"></el-image>
      <div class="logo__des">
        <div class="logo__des__item">广东安捷力运动康复有限公司</div>
        <div class="logo__des__item">
          专注于高效的医学运动康复、竞技体能训练和军队体能训练，并致力于运动器械和康复器械的研发与生产
        </div>
      </div>
    </div>

    <!-- 登录标签页 -->
    <el-tabs
      class="login-tabs"
      v-model="activeName"
      stretch
      :before-leave="handleTabsClick"
    >
      <!-- 普通用户登录 -->
      <el-tab-pane label="普通用户" name="普通用户">
        <div class="login-tabs__item">
          <el-form :model="userForm" :rules="userRules" ref="userForm">
            <!-- 账号 -->
            <el-form-item prop="userId">
              <el-input
                class="login-tabs__item--input"
                v-model.trim="userForm.userId"
                prefix-icon="el-icon-user"
                placeholder="请输入用户账号（限20字符）"
                maxlength="20"
              >
              </el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="userPassword">
              <el-input
                class="login-tabs__item--input"
                v-model.trim="userForm.userPassword"
                prefix-icon="el-icon-key"
                placeholder="请输入用户密码（限16字符）"
                maxlength="16"
                show-password
              ></el-input>
            </el-form-item>
            <!-- 登录按钮 -->
            <el-form-item>
              <el-button
                class="login-tabs__item--loginBtn"
                type="primary"
                @click="handleUserLogin('userForm')"
                >登 录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- 管理员登录 -->
      <el-tab-pane label="管理员" name="管理员">
        <div class="login-tabs__item">
          <el-form :model="adminForm" :rules="adminRules" ref="adminForm">
            <!-- 账号 -->
            <el-form-item prop="adminId">
              <el-input
                class="login-tabs__item--input"
                v-model.trim="adminForm.adminId"
                prefix-icon="el-icon-user"
                placeholder="请输入管理员账号（限16字符）"
                maxlength="16"
              >
              </el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="adminPassword">
              <el-input
                class="login-tabs__item--input"
                v-model.trim="adminForm.adminPassword"
                prefix-icon="el-icon-key"
                placeholder="请输入管理员密码（限16字符）"
                maxlength="16"
                show-password
              ></el-input>
            </el-form-item>
            <!-- 登录按钮 -->
            <el-form-item>
              <el-button
                class="login-tabs__item--loginBtn"
                type="primary"
                @click="handleAdminLogin('adminForm')"
                >登 录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 按钮组 -->
    <div class="register-btn" v-show="activeName === '普通用户'">
      <!-- 忘记密码提示 -->
      <el-tooltip
        effect="dark"
        content="请登录管理员账号，找回密码"
        placement="bottom-start"
      >
        <el-button class="register-btn__forget" type="text">
          忘记密码？
        </el-button>
      </el-tooltip>
      <!-- 跳转至注册按钮 -->
      <el-button type="text" @click="handleToRegister">注册账户</el-button>
    </div>

    <!-- 底部信息 -->
    <div class="foot">
      <div>Copyright © Guangdong Energy Life Sport Rehabilitation Company</div>
    </div>

    <!-- 打开控制台按钮 -->
    <el-button
      class="btn-control"
      type="info"
      size="mini"
      @click="handleOpenDev"
      >Open Dev</el-button
    >
  </div>
</template>

<script>
/* 用于打开控制台 */
import { remote } from 'electron'

import { initDB } from '@/db/index.js'

export default {
  name: 'login',

  data() {
    return {
      logoSrc: require('@/assets/img/Company_Logo/logo_1.png'), // 公司商标
      activeName: '普通用户',
      fullscreenLoading: false, // 全屏加载动效

      /* 普通用户 */
      userForm: {
        userId: '',
        userPassword: ''
      },
      userRules: {
        userId: [
          { required: true, message: '请输入用户账号', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ]
      },

      /* 管理员 */
      adminForm: {
        adminId: '',
        adminPassword: ''
      },
      adminRules: {
        adminId: [
          { required: true, message: '请输入管理员账号', trigger: 'blur' }
        ],
        adminPassword: [
          { required: true, message: '请输入管理员密码', trigger: 'blur' }
        ]
      },

      /* 管理员校验账号、密码 */
      adminIdVerify: '',
      adminPasswordVerify: ''
    }
  },

  created() {
    this.getAdminData()

    this.initVuex()
  },

  methods: {
    /**
     * @description: 从localStorage中获取管理员的校验账号、密码
     */
    getAdminData() {
      if (!window.localStorage.getItem('adminIdVerify')) {
        window.localStorage.setItem('adminIdVerify', 'energy')
      }
      this.adminIdVerify = window.localStorage.getItem('adminIdVerify')
      if (!window.localStorage.getItem('adminPasswordVerify')) {
        window.localStorage.setItem('adminPasswordVerify', 'energy')
      }
      this.adminPasswordVerify = window.localStorage.getItem(
        'adminPasswordVerify'
      )
    },

    /**
     * @description: 初始化Vuex的相关数据
     */
    initVuex() {
      this.$store.dispatch('setCurrentAdmin', {
        adminId: '',
        adminPassword: ''
      })
      this.$store.dispatch('setCurrentUser', {
        userId: '',
        userPassword: '',
        userName: '',
        sex: ''
      })
    },

    /**
     * @description: 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换
     * @param {*} activeName 新tab
     * @param {*} oldActiveName 旧tab
     */
    handleTabsClick(activeName, oldActiveName) {
      /* 清空内容，并去除校验结果 */
      this.userForm.userId = ''
      this.userForm.userPassword = ''
      this.adminForm.adminId = ''
      this.adminForm.adminPassword = ''
      this.$refs['userForm'].clearValidate()
      this.$refs['adminForm'].clearValidate()
    },

    /**
     * @description: 普通用户-登录按钮
     * @param {String} formName 表单的ref名字
     */
    handleUserLogin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.fullscreenLoading = true
          const db = initDB()
          db.user
            .where({
              userId: this.userForm.userId
            })
            .toArray()
            .then(res => {
              if (res.length) {
                if (this.userForm.userPassword === res[0].userPassword) {
                  this.$store
                    .dispatch('setCurrentUser', {
                      userId: res[0].userId,
                      userPassword: res[0].userPassword,
                      userName: res[0].userName,
                      sex: res[0].sex
                    })
                    .then(() => {
                      this.$message({
                        message: '用户登陆成功',
                        type: 'success',
                        duration: 2000
                      })
                    })
                    .then(() => {
                      const db = initDB()
                      db.user.update(res[0].userId, {
                        lastLoginTime: this.$moment().format(
                          'YYYY-MM-DD HH:mm:ss'
                        )
                      })
                    })
                    .then(() => {
                      this.$router.push({
                        path: '/layout/home'
                      })
                    })
                    .catch(() => {
                      this.$alert(
                        `用户登录校验出错，请点击“刷新页面”按钮，然后重新登录！`,
                        '警告',
                        {
                          type: 'error',
                          center: true,
                          showClose: false,
                          confirmButtonText: '刷新页面',
                          callback: () => {
                            window.location.reload()
                          }
                        }
                      )
                    })
                } else {
                  this.$message({
                    message: '密码错误',
                    type: 'error',
                    duration: 3000
                  })
                }
              } else {
                this.$message({
                  message: '该账号不存在',
                  type: 'error',
                  duration: 3000
                })
              }
            })
            .catch(() => {
              this.$alert(
                `用户登录校验出错，请点击“刷新页面”按钮，然后重新登录！`,
                '警告',
                {
                  type: 'error',
                  center: true,
                  showClose: false,
                  confirmButtonText: '刷新页面',
                  callback: () => {
                    window.location.reload()
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
     * @description: 管理员-登录按钮
     * @param {String} formName 表单的ref名字
     */
    handleAdminLogin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.adminForm.adminId === this.adminIdVerify) {
            if (this.adminForm.adminPassword === this.adminPasswordVerify) {
              this.$store
                .dispatch('setCurrentAdmin', {
                  adminId: this.adminForm.adminId,
                  adminPassword: this.adminForm.adminPassword
                })
                .then(() => {
                  this.$message({
                    message: '管理员登陆成功',
                    type: 'success',
                    duration: 2000
                  })
                })
                .then(() => {
                  this.$router.push({
                    path: '/layout/home'
                  })
                })
                .catch(() => {
                  this.$alert(
                    `管理员登录校验出错，请点击“刷新页面”按钮，然后重新登录！`,
                    '警告',
                    {
                      type: 'error',
                      center: true,
                      showClose: false,
                      confirmButtonText: '刷新页面',
                      callback: () => {
                        window.location.reload()
                      }
                    }
                  )
                })
            } else {
              this.$message({
                message: '管理员密码错误',
                type: 'error',
                duration: 3000
              })
            }
          } else {
            this.$message({
              message: '管理员账号错误',
              type: 'error',
              duration: 3000
            })
          }
        } else {
          return false
        }
      })
    },

    /**
     * @description: 跳转至注册按钮
     */
    handleToRegister() {
      this.$router.push({
        path: '/register'
      })
    },

    /**
     * @description: 打开控制台
     */
    handleOpenDev() {
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^htpm$/,
        inputErrorMessage: '密码不正确',
        showClose: true,
        closeOnClickModal: false
      })
        .then(() => {
          try {
            remote.getCurrentWebContents().openDevTools()
          } catch (err) {
            this.$message({
              type: 'error',
              message: `打开控制台失败：${err}`
            })
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  @include flex(column, flex-start, center);
  @include bg-img(
    '../../assets/img/Background _Image/common_bg_img.png',
    repeat
  );

  /* Logo */
  .logo {
    margin: 80px 0 40px 0;
    @include flex(column);
    .logo__img {
      width: 300px;
      margin-bottom: 4px;
    }
    .logo__des {
      color: rgba(0, 0, 0, 0.5);
      font-size: 14px;
      .logo__des__item {
        margin: 6px 0;
        @include flex();
      }
    }
  }

  /* 登录标签页 */
  .login-tabs {
    // 修改字体大小
    & /deep/ .el-tabs__item {
      font-size: 16px;
    }
    .login-tabs__item {
      width: 400px;
      @include flex();
      .login-tabs__item--input {
        width: 400px;
      }
      .login-tabs__item--loginBtn {
        margin-top: 20px;
        width: 400px;
      }
    }
  }

  /* 按钮组 */
  .register-btn {
    width: 400px;
    @include flex(row, space-between);
    .register-btn__forget {
      color: rgb(92, 173, 53);
    }
  }

  /* 底部信息 */
  .foot {
    flex: 1;
    @include flex(row, center, flex-end);
    margin-bottom: 14px;
    color: rgba(0, 0, 0, 0.5);
    font-size: 14px;
  }

  /* 打开控制台按钮 */
  .btn-control {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>
