<template>
  <!-- 歌手详情页面 -->
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    />
  </div>
</template>

<script>
  import { getSingerDetail } from '../service/singer'
  import { processSongs } from '../service/song'
  import MusicList from '../components/music-list/music-list'

  export default {
    name: 'singer-detail',
    components: { MusicList },
    props: {
      singer: Object
    },
    data () {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      title () {
        return this.singer && this.singer.name
      },
      pic () {
        return this.singer && this.singer.pic
      }
    },
    async created () {
      const result = await getSingerDetail(this.singer)
      this.songs = await processSongs(result.songs)
      this.loading = false
    }
  }
</script>

<style scoped lang="scss">
  .singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $color-background;
  }
</style>
