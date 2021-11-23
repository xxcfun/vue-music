import axios from 'axios'

const ERR_OK = 0
const baseURL = process.env.NODE_PATH === 'production' ? 'http://music.qnmlgb.top:2233/music-moyu/' : '/'

axios.defaults.baseURL = baseURL

export function get (url, params) {
  return axios.get(url, {
    params
  }).then((res) => {
    const serverData = res.data
    if (serverData.code === ERR_OK) {
      return serverData.result
    }
  }).catch((e) => {
    console.log(e)
  })
}
