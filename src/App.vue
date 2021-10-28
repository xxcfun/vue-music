<template>
  <!-- 头部标题 -->
  <m-header/>
  <!-- 菜单导航栏 -->
  <tab/>
  <!-- 页面主要内容 -->
  <router-view :style="viewStyle"/>
  <player/>
</template>
<script>
  import Header from './components/header/header'
  import Tab from './components/tab/tab'
  import Player from './components/player/player'
  import { mapState } from 'vuex'

  export default {
    components: {
      Player,
      Tab,
      MHeader: Header
    },
    computed: {
      // 如果有mini播放器，那么页面距离底部加上60像素
      viewStyle () {
        const bottom = this.playList.length ? '60px' : '0'
        return {
          bottom
        }
      },
      ...mapState([
        'playList'
      ])
    }
  }
</script>
