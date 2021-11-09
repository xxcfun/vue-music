<template>
  <!-- 歌手页面 -->
  <div class="singer" v-loading="loading">
    <index-list
      :data="singers"
      @select="selectSinger"
    />
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
  import { getSingerList } from '../service/singer'
  import IndexList from '../components/index-list/index-list'
  import storage from 'good-storage'
  import { SINGER_KEY } from '../assets/js/constant'

  export default {
    name: 'singer',
    components: { IndexList },
    data () {
      return {
        singers: [],
        selectedSinger: null
      }
    },
    computed: {
      loading () {
        return !this.singers.length
      }
    },
    async created () {
      const result = await getSingerList()
      this.singers = result.singers
    },
    methods: {
      // 从列表组件中拿到歌手信息，传到歌手详情组件中
      selectSinger (singer) {
        this.selectedSinger = singer
        this.cacheSinger(singer)
        this.$router.push({ path: `/singer/${singer.mid}` })
      },
      // 缓存singer
      cacheSinger (singer) {
        storage.session.set(SINGER_KEY, singer)
      }
    }
  }
</script>

<style scoped lang="scss">
  .singer {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
</style>
