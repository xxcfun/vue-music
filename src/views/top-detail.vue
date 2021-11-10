<template>
  <div class="top-detail">
    <!-- 榜单详情 -->
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
      rank
    />
  </div>
</template>

<script>
  import createDetailComponent from '../assets/js/create-detail-component'
  import { getTopDetail } from '../service/top-list'
  import { TOP_KEY } from '../assets/js/constant'

  export default createDetailComponent('top-detail', TOP_KEY, getTopDetail)
</script>

<style scoped lang="scss">
  .top-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $color-background;
  }
</style>
