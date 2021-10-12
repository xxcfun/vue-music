// 洗牌算法
export function shuffle(source) {
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

// 获取0-max之间的函数
function getRandomInt (max) {
  return Math.floor(Math.random() * (max + 1))
}

// 交换坐标
function swap (arr, i, j) {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}
