import { computed, watch, ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default function useMiniSlider() {
  const sliderWrapperRef = ref(null)
  const slider = ref(null)

  const store = useStore()
  const fullScreen = computed(() => store.state.fullScreen)
  const playList = computed(() => store.state.playList)
  const currentIndex = computed(() => store.state.currentIndex)

  const sliderShow = computed(() => {
    return !fullScreen.value && !!playList.value
  })

  // slider组件挂载的时候
  onMounted(() => {
    let sliderVal
    // 监听slider，初始化slider实列
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick()
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })
          // 监听slidePageChanged，把当前索引赋值给currentIndex，实现切歌的功能
          sliderVal.on('slidePageChanged', ({ pageX }) => {
            store.commit('setCurrentIndex', pageX)
          })
        } else {
          sliderVal.refresh()
        }
        /*
        * pageX：横向滚动到对应索引的page
        * pageY：纵向滚动到对应索引的page
        * time：动画时长
        * */
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    // 监听当前播放的歌曲索引
    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })

    // 监听列表变化，刷新dom
    watch(playList, async (newlist) => {
      if (sliderVal && sliderShow.value && newlist.length) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })

  // 组件销毁的时候
  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  return {
    slider,
    sliderWrapperRef
  }
}
