/**
 * @description 游记相关接口
 */

import { axios } from '@/libs/request'
import qs from 'qs'

// 获取攻略列表
const getNotesList = (options) => {
  return axios.get('/public/note/list?' + qs.stringify(options))
}

// 删除攻略
const deleteNoteById = (ids) => {
  return axios.post('/note/delete', { ids })
}

// 更新攻略
const updateNoteById = (data) => {
  return axios.post('/note/update', data)
}

// 添加攻略
const addNote = (data) => {
  return axios.post('/note/add', data)
}

export {
  getNotesList,
  deleteNoteById,
  updateNoteById,
  addNote
}
