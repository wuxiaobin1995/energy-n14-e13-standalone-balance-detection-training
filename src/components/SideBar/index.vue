<!--
 * @Author      : Mr.bin
 * @Date        : 2021-09-18 09:03:57
 * @LastEditTime: 2022-10-09 10:52:28
 * @Description : 侧边菜单栏
-->
<template>
  <el-menu
    class="side-bar"
    background-color="#545c64"
    text-color="#ffffff"
    active-text-color="#ffffff"
    router
    :default-active="this.$route.path"
    :collapse="isCollapse"
    :unique-opened="true"
  >
    <!-- Logo -->
    <div class="side-bar__logo">
      <el-image :src="logoSrc" fit="scale-down"></el-image>
    </div>

    <!-- 首页 -->
    <el-menu-item index="/layout/home">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>

    <!-- 蓝牙连接 -->
    <el-menu-item
      index="/layout/bluetooth-connect"
      v-if="this.$store.state.currentUser.userId"
    >
      <i class="el-icon-position"></i>
      <span slot="title">蓝牙连接</span>
    </el-menu-item>

    <!-- 校准调零 -->
    <el-menu-item
      index="/layout/calibrate-zero"
      v-if="this.$store.state.currentUser.userId"
      :disabled="!this.$store.state.isBluetooth"
    >
      <i class="el-icon-odometer"></i>
      <span slot="title">校准调零</span>
    </el-menu-item>

    <!-- 个人设置 -->
    <el-submenu index="1" v-if="this.$store.state.currentUser.userId">
      <template slot="title">
        <i class="el-icon-user-solid"></i>
        <span>个人设置</span>
      </template>
      <el-menu-item index="/layout/user-edit">个人信息修改</el-menu-item>
    </el-submenu>

    <!-- 管理员设置 -->
    <el-submenu index="2" v-if="this.$store.state.currentAdmin.adminId">
      <template slot="title">
        <i class="el-icon-s-operation"></i>
        <span>管理员设置</span>
      </template>
      <el-menu-item index="/layout/user-manage">用户管理</el-menu-item>
      <el-menu-item index="/layout/admin-edit">管理员信息修改</el-menu-item>
    </el-submenu>

    <!-- 开发者页面 -->
    <el-menu-item
      index="/layout/developer"
      v-if="this.$store.state.currentAdmin.adminId"
    >
      <i class="el-icon-s-promotion"></i>
      <span slot="title">开发者</span>
    </el-menu-item>

    <!-- 测试模式 -->
    <el-submenu index="3" v-if="this.$store.state.currentUser.userId">
      <template slot="title">
        <i class="el-icon-connection"></i>
        <span>测试模式</span>
      </template>
      <el-menu-item
        index="/layout/static-balance-test-set"
        :disabled="!this.$store.state.isBluetooth"
        >静态平衡测试</el-menu-item
      >
      <el-menu-item
        index="/layout/dynamic-balance-test-set"
        :disabled="!this.$store.state.isBluetooth"
        >动态平衡测试</el-menu-item
      >
    </el-submenu>

    <!-- 训练模式 -->
    <el-submenu index="4" v-if="this.$store.state.currentUser.userId">
      <template slot="title">
        <i class="el-icon-s-flag"></i>
        <span>训练模式</span>
      </template>
      <el-menu-item
        index="/layout/ring-hold-train-set"
        :disabled="!this.$store.state.isBluetooth"
        >圆环保持训练</el-menu-item
      >
      <el-menu-item
        index="/layout/circle-hold-train-set"
        :disabled="!this.$store.state.isBluetooth"
        >圆圈保持训练</el-menu-item
      >
    </el-submenu>

    <!-- 数据记录 -->
    <el-submenu index="5" v-if="this.$store.state.currentUser.userId">
      <template slot="title">
        <i class="el-icon-s-data"></i>
        <span>数据记录</span>
      </template>
      <!-- 测试 -->
      <el-submenu index="5-1">
        <template slot="title">测试</template>
        <el-menu-item index="/layout/static-balance-test-record"
          >静态平衡测试记录</el-menu-item
        >
        <el-menu-item index="/layout/dynamic-balance-test-record"
          >动态平衡测试记录</el-menu-item
        >
      </el-submenu>

      <!-- 训练 -->
      <el-submenu index="5-2">
        <template slot="title">训练</template>
        <el-menu-item index="/layout/ring-hold-train-record"
          >圆环保持训练</el-menu-item
        >
        <el-menu-item index="/layout/circle-hold-train-record"
          >圆圈保持训练</el-menu-item
        >
      </el-submenu>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'SideBar',

  data() {
    return {
      logoSrc: require('@/assets/img/Company_Logo/logo_1.png') // 公司商标
    }
  },

  computed: {
    /* 是否展开、折叠菜侧边菜单栏 */
    isCollapse() {
      return this.$store.state.isCollapse
    }
  }
}
</script>

<style lang="scss" scoped>
.side-bar {
  border-right: none;
  /* 折叠状态时生效的样式 */
  height: 100%;
  width: 0; // 侧边栏收缩时实现完全隐藏
  overflow: hidden; // 侧边栏收缩时实现完全隐藏
  /* 展开状态时生效的样式 */
  &:not(.el-menu--collapse) {
    box-shadow: 2px 0 6px rgba(82, 85, 87, 0.35);
    width: 200px;
    height: 100%;
    overflow-x: hidden; // 不允许X轴滚动
    overflow-y: auto; // 超出时才允许Y轴滚动
  }
  /* 改变滚动条样式，更美观 */
  &::-webkit-scrollbar {
    display: none; // 隐藏滚动条
  }
  /* 改变element激活item的样式 */
  & /deep/ .el-menu-item.is-active {
    background-color: rgb(24, 144, 255) !important;
  }

  /* Logo */
  .side-bar__logo {
    @include flex();
    // padding: 8px;
  }
}
</style>
