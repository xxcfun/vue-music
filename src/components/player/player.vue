<template>
  <div class="player" v-show="playList.length">
    <!-- 全屏播放器 -->
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player"
           v-show="fullScreen">
        <!-- 背景图片 -->
        <div class="background">
          <img :src="currentSong.pic" alt="">
        </div>
        <!-- 头部 -->
        <div class="top">
          <!-- 返回按钮 -->
          <div class="back"
               @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <!-- 唱片 -->
        <div class="middle"
             @touchstart.prevent="onMiddleTouchStart"
             @touchmove.prevent="onMiddleTouchMove"
             @touchend.prevent="onMiddleTouchEnd"
        >
          <!-- 旋转图片 -->
          <div class="middle-l"
               :style="middleLStyle">
            <div class="cd-wrapper"
                 ref="cdWrapperRef">
              <div ref="cdRef"
                   class="cd">
                <img ref="cdImageRef"
                     class="image"
                     :class="cdCls"
                     :src="currentSong.pic" alt="">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <!-- 滚动歌词 -->
          <scroll class="middle-r"
                  :style="middleRStyle"
                  ref="lyricScrollRef">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p class="text"
                   :class="{'current': currentLineNum === index}"
                   v-for="(line, index) in currentLyric.lines"
                   :key="line.num"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <!-- 滑块 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="barRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"/>
            </div>
            <span class="time time-r">{{ formatTime(currentSong.duration) }}</span>
          </div>
          <!-- 操作按钮 -->
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- mini播放器 -->
    <mini-player :progress="progress" :toggle-play="togglePlay"/>
    <audio ref="audioRef"
           @pause="pause"
           @canplay="ready"
           @error="error"
           @timeupdate="updateTime"
           @ended="end"
    ></audio>
  </div>
</template>

