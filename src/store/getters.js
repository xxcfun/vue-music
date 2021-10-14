// 通过播放列表和播放索引来计算出当前播放的歌曲
export const currentSong = (state) => {
  // 在取不到歌曲时，返回的是一个undefault或一个空对象，防止后面因为取不到歌曲而报错
  return state.playList[state.currentIndex] || {}
}
