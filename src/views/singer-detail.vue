<template>
  <div class="singer-detail">
    <!-- 歌手详情页面 -->
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
  import storage from 'good-storage'
  import { SINGER_KEY } from '../assets/js/constant'

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
      // 返回singer
      computedSinger () {
        let ret = null
        const singer = this.singer
        if (singer) {
          ret = singer
        } else {
          const cacheSinger = storage.session.get(SINGER_KEY)
          // 当前页面拿到singer
          if (cacheSinger && cacheSinger.mid === this.$route.params.id) {
            ret = cacheSinger
          }
        }
        return ret
      },
      // 返回标题
      title () {
        const singer = this.computedSinger
        return singer && singer.name
      },
      // 返回图片
      pic () {
        const singer = this.computedSinger
        return singer && singer.pic
      }
    },
    async created () {
      // 如果拿不到singer的值，那么进行路由回退
      if (!this.computedSinger) {
        const path = this.$route.matched[0].path
        this.$router.push({ path })
        return
      }
      const result = await getSingerDetail(this.computedSinger)
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
