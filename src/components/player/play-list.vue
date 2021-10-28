<template>
  <teleport to="body">
    <!-- 播放列表 -->
    <!-- teleport 用途: 可以控制HTML片段指定在某一父节点下呈现/渲染，而不必诉诸全局状态或将其拆分为两个组件 -->
    <transition name="list-fade">
      <div class="play-list"
           v-show="visible && playList.length"
           @click="hide"
      >
        <div class="list-wrapper" @click.stop>
          <!-- 随机 循序 顺序 播放按钮 -->
          <div class="list-header">
            <h1 class="title">
              <i class="icon"
                 :class="modeIcon"
                 @click="changeMode"
              ></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <!-- 播放列表 -->
          <scroll class="list-content"
                  ref="scrollRef"
          >
            <transition-group
              ref="listRef"
              name="list"
              tag="ul"
            >
              <li class="item"
                  v-for="song in sequenceList"
                  :key="song.id"
                  @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span
                  class="delete"
                  @click.stop="removeSong(song)"
                  :class="{'disable': removing}"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>
        <confirm
          ref="confirmRef"
          @confirm="confirmClear"
          text="是否清空播放列表"
          confirmBtnText="清空"
        ></confirm>
      </div>
    </transition>
  </teleport>
</template>

<script>
  import Scroll from '../base/scroll/scroll'
  import { ref, computed, nextTick, watch } from 'vue'
  import { useStore } from 'vuex'
  import useMode from './use-mode'
  import useFavorite from './use-favorite'
  import Confirm from '../base/confirm/confirm'

  export default {
    name: 'play-list',
    components: { Confirm, Scroll },
    setup () {
      // data
      const visible = ref(false)
      const removing = ref(false)
      const scrollRef = ref(null)
      const listRef = ref(null)
      const confirmRef = ref(null)

      // vuex
      const store = useStore()
      const playList = computed(() => store.state.playList)
      const sequenceList = computed(() => store.state.sequenceList)
      const currentSong = computed(() => store.getters.currentSong)

      // hooks
      const { modeIcon, modeText, changeMode } = useMode()
      const { getFavoriteIcon, toggleFavorite } = useFavorite()

      // 监听当前歌曲变化
      watch(currentSong, async (newSong) => {
        if (!visible.value || !newSong.id) {
          return
        }
        await nextTick()
        scrollToCurrent()
      })

      function getCurrentIcon (song) {
        if (song.id === currentSong.value.id) {
          return 'icon-play'
        }
      }

      async function show () {
        visible.value = true
        await nextTick()
        refreshScroll()
        scrollToCurrent()
      }

      function hide () {
        visible.value = false
      }

      // 列表实现切歌
      function selectItem (song) {
        const index = playList.value.findIndex((item) => {
          return song.id === item.id
        })

        store.commit('setCurrentIndex', index)
        store.commit('setPlayingState', true)
      }

      // 重载scroll实例
      function refreshScroll () {
        scrollRef.value.scroll.refresh()
      }

      // 定位当前播放歌曲
      function scrollToCurrent () {
        const index = sequenceList.value.findIndex((song) => {
          return currentSong.value.id === song.id
        })
        if (index === -1) {
          return
        }
        const target = listRef.value.$el.children[index]

        scrollRef.value.scroll.scrollToElement(target, 300)
      }

      // 列表删除歌曲
      function removeSong (song) {
        if (removing.value) {
          return
        }
        removing.value = true
        store.dispatch('removeSong', song)
        if (!playList.value.length) {
          hide()
        }
        setTimeout(() => {
          removing.value = false
        }, 300)
      }

      // 唤起confirm
      function showConfirm () {
        confirmRef.value.show()
      }

      // 清空歌曲的逻辑
      function confirmClear () {
        store.dispatch('clearSongList')
        // visible置为false
        hide()
      }

      return {
        visible,
        removing,
        scrollRef,
        listRef,
        confirmRef,
        playList,
        sequenceList,
        getCurrentIcon,
        show,
        hide,
        selectItem,
        removeSong,
        showConfirm,
        confirmClear,
        // mode
        modeIcon,
        modeText,
        changeMode,
        // favorite
        getFavoriteIcon,
        toggleFavorite
      }
    }
  }
</script>

<style scoped lang="scss">
  .play-list {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;
    &.list-fade-enter-active, &.list-fade-live-active {
      transition: opacity .3s;
      .list-wrapper {
        transition: all .3s;
      }
    }
    &.list-fade-enter-from, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 210;
      width: 100%;
      background-color: $color-highlight-background;
      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            font-size: 24px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
      .list-content {
        max-height: 400px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-d;
          }
          .favorite {
            @include extend-click();
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
          }
        }
      }
      .list-footer {
        text-align: center;
        line-height: 50px;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>
