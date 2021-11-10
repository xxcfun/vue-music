import { get } from './base'

// 榜单
export function getTopList () {
  return get('/api/getTopList')
}

// 榜单详情
export function getTopDetail (top) {
  return get('/api/getTopDetail', {
    id: top.id,
    period: top.period
  })
}
