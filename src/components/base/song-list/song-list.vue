<template>
  <!-- 歌曲列表组件 -->
  <ul class="song-list">
    <li class="item"
        v-for="song in songs"
        :key="song.id"
    >
      <div class="content">
        <h2 class="name">{{ song.name }}</h2>
        <!-- 描述由名称+专辑组成 -->
        <p class="desc">{{ getDesc(song) }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'song-list',
    props: {
      songs: {
        type: Array,
        default () {
          return []
        }
      }
    },
    methods: {
      getDesc (song) {
        return `${song.name} · ${song.album}`
      }
    }
  }
</script>

<style scoped lang="scss">
  .song-list {
    .item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      font-size: $font-size-medium;
      .content {
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          @include no-wrap();
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          margin-top: 4px;
          color: $color-text-d;
        }
      }
    }
  }
</style>
