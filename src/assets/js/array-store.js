import storage from 'good-storage'

// 插入数组（倒序插入）
function inertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  // 如果存在了，新添加的数组放在队首
  if (index > 0) {
    arr.splice(index, 1)
  }
  // unshift：向数组的开头添加一个或更多元素
  arr.unshift(val)
  // 收藏个数大于收藏列表的个数时，最先收藏的歌曲从数列中删除
  if (maxLen && arr.length > maxLen) {
    // pop：删除数组最后一个元素
    arr.pop()
  }
}

function deleteArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    // splice：删除从index位置开始的第一个数据
    arr.splice(index, 1)
  }
}

// 添加
export function save (item, key, compare, maxLen) {
  const items = storage.get(key, [])
  inertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

// 移除
export function remove (key, compare) {
  const items = storage.get(key, [])
  deleteArray(items, compare)
  storage.set(key, items)
  return items
}

// 本地加载storage里面的存储数列
export function load (key) {
  return storage.get(key, [])
}

// 清空
export function clear (key) {
  storage.remove(key)
  return []
}

// 全部保存方法
export function saveAll (items, key) {
  storage.set(key, items)
}
