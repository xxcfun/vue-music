<template>
  <!-- 添加歌曲组件 -->
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <!-- 搜索框组件 -->
        <div class="search-input-wrapper">
          <search-input v-model="query"
                        placeholder="搜索歌曲"
          />
        </div>
        <div v-show="!query">
          <switches :items="['最近播放', '搜索历史']"
                    v-model="currentIndex"
          />
          <div class="list-wrapper">
            <!-- 最近播放 -->
            <scroll v-if="currentIndex === 0"
                    class="list-scroll"
                    ref="scrollRef"
            >
              <div class="list-inner">
                <song-list
                  :songs="playHistory"
                  @select="selectSongBySongList"
                />
              </div>
            </scroll>
            <!-- 搜索历史 -->
            <scroll v-if="currentIndex === 1"
                    class="list-scroll"
                    ref="scrollRef"
            >
              <div class="list-inner">
                <search-list
                  :searches="searchHistory"
                  :show-delete="false"
                  @select="addQuery"
                />
              </div>
            </scroll>
          </div>
        </div>
        <!-- 搜索结果 -->
        <div class="search-result" v-show="query">
          <suggest
            :query="query"
            :show-singer="false"
            @select-song="selectSongBySuggest"
          />
        </div>
        <message ref="messageRef">
          <div class="message-title">
            <i class="icon-ok"></i>
            <span class="text">1首歌曲已经添加到播放列表</span>
          </div>
        </message>
      </div>
    </transition>
  </teleport>
</template>

<script>
  import SearchInput from '../search/search-input'
  import Suggest from '../search/suggest'
  import Switches from '../base/switches/switches'
  import Scroll from '../wrap-scroll'
  import SongList from '../base/song-list/song-list'
  import SearchList from '../base/search-list/search-list'
  import Message from '../base/message/message'
  import { ref, computed, nextTick, watch } from 'vue'
  import { useStore } from 'vuex'
  import useSearchHistory from '../search/use-search-history'

  export default {
    name: 'add-song',
    components: { Message, SearchList, SongList, Scroll, Switches, Suggest, SearchInput },
    setup () {
      const visible = ref(false)
      const query = ref('')
      const currentIndex = ref(0)
      const scrollRef = ref(null)
      const messageRef = ref(null)

      const store = useStore()
      const searchHistory = computed(() => store.state.searchHistory)
      const playHistory = computed(() => store.state.playHistory)

      const { saveSearch } = useSearchHistory()

      // 监听query的变化来刷新scroll
      watch(query, async () => {
        await nextTick()
        refreshScroll()
      })

      async function show () {
        visible.value = true
        await nextTick()
        refreshScroll()
      }

      function hide () {
        visible.value = false
      }

      // 刷新scroll
      function refreshScroll () {
        scrollRef.value.scroll.refresh()
      }

      // 选中歌曲操作
      function addQuery (s) {
        query.value = s
      }

      // 从歌曲列表选中歌曲
      function selectSongBySongList ({ song }) {
        addSong(song)
      }

      // 从建议列表选中歌曲
      function selectSongBySuggest (song) {
        addSong(song)
        // 再加入播放列表后，再保存搜索的结果到搜索历史列表
        saveSearch(query.value)
      }

      // 添加歌曲到当前播放队列
      function addSong (song) {
        store.dispatch('addSong', song)
        // 展示提示文案
        showMessage()
      }

      function showMessage () {
        messageRef.value.show()
      }

      return {
        visible,
        query,
        currentIndex,
        scrollRef,
        messageRef,
        searchHistory,
        playHistory,
        show,
        hide,
        addQuery,
        selectSongBySongList,
        selectSongBySuggest
      }
    }
  }
</script>

<style scoped lang="scss">
  .add-song {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 300;
    background: $color-background;
    .header {
      position: relative;
      height: 44px;
      text-align: center;
      .title {
        line-height: 44px;
        font-size: $font-size-large;
        color: $color-text;
      }
      .close {
        position: absolute;
        top: 0;
        right: 8px;
        .icon-close {
          display: block;
          padding: 12px;
          font-size: 20px;
          color: $color-theme;
        }
      }
    }
    .search-input-wrapper {
      margin: 20px;
    }
    .list-wrapper {
      position: absolute;
      top: 165px;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 20px 30px;
        }
      }
    }
    .search-result {
      position: fixed;
      top: 124px;
      bottom: 0;
      width: 100%;
    }
  }
  .message-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;
    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }
    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
</style>
