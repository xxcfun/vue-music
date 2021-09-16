import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(Slide)

export default function useSlider(wrapperRef) {
  const slider = ref(null)
  const currentPageIndex = ref(0)

  onMounted(() => {
    const sliderVal = slider.value = new BScroll(wrapperRef.value, {
      // 开启点击
      click: true,
      // slide方向为横向，这里不能和Y一块设置成true
      scrollX: true,
      scrollY: false,
      // 用来避免惯性动画带来的快速滚动时的闪烁的问题和快速滑动时一次滚动多页的问题
      momentum: false,
      // 防止在循环衔接的时候出现闪烁
      bounce: false,
      // 监听 slideWillChange 事件，在用户拖动 slide 时，实时获取到 slide 的 PageIndex 的改变
      probeType: 2,
      // 开启slide
      slide: true
    })

    sliderVal.on('slideWillChange', (page) => {
      currentPageIndex.value = page.pageX
    })
  })

  onUnmounted(() => {
    slider.value.destroy()
  })

  return {
    slider,
    currentPageIndex
  }
}
