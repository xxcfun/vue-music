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

// 播放模式改变时，列表也随之改变
export function changeMode ({ commit, state, getters }, mode) {
  const currentId = getters.currentSong.id
  if (mode === PLAY_MODE.random) {
    commit('setPlayList', shuffle(state.sequenceList))
  } else {
    commit('setPlayList', state.sequenceList)
  }
  // 新列表中的歌曲仍然是播放中的歌曲
  const index = state.playList.findIndex((song) => {
    return song.id === currentId
  })

  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}

// 列表中删除歌曲
export function removeSong ({ commit, state }, song) {
  const sequenceList = state.sequenceList.slice()
  const playList = state.playList.slice()

  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playList, song)
  if (sequenceIndex < 0 || playIndex < 0) {
    return
  }

  sequenceList.splice(sequenceIndex, 1)
  playList.splice(playIndex, 1)

  let currentIndex = state.currentIndex
  if (playIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit('setSequenceList', sequenceList)
  commit('setPlayList', playList)
  commit('setCurrentIndex', currentIndex)
  if (!playList.length) {
    commit('setPlayingState', false)
  }
}

// 封装一个寻找索引的函数
function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// 清空列表
export function clearSongList ({ commit }) {
  commit('setSequenceList', [])
  commit('setPlayList', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}

// 添加歌曲到队列
export function addSong ({ commit, state }, song) {
  const playList = state.playList.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  const playIndex = findIndex(playList, song)

  // 判断该歌曲是否已经存在列表中
  if (playIndex > -1) {
    // 存在就修改index值，指向该歌曲
    currentIndex = playIndex
  } else {
    // 不存在就加入，再改变index值
    playList.push(song)
    currentIndex = playList.length - 1
  }

  const sequenceIndex = findIndex(sequenceList, song)
  // 如果不存在就加入准备队列
  if (sequenceIndex === -1) {
    sequenceList.push(song)
  }

  commit('setSequenceList', sequenceList)
  commit('setPlayList', playList)
  commit('setCurrentIndex', currentIndex)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
}
