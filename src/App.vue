<template>
  <!-- 头部标题 -->
  <m-header/>
  <!-- 菜单导航栏 -->
  <tab/>
  <!-- 页面主要内容 -->
  <router-view/>
  <player/>
</template>
<script>
  import Header from './components/header/header'
  import Tab from './components/tab/tab'
  import Player from './components/player/player'
  export default {
    components: {
      Player,
      Tab,
      MHeader: Header
    }
  }
</script>
