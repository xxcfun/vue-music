<template>
  <!-- 宣传广告滚动组件 -->
  <div class="slider" ref="rootRef">
    <!-- 广告图 -->
    <div class="slider-group">
      <div class="slider-page"
           v-for="item in sliders"
           :key="item.id"
      >
        <a :href="item.link">
          <img :src="item.pic" alt="">
        </a>
      </div>
    </div>
    <!-- 控制按钮 -->
    <div class="dots-wrapper">
      <span class="dot"
            v-for="(item, index) in sliders"
            :key="item.id"
            :class="{'active': currentPageIndex === index}"
      ></span>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue'
  import useSlider from './use-slider'

  export default {
    name: 'slider',
    props: {
      sliders: {
        type: Array,
        default() {
          return []
        }
      }
    },
    setup (props) {
      const rootRef = ref(null)
      const { currentPageIndex } = useSlider(rootRef)

      return {
        rootRef,
        currentPageIndex
      }
    }
  }
</script>

<style scoped lang="scss">
  .slider {
    min-height: 1px;
    font-size: 0;
    touch-action: pan-y;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        transform: translate3d(0, 0 ,0);
        backface-visibility: hidden;
        a {
          display: block;
          width: 100%;
        }
        img {
          display: block;
          width: 100%;
        }
      }
    }
    .dots-wrapper {
      position: absolute;
      left: 50%;
      bottom: 12px;
      line-height: 12px;
      transform: translateX(-50%);
      .dot {
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: $color-text-l;
        &.active {
          width: 20px;
          border-radius: 5px;
          background: $color-text-ll;
        }
      }
    }
  }
</style>
