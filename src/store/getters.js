// 通过播放列表和播放索引来计算出当前播放的歌曲
export const currentSong = (state) => {
  return state.playList[state.currentIndex]
}
