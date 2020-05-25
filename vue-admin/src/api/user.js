/**
 * @description 用户相关接口
*/

import { axios } from '@/libs/request'
import { getToken } from '../libs/util'

const getUserInfo = () => {
  return axios.get('/public/info', {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  })
}

export { getUserInfo }
