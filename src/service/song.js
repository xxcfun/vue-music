import { get } from './base'

export function processSongs (songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((result) => {
    const map = result.map
    return songs.map((song) => {
      // 拿到歌曲的url
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      // 过滤字段，返回前端的url都是能够播放的
      return song.url.indexOf('vkey') > -1
    })
  })
}
