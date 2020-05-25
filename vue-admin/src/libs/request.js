import HttpRequest from '@/libs/axios'
import config from '@/config'
import { getToken } from '@/libs/util'
import qs from 'qs'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const axios = new HttpRequest(baseUrl)

const request = (url, method, dataset = {}) => {
  return axios.request({
    url: url,
    headers: {
      Authorization: 'Bearer ' + getToken(),
      'Content-Type': 'application/json',
      'cached-control': 'no-cache'
    },
    method: method,
    [method === 'get' ? 'params' : 'data']: dataset,
    paramsSerializer: function (params) {
      return qs.stringify(params)
    }
  })
}

export {
  axios,
  request
}
