/**
 * @description 酒店接口
 */

import { axios } from '@/libs/request'
import qs from 'qs'

// 获取酒店列表
const getHotelList = (options) => {
  return axios.get('/public/hotel/list?' + qs.stringify(options))
}

// 删除酒店
const deleteHotelById = (ids) => {
  return axios.post('/hotel/delete', { ids })
}

// 更新酒店
const updateHotelById = (data) => {
  return axios.post('/hotel/update', data)
}

// 添加酒店
const addHotel = (data) => {
  return axios.post('/hotel/add', data)
}

export {
  getHotelList,
  deleteHotelById,
  updateHotelById,
  addHotel
}
