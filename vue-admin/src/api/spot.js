/**
 * @description 景点相关接口
 */

import { axios } from '@/libs/request'
import qs from 'qs'

// 获取景点列表
const getSpotList = (options) => {
  return axios.get('/public/spot/list?' + qs.stringify(options))
}

// 删除景点
const deleteSpotById = (ids) => {
  return axios.post('/spot/delete', { ids })
}

// 更新景点
const updateSpotById = (data) => {
  return axios.post('/spot/update', data)
}

// 添加景点
const addHSpot = (data) => {
  return axios.post('/spot/add', data)
}

export {
  getSpotList,
  deleteSpotById,
  updateSpotById,
  addHSpot
}
