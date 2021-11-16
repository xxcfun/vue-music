import { get } from './base'

// 热门搜索
export function getHotKeys () {
  return get('/api/getHotKeys')
}

// 搜索查询
export function search (query, page, showSinger) {
  return get('/api/search', {
    query,
    page,
    showSinger
  })
}
