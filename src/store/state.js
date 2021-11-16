import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

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
  fullScreen: false,
  // 收藏歌曲列表
  favoriteList: load(FAVORITE_KEY),
  // 搜索历史
  searchHistory: load(SEARCH_KEY)
}

export default state
