/**
 * @description 景点评论接口
 */

import { axios } from '@/libs/request'
import qs from 'qs'

// 获取景点评论列表
const getCommentsList = (options) => {
  return axios.get('/public/spotComments/list?' + qs.stringify(options))
}

// 删除指定评论
const deleteCommentById = (ids) => {
  return axios.post('/spotComments/delete', { ids })
}

// 更新指定评论
const updateCommentById = (data) => {
  return axios.post('/spotComments/update', data)
}

// 添加评论
const addComment = (data) => {
  return axios.post('/spotComments/reply', data)
}

export {
  getCommentsList,
  deleteCommentById,
  updateCommentById,
  addComment
}
