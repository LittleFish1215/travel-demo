import { axios } from '@/libs/request'
import qs from 'qs'

// 获取用户列表
const getUserList = (params) =>
  axios.get('/admin/users?' + qs.stringify(params))

// 更新某个用户信息
const updateUserById = (data) => axios.post('/admin/update-user', data)

// 批量设置
// const updateUserBatchById = (data) =>
//   axios.post('/admin/update-user-settings', data)

// 删除用户
const deleteUserById = (ids) => axios.post('/admin/delete-user', { ids })

// 校验用户名是否存在
const checkUsername = (username) =>
  axios.get('/admin/checkname?username=' + username)

// 添加用户
const addUser = (data) => axios.post('/admin/add-user', data)
// 添加菜单
const addMenu = (data) => axios.post('/admin/add-menu', data)

// 获取菜单
const getMenu = () => axios.get('/admin/get-menu')

// 更新菜单
const updateMenu = (data) => axios.post('/admin/update-menu', data)

// 删除菜单
const deleteMenu = (data) => axios.post('/admin/delete-menu', data)

// 获取错误列表
const getErrorList = (params) =>
  axios.get('/admin/get-error?' + qs.stringify(params))

// 删除错误
const deleteErrors = (data) => axios.post('/admin/delete-error', data)

// 获取酒店评论
const getHotelCommentsAll = (params) => {
  axios.get('/admin/get-comments?' + qs.stringify(params))
}
// 删除评论
const deleteHotelCommentsBatch = (data) => axios.post('/admin/delete-comments', data)

// 更新酒店评论
const updateHotelCommentsBatch = data => axios.post('/admin/update-comments', data)

// 获取景点评论
const getSpotCommentsAll = (params) => {
  return axios.get('/admin/get-spotcom?' + qs.stringify(params))
}

// 删除指定评论
const deleteSpotCommentById = (ids) => {
  return axios.post('/spotComments/delete', { ids })
}

// 更新指定评论
const updateSpotCommentById = (data) => {
  return axios.post('/spotComments/update', data)
}

// 添加角色权限
const addRole = (data) => axios.post('/admin/add-role', data)

// 获取权限
const getRoles = () => axios.get('/admin/get-roles')

// 获取权限名称
const getRoleNames = () => axios.get('/admin/get-roles-names')

// 更新权限
const updateRole = (data) => axios.post('/admin/update-role', data)

// 删除角色权限
const deleteRole = (data) => axios.post('/admin/delete-role', data)

export {
  deleteSpotCommentById,
  updateSpotCommentById,
  getErrorList,
  deleteErrors,
  getHotelCommentsAll,
  deleteHotelCommentsBatch,
  updateHotelCommentsBatch,
  getSpotCommentsAll,
  getUserList,
  updateUserById,
  deleteUserById,
  checkUsername,
  addUser,
  addRole,
  getRoles,
  getRoleNames,
  updateRole,
  deleteRole,
  addMenu,
  getMenu,
  updateMenu,
  deleteMenu

}
