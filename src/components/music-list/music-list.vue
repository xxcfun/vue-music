<template>
  <!-- 音乐列表组件 -->
  <div class="music-list">
    <!-- 头部返回按钮 -->
    <div class="back"
         @click="goBack"
    >
      <i class="icon-back"></i>
    </div>
    <!-- 标题 -->
    <h1 class="title">{{ title }}</h1>
    <!-- 背景图 -->
    <div class="bg-image"
         :style="bgImageStyle"
         ref="bgImage">
      <div class="filter"
           :style="filterStyle"
      ></div>
    </div>
    <!-- 滚动列表 -->
    <scroll class="list"
            :style="scrollStyle"
            v-loading="loading"
            :probe-type="3"
            @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs"/>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from '../base/scroll/scroll'
  import SongList from '../base/song-list/song-list'

  const RESERVED_HEIGHT = 40

  export default {
    name: 'music-list',
    components: { SongList, Scroll },
    props: {
      songs: {
        type: Array,
        default () {
          return []
        }
      },
      title: String,
      pic: String,
      loading: Boolean
    },
    data () {
      return {
        imageHeight: 0,
        scrollY: 0,
        maxTranslateY: 0
      }
    },
    computed: {
      // 实时计算背景图的样式，完成上推下拉的功能
      bgImageStyle () {
        const scrollY = this.scrollY
        let zIndex = 0
        let paddingTop = '70%'
        let height = 0
        let translateZ = 0

        if (scrollY > this.maxTranslateY) {
          zIndex = 10
          paddingTop = 0
          height = `${RESERVED_HEIGHT}px`
          translateZ = 1
        }

        let scale = 1
        if (scrollY < 0) {
          scale = 1 + Math.abs(scrollY / this.imageHeight)
        }

        return {
          zIndex,
          paddingTop,
          height,
          transform: `scale(${scale})translateZ(${translateZ})`,
          backgroundImage: `url(${this.pic})`
        }
      },
      // 实时获取scroll组件的高度，实现scroll滚动
      scrollStyle () {
        return {
          top: `${this.imageHeight}px`
        }
      },
      // 添加动态模糊
      filterStyle () {
        let blur = 0
        const scrollY = this.scrollY
        const imageHeight = this.imageHeight
        if (scrollY >= 0) {
          blur = Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) * 20
        }
        return {
          backdropFilter: `blur(${blur}px)`
        }
      }
    },
    mounted () {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
    },
    methods: {
      // 退回上一页
      goBack () {
        this.$router.back()
      },
      onScroll (pos) {
        this.scrollY = -pos.y
      }
    }
  }
</script>

<style scoped lang="scss">
  .music-list {
    position: relative;
    height: 100%;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 20;
      transform: translateZ(2px);
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      z-index: 20;
      transform: translateZ(2px);
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      // 设置旋转元素的基点位置
      transform-origin: top;
      // 此时会保持图像的纵横比并将图像缩放成将完全覆盖背景定位区域的最小大小
      background-size: cover;
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .list {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 0;
      .song-list-wrapper {
        padding: 20px 30px;
        background: $color-background;
      }
    }
  }
</style>
