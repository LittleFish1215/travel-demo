import axios from 'axios'
// import { Spin } from 'iview'
import publicConfig from '@/config'
import errorHandle from './errorHandle'
import { getToken } from './util'

const CancelToken = axios.CancelToken
class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.pending = {}
  }

  // 获取axios配置
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      timeout: 10000
    }
    return config
  }

  removePending (key, isRequest = false) {
    if (this.pending[key] && isRequest) {
      this.pending[key]('取消重复请求')
    }
    delete this.pending[key]
  }

  // 设定拦截器
  interceptors (instance) {
    // 请求拦截器
    instance.interceptors.request.use(
      (config) => {
        // Do something before request is sent
        let isPublic = false
        publicConfig.publicPath.map((path) => {
          isPublic = isPublic || path.test(config.url)
        })
        const token = getToken()
        if (!isPublic && token) {
          config.headers.Authorization = 'Bearer ' + token
        }
        const key = config.url + '&' + config.method
        this.removePending(key, true)
        config.cancelToken = new CancelToken((c) => {
          this.pending[key] = c
        })
        return config
      },
      (err) => {
        // debugger
        errorHandle(err)
        // Do something with request error
        return Promise.reject(err)
      }
    )

    // 响应请求的拦截器
    instance.interceptors.response.use(
      (res) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        const key = res.config.url + '&' + res.config.method
        this.removePending(key)
        if (res.status === 200) {
          return Promise.resolve(res.data)
        } else {
          return Promise.reject(res)
        }
      },
      (err) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        // debugger
        errorHandle(err)
        return Promise.reject(err)
      }
    )
  }

  // 创建实例
  request (options) {
    const instance = axios.create()
    const newOptions = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance)
    return instance(newOptions)
  }

  get (url, config) {
    const options = Object.assign(
      {
        method: 'get',
        url: url
      },
      config
    )
    return this.request(options)
  }

  post (url, data) {
    return this.request({
      method: 'post',
      url: url,
      data: data
    })
  }
}
export default HttpRequest
