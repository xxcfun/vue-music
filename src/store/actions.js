import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/utils'

// 定义选择播放
export function selectPlay ({ commit, state }, { list, index }) {
  // 顺序播放
  commit('setPlayMode', PLAY_MODE.sequence)
  // 原始播放列表
  commit('setSequenceList', list)
  // 播放状态为正在播放
  commit('setPlayingState', true)
  // 进入全屏播放
  commit('setFullScreen', true)
  // 播放列表，顺序播放时原始列表就是播放列表
  commit('setPlayList', list)
  // 当前播放的索引
  commit('setCurrentIndex', index)
}

// 定义随机播放
export function randomPlay ({ commit }, list) {
  // 随机播放
  commit('setPlayMode', PLAY_MODE.random)
  // 原始播放列表
  commit('setSequenceList', list)
  // 播放状态为正在播放
  commit('setPlayingState', true)
  // 进入全屏播放
  commit('setFullScreen', true)
  // 播放列表，顺序播放时原始列表就是播放列表
  // 这里引用一个洗牌算法，将播放列表的顺序打乱来实现随机播放
  commit('setPlayList', shuffle(list))
  // 随机播放索引就没必要了，直接写0
  commit('setCurrentIndex', 0)
}
