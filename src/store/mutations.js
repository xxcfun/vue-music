const mutations = {
  // 修改播放状态
  setPlayingState (state, playing) {
    state.playing = playing
  },
  // 设置原始播放列表
  setSequenceList (state, list) {
    state.sequenceList = list
  },
  // 设置播放列表
  setPlayList (state, list) {
    state.playList = list
  },
  // 设置播放模式
  setPlayMode (state, mode) {
    state.playMode = mode
  },
  // 设置当前播放索引
  setCurrentIndex (state, index) {
    state.currentIndex = index
  },
  // 设置播放状态是否全屏
  setFullScreen (state, fullScreen) {
    state.fullScreen = fullScreen
  }
}

export default mutations
