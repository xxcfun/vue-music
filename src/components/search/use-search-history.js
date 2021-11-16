import { remove, save, clear } from '../../assets/js/array-store'
import { SEARCH_KEY } from '../../assets/js/constant'
import { useStore } from 'vuex'

export default function useSearchHistory () {
  const maxLen = 100

  const store = useStore()

  // 保存搜索历史
  function saveSearch (query) {
    const searches = save(query, SEARCH_KEY, (item) => {
      return item === query
    }, maxLen)
    store.commit('setSearchHistory', searches)
  }

  // 删除单个搜索历史
  function deleteSearch(query) {
    const searches = remove(SEARCH_KEY, (item) => {
      return item === query
    })
    store.commit('setSearchHistory', searches)
  }

  // 清空所有搜索历史
  function clearSearch () {
    const searches = clear(SEARCH_KEY)
    store.commit('setSearchHistory', searches)
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch
  }
}
