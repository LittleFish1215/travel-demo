/**
 * @description 酒店评论接口
 */

import { axios } from '@/libs/request'
import qs from 'qs'

// 获取酒店评论列表
const getCommentsList = (options) => {
  return axios.get('/admin/get-comments?' + qs.stringify(options))
}

// 删除指定评论
const deleteCommentById = (ids) => {
  return axios.post('/comments/delete', { ids })
}

// 更新指定评论
const updateCommentById = (data) => {
  return axios.post('/comments/update', data)
}

// 添加评论
const addComment = (data) => {
  return axios.post('/comments/reply', data)
}

export {
  getCommentsList,
  deleteCommentById,
  updateCommentById,
  addComment
}
