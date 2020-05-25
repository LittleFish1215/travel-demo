/**
 * @description 攻略相关接口
 */

import { axios } from '@/libs/request'
import qs from 'qs'

// 获取攻略列表
const getStrategyList = (options) => {
  return axios.get('/public/strategy/list?' + qs.stringify(options))
}

// 删除攻略
const deleteStrategyById = (ids) => {
  return axios.post('/strategy/delete', { ids })
}

// 更新攻略
const updateStrategyById = (data) => {
  return axios.post('/strategy/update', data)
}

// 添加攻略
const addStrategy = (data) => {
  return axios.post('/strategy/add', data)
}

export {
  getStrategyList,
  deleteStrategyById,
  updateStrategyById,
  addStrategy
}
