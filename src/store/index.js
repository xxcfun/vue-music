import { createStore, createLogger } from 'vuex'
import state from './state'
import mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  mutations,
  getters,
  actions,
  // 严格模式
  strict: debug,
  // 如果是开发环境就启用logger插件
  plugins: debug ? [createLogger()] : []
})
