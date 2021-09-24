import { computed, ref } from 'vue'

export default function useShortcut(props, groupRef) {
  const scrollRef = ref(null)
  const touch = {}
  const ANCHOR_HEIGHT = 18

  // 拿到所有的title值，填充右侧的滚动列表
  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  // 点击后跳转
  function onShortcutTouchStart (e) {
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex

    scrollTo(anchorIndex)
  }

  // 滑动后跳转
  function onShortcutTouchMove (e) {
    touch.y2 = e.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    const anchorIndex = touch.anchorIndex + delta

    scrollTo(anchorIndex)
  }

  // 这里封装一个函数，根据索引进行滚动
  function scrollTo (index) {
    // 如果index是NaN，则什么都不做
    if (isNaN(index)) {
      return
    }
    // 限定索引的位置在所滑动的范围内
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
