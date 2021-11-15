import { get } from './base'

// 热门搜索
export function getHotKeys () {
  return get('/api/getHotKeys')
}
