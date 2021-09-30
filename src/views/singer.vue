<template>
  <!-- 歌手页面 -->
  <div class="singer" v-loading="loading">
    <index-list
      :data="singers"
      @select="selectSinger"
    />
  </div>
  <router-view :singer="selectedSinger"></router-view>
</template>

<script>
  import { getSingerList } from '../service/singer'
  import IndexList from '../components/base/index-list/index-list'

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
      selectSinger (singer) {
        this.selectedSinger = singer
        this.$router.push({ path: `/singer/${singer.mid}` })
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
