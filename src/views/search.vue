<template>
  <!-- 搜索页面 -->
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-input-wrapper">
      <search-input v-model="query"/>
    </div>
    <!-- 热门搜索 -->
    <div class="search-content" v-show="!query">
      <div class="hot-keys">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li
            class="item"
            v-for="item in hotKeys"
            :key="item.id"
            @click="addQuery(item.key)"
          >
            <span>{{ item.key }}</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 搜索结果 -->
    <div class="search-result" v-show="query">
      <suggest :query="query"
               @select-song="selectSong"
               @select-singer="selectSinger"
      />
    </div>
    <!-- 歌手搜索结果 -->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
  import SearchInput from '../components/search/search-input'
  import { ref } from 'vue'
  import { getHotKeys } from '../service/search'
  import Suggest from '../components/search/suggest'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import storage from 'good-storage'
  import { SINGER_KEY } from '../assets/js/constant'

  export default {
    name: 'search',
    components: { Suggest, SearchInput },
    setup () {
      const query = ref('')
      const hotKeys = ref([])
      const selectedSinger = ref(null)

      const store = useStore()

      const router = useRouter()

      getHotKeys().then((result) => {
        hotKeys.value = result.hotKeys
      })

      // 将query置空
      function addQuery (s) {
        query.value = s
      }

      // 选中歌曲
      function selectSong (song) {
        store.dispatch('addSong', song)
      }

      // 选中歌手
      function selectSinger (singer) {
        selectedSinger.value = singer
        // 跳转路由前先进行缓存
        cacheSinger()

        router.push({ path: `/search/${singer.mid}` })
      }

      // 将歌手缓存，逻辑和之前一样
      function cacheSinger (singer) {
        storage.session.set(SINGER_KEY, singer)
      }

      return {
        query,
        hotKeys,
        selectedSinger,
        addQuery,
        selectSong,
        selectSinger
      }
    }
  }
</script>

<style scoped lang="scss">
  .search {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .search-input-wrapper {
      margin: 20px;
    }
    .search-content {
      flex: 1;
      overflow: hidden;
      .hot-keys {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 10px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
    }
    .search-result {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
