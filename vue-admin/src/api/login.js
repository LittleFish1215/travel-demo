/**
 * 登录相关接口
 */

import { axios } from '@/libs/request'

/**
 * 登录接口
 * @param {*} loginInfo 用户登录信息
 */
const login = (loginInfo) => {
  return axios.post('/login/login', {
    ...loginInfo
  })
}

/**
 * 注册接口
 * @param {*} regInfo 用户注册信息
 */
const reg = (regInfo) => {
  return axios.post('/login/reg', {
    ...regInfo
  })
}

export {
  login,
  reg
}