<script>
  import { useStore } from 'vuex'
  import { computed, watch, ref, nextTick } from 'vue'
  import useMode from './use-mode'
  import useFavorite from './use-favorite'
  import useCd from './use-cd'
  import useLyric from './use-lyric'
  import useMiddleInteractive from './use-middle-interactive'
  import useAnimation from './use-animation'
  import ProgressBar from './progress-bar'
  import Scroll from '../base/scroll/scroll'
  import MiniPlayer from './mini-player'
  import { formatTime } from '@/assets/js/utils'
  import { PLAY_MODE } from '@/assets/js/constant'

  export default {
    name: 'player',
    components: { MiniPlayer, Scroll, ProgressBar },
    setup () {
      /*
      * data
      * */
      const audioRef = ref(null)
      const barRef = ref(null)
      const songReady = ref(false)
      const currentTime = ref(0)
      let progressChanging = false

      /*
      * veux
      * */
      const store = useStore()
      const fullScreen = computed(() => store.state.fullScreen)
      const currentSong = computed(() => store.getters.currentSong)
      const playing = computed(() => store.state.playing)
      const currentIndex = computed(() => store.state.currentIndex)
      const playMode = computed(() => store.state.playMode)

      /*
      * hooks
      * */
      const { modeIcon, changeMode } = useMode()
      const { getFavoriteIcon, toggleFavorite } = useFavorite()
      const { cdCls, cdRef, cdImageRef } = useCd()
      const { currentLyric, currentLineNum, pureMusicLyric, playingLyric, lyricListRef, lyricScrollRef, playLyric, stopLyric } = useLyric({ songReady, currentTime })
      const { currentShow, middleLStyle, middleRStyle, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd } = useMiddleInteractive()
      const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation()

      /*
      * computed
      * */
      const playList = computed(() => store.state.playList)

      // playing为false，按钮为暂停，true为播放
      const playIcon = computed(() => {
        return playing.value ? 'icon-pause' : 'icon-play'
      })

      // 歌曲进度
      const progress = computed(() => {
        return currentTime.value / currentSong.value.duration
      })

      // 在歌曲没有准备好时，给按钮一个disable样式，让其不能点击
      const disableCls = computed(() => {
        return songReady.value ? '' : 'disable'
      })

      /*
      * watch
      * */
      // 监听当前歌曲，赋值给audio
      watch(currentSong, (newSong) => {
        console.log(newSong)
        if (!newSong.id || !newSong.url) {
          return
        }
        // 当歌曲变化的时候，songReady置为false，时间置为0
        currentTime.value = 0
        songReady.value = false
        const audioEl = audioRef.value
        audioEl.src = newSong.url
        audioEl.play()
        store.commit('setPlayingState', true)
      })

      // 监听audio里面暂停与播放
      watch(playing, (newPlaying) => {
        if (!songReady.value) {
          // 歌曲没有准备好，啥事不干
          return
        }
        const audioEl = audioRef.value
        if (newPlaying) {
          audioEl.play()
          playLyric()
        } else {
          audioEl.pause()
          stopLyric()
        }
      })

      // 监听mini播放器改为全屏播放器时进度条的变化
      watch(fullScreen, async (newFullScreen) => {
        if (newFullScreen) {
          // 将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它
          await nextTick()
          barRef.value.setOffset(progress.value)
        }
      })

      /*
      * methods
      * */
      // 返回按钮，把fullScreen置为false
      function goBack () {
        store.commit('setFullScreen', false)
      }

      // 按钮反转
      function togglePlay () {
        if (!songReady.value) {
          return
        }
        store.commit('setPlayingState', !playing.value)
      }

      // 监听audio，非用户触发暂停时状态置为false，防止出现audio暂停，但状态还为false，按钮还是播放状态的情况
      function pause () {
        store.commit('setPlayingState', false)
      }

      // 切换上一首歌，currentIndex-1
      function prev () {
        const list = playList.value
        if (!songReady.value || !list.length) {
          return
        }
        if (list.length === 1) {
          loop()
        } else {
          let index = currentIndex.value - 1
          // 处理边界情况，第一首歌时，上一首链接到列表内的最后一首歌
          if (index === -1) {
            index = list.length - 1
          }
          store.commit('setCurrentIndex', index)
        }
      }

      // 切换下一首歌，currentIndex+1
      function next () {
        const list = playList.value
        if (!songReady.value || !list.length) {
          return
        }
        if (list.length === 1) {
          loop()
        } else {
          let index = currentIndex.value + 1
          // 处理边界情况，第一首歌时，上一首链接到列表内的最后一首歌
          if (index === list.length) {
            index = 0
          }
          store.commit('setCurrentIndex', index)
        }
      }

      // 循环播放
      function loop () {
        const audioEl = audioRef.value
        audioEl.currentTime = 0
        audioEl.play()
        store.commit('setPlayingState', true)
      }

      // 准备歌曲
      function ready () {
        if (songReady.value) {
          return
        }
        songReady.value = true
        playLyric()
      }

      // 监听error，歌曲出错时允许切换歌曲
      function error () {
        songReady.value = true
      }

      // 监听播放时间，这里控制歌曲播放的时间位置
      function updateTime (e) {
        if (!progressChanging) {
          currentTime.value = e.target.currentTime
        }
      }

      // 监听拖动时的操作，改变左侧的时间
      function onProgressChanging (progress) {
        progressChanging = true
        currentTime.value = currentSong.value.duration * progress
        // 同步歌词列表，手指没有松开，歌词不能播放，等changed时再播放
        playLyric()
        stopLyric()
      }

      // 监听拖动后的操作，修改播放的时间
      function onProgressChanged (progress) {
        progressChanging = false
        audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
        // 当歌曲暂停的时候，拖动进度条，歌曲会播放
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
        playLyric()
      }

      // 歌曲播放完后面的操作
      function end () {
        // 时间重置为0
        currentTime.value = 0
        // 如果播放模式为循环播放，那么就循环，如果不是，就执行下一步
        if (playMode.value === PLAY_MODE.loop) {
          loop()
        } else {
          next()
        }
      }

      return {
        audioRef,
        barRef,
        currentTime,
        fullScreen,
        currentSong,
        playList,
        playIcon,
        progress,
        disableCls,
        goBack,
        togglePlay,
        pause,
        prev,
        next,
        ready,
        error,
        updateTime,
        formatTime,
        onProgressChanging,
        onProgressChanged,
        end,
        // mode
        modeIcon,
        changeMode,
        // favorite
        getFavoriteIcon,
        toggleFavorite,
        // cd
        cdCls,
        cdRef,
        cdImageRef,
        // lyric
        currentLyric,
        currentLineNum,
        pureMusicLyric,
        playingLyric,
        lyricListRef,
        lyricScrollRef,
        // middleinteractive
        currentShow,
        middleLStyle,
        middleRStyle,
        onMiddleTouchStart,
        onMiddleTouchMove,
        onMiddleTouchEnd,
        // animation
        cdWrapperRef,
        enter,
        afterEnter,
        leave,
        afterLeave
      }
    }
  }
</script>

<style scoped lang="scss">
  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background;
      // 背景图片
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);

        img {
          width: 100%;
          height: 100%;
        }
      }
      // 头部
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
        }
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      // 唱片
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        // 旋转图片
        .middle-l {
          display: inline-block;
          /*display: none; // 调试歌词用*/
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
              .playing {
                animation: rotate 20s linear infinite;
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        // 滚动歌词
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      }
      // 底部
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        // 滑动块
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
            }
          }
        }
        // 进度条
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0 auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 40px;
            line-height: 30px;
            width: 40px;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        // 操作按钮
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left;
          }
          // 点喜欢的时候按钮变红
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all .6s;
        .top, .bottom {
          transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
        }
      }
      &.normal-enter-from, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0);
        }
      }
    }
  }
</style>
