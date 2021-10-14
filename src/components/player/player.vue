<template>
  <!-- 播放器 -->
  <div class="player">
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
      <!-- 底部 -->
      <div class="bottom">
        <!-- 操作按钮 -->
        <div class="operators">
          <div class="icon i-left">
            <i class="icon-sequence"></i>
          </div>
          <div class="icon i-left">
            <i class="icon-prev"></i>
          </div>
          <div class="icon i-center"
               @click="togglePlay">
            <i :class="playIcon"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <audio ref="audioRef" @pause="pause"></audio>
  </div>
</template>

<script>
  import { useStore } from 'vuex'
  import { computed, watch, ref } from 'vue'

  export default {
    name: 'player',
    setup () {
      const audioRef = ref(null)

      const store = useStore()
      const fullScreen = computed(() => store.state.fullScreen)
      const currentSong = computed(() => store.getters.currentSong)
      const playing = computed(() => store.state.playing)

      // playing为false，按钮为暂停，true为播放
      const playIcon = computed(() => {
        return playing.value ? 'icon-pause' : 'icon-play'
      })

      // 监听当前歌曲，赋值给audio
      watch(currentSong, (newSong) => {
        console.log(newSong)
        if (!newSong.id || !newSong.url) {
          return
        }
        const audioEl = audioRef.value
        audioEl.src = newSong.url
        audioEl.play()
      })

      // 监听audio里面暂停与播放
      watch(playing, (newPlaying) => {
        const audioEl = audioRef.value
        newPlaying ? audioEl.play() : audioEl.pause()
      })

      // 返回按钮，把fullScreen置为false
      function goBack () {
        store.commit('setFullScreen', false)
      }

      // 按钮反转
      function togglePlay () {
        store.commit('setPlayingState', !playing.value)
      }

      // 监听audio，非用户触发暂停时状态置为false，防止出现audio暂停，但状态还为false，按钮还是播放状态的情况
      function pause () {
        store.commit('setPlayingState', false)
      }

      return {
        audioRef,
        fullScreen,
        currentSong,
        playIcon,
        goBack,
        togglePlay,
        pause
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
      // 底部
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
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
    }
  }
</style>
