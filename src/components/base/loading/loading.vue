<template>
  <div class="loading">
    <!-- 正在载入组件 (这里的注释要写到外面，不会有loading的效果，同理，no-result组件一样)-->
    <div class="loading-content">
      <img src="./loading.gif" alt="" width="24" height="24">
      <p class="desc">{{ title }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'loading',
    data () {
      return {
        title: '正在载入...'
      }
    },
    methods: {
      setTitle(title) {
        this.title = title
      }
    }
  }
</script>

<style scoped lang="scss">
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    .loading-content {
      text-align: center;
      .desc {
        line-height: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
      }
    }
  }
</style>
