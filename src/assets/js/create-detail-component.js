import MusicList from '../../components/music-list/music-list'
import storage from 'good-storage'
import { processSongs } from '../../service/song'

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: { MusicList },
    props: {
      data: Object
    },
    data () {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      // 返回data
      computedData () {
        let ret = null
        const data = this.data
        if (data) {
          ret = data
        } else {
          const cached = storage.session.get(key)
          // 当前页面拿到data
          if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
            ret = cached
          }
        }
        return ret
      },
      // 返回标题
      title () {
        const data = this.computedData
        return data && (data.name || data.title)
      },
      // 返回图片
      pic () {
        const data = this.computedData
        return data && data.pic
      }
    },
    async created () {
      const data = this.computedData
      // 如果拿不到data的值，那么进行路由回退
      if (!data) {
        const path = this.$route.matched[0].path
        this.$router.push({ path })
        return
      }
      const result = await fetch(data)
      this.songs = await processSongs(result.songs)
      this.loading = false
    }
  }
}
