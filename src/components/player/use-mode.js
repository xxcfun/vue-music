import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'

export default function useMode() {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  // 根据顺序、随机、循环播放而改变图标
  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence ? 'icon-sequence' : playModeVal === PLAY_MODE.random ? 'icon-random' : 'icon-loop'
  })

  // 点击图标，改变播放方式
  function changeMode () {
    const mode = (playMode.value + 1) % 3
    // 分发一个changeMode给action
    store.dispatch('changeMode', mode)
  }

  return {
    modeIcon,
    changeMode
  }
}
