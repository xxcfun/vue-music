<template>
  <div class="singer" v-loading="loading">
    <index-list :data="singers"/>
  </div>
</template>

<script>
  import { getSingerList } from '../service/singer'
  import IndexList from '../components/base/index-list/index-list'

  export default {
    name: 'singer',
    components: { IndexList },
    data () {
      return {
        singers: []
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
