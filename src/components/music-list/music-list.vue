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
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn"
             v-show="songs.length > 0"
             @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"
           :style="filterStyle"
      ></div>
    </div>
    <!-- 滚动列表 -->
    <scroll class="list"
            :style="scrollStyle"
            v-loading="loading"
            v-no-result:[noResultText]="noResult"
            :probe-type="3"
            @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs"
                   @select="selectItem"
                   :rank="rank"
        />
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from '../wrap-scroll'
  import SongList from '../base/song-list/song-list'
  import { mapActions, mapState } from 'vuex'

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
      loading: Boolean,
      noResultText: {
        type: String,
        default: '抱歉，没有找到可播放的歌曲'
      },
      rank: Boolean
    },
    data () {
      return {
        imageHeight: 0,
        scrollY: 0,
        maxTranslateY: 0
      }
    },
    computed: {
      // loading请求完并且歌曲为空触发，显示no-result组件
      noResult () {
        return !this.loading && !this.songs.length
      },
      // 当列表滚动到最上方的时候，隐藏播放按钮
      playBtnStyle () {
        let display = ''
        if (this.scrollY >= this.maxTranslateY) {
          display = 'none'
        }
        return {
          display
        }
      },
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
        const bottom = this.playList.length ? '60px' : '0'
        return {
          top: `${this.imageHeight}px`,
          bottom
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
      },
      ...mapState([
        'playList'
      ])
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
      // 监听滚动的高度
      onScroll (pos) {
        this.scrollY = -pos.y
      },
      // 顺序播放歌曲
      selectItem ({ song, index }) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      // 随机播放歌曲
      random () {
        // 注意！！！！这里不能以对象的形式传入，防止utils类中的slice函数报错，必须传一个数组
        this.randomPlay(this.songs)
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
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
      .play-btn-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 8px;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
      }
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
