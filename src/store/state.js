import { PLAY_MODE } from '@/assets/js/constant'

const state = {
  // 播放列表原始数据（歌曲列表）
  sequenceList: [],
  // 播放列表（真实的播放列表）
  playList: [],
  // 是否正在播放
  playing: false,
  // 播放模式（默认为顺序播放）
  playMode: PLAY_MODE.sequence,
  // 当前播放索引（当前播放的歌曲）
  currentIndex: 0,
  // 播放状态（是否全屏）
  fullScreen: false
}

export default state
