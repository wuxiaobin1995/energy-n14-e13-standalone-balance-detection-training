<!--
 * @Author      : Mr.bin
 * @Date        : 2021-09-14 16:35:52
 * @LastEditTime: 2022-04-25 10:22:26
 * @Description : 注册页面
-->
<template>
  <div class="register" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- Logo -->
    <div class="logo">
      <el-image class="logo__img" :src="logoSrc" fit="fit"></el-image>
    </div>

    <!-- 注册表单 -->
    <el-form
      class="register-form"
      :model="registerForm"
      :rules="registerRules"
      ref="registerForm"
      label-width="auto"
      label-position="right"
    >
      <!-- 账号 -->
      <el-form-item label="账号：" prop="userId">
        <el-input
          v-model.trim="registerForm.userId"
          placeholder="请输入账号（必填，限20字符）"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码：" prop="userPassword">
        <el-input
          v-model.trim="registerForm.userPassword"
          placeholder="请输入密码（必填，限16字符）"
          maxlength="16"
          show-password
        ></el-input>
      </el-form-item>
      <!-- 姓名 -->
      <el-form-item label="姓名：" prop="userName">
        <el-input
          v-model.trim="registerForm.userName"
          placeholder="请输入姓名（必填，限10字符）"
          maxlength="10"
          show-word-limit
        ></el-input>
      </el-form-item>
      <!-- 性别 -->
      <el-form-item label="性别：">
        <el-radio-group v-model="registerForm.sex">
          <el-radio label="男">男性</el-radio>
          <el-radio label="女">女性</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 基本信息 -->
      <el-form-item label="基本信息：">
        <el-input
          type="textarea"
          v-model.trim="registerForm.information"
          placeholder="请输入基本信息（选填，限300字符）"
          maxlength="300"
          show-word-limit
          resize="none"
          :rows="10"
        ></el-input>
      </el-form-item>

      <!-- 按钮组 -->
      <el-form-item>
        <div class="register-form__btn">
          <!-- 注册按钮 -->
          <el-button
            class="register-form__btn--register"
            type="primary"
            @click="handleUserRegister('registerForm')"
            >注 册</el-button
          >
          <!-- 跳转至登录按钮 -->
          <el-button type="text" @click="handleToLogin"
            >使用已有账户登录</el-button
          >
        </div>
      </el-form-item>
    </el-form>

    <!-- 底部信息 -->
    <div class="foot">
      <div>Copyright © Guangdong Energy Life Sport Rehabilitation Company</div>
    </div>
  </div>
</template>

<script>
import { initDB } from '@/db/index.js'

export default {
  name: 'register',

  data() {
    return {
      logoSrc: require('@/assets/img/Company_Logo/logo_1.png'), // 公司商标
      fullscreenLoading: false, // 全屏加载动效

      /* 普通用户 */
      registerForm: {
        userId: '', // 账号
        userPassword: '', // 密码
        userName: '', // 姓名
        sex: '男', // 性别
        information: '' // 基本信息
      },
      registerRules: {
        userId: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      }
    }
  },

  methods: {
    /**
     * @description: 注册按钮
     * @param {String} formName 表单的ref名字
     */
    handleUserRegister(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 避免用户账号与管理员账号相同
          if (this.registerForm.userId === 'energy') {
            this.$alert(`该账号已存在，请重新填写！`, '用户注册失败', {
              type: 'error',
              center: true,
              showClose: false,
              confirmButtonText: '确 定',
              callback: () => {}
            })
          } else {
            this.fullscreenLoading = true
            const db = initDB()
            db.user
              .add({
                userId: this.registerForm.userId,
                userPassword: this.registerForm.userPassword,
                userName: this.registerForm.userName,
                sex: this.registerForm.sex,
                information: this.registerForm.information,
                lastLoginTime: ''
              })
              .then(() => {
                this.$message({
                  message: '用户注册成功',
                  type: 'success',
                  duration: 2000
                })
              })
              .then(() => {
                this.$router.push({
                  path: '/'
                })
              })
              .catch(() => {
                this.$alert(`该账号已存在，请重新填写！`, '用户注册失败', {
                  type: 'error',
                  center: true,
                  showClose: false,
                  confirmButtonText: '确 定',
                  callback: () => {}
                })
              })
              .finally(() => {
                this.fullscreenLoading = false
              })
          }
        } else {
          return false
        }
      })
    },

    /**
     * @description: 跳转至登录按钮
     */
    handleToLogin() {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.register {
  width: 100%;
  height: 100%;
  @include flex(column, flex-start, center);
  @include bg-img(
    '../../assets/img/Background _Image/common_bg_img.png',
    repeat
  );

  /* Logo */
  .logo {
    margin: 20px 0 20px 0;
    @include flex(column);
    .logo__img {
      width: 300px;
    }
  }

  /* 注册表单 */
  .register-form {
    width: 40%;
    .register-form__btn {
      @include flex(row, space-between, center);
      .register-form__btn--register {
        width: 200px;
      }
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
}
</style>
