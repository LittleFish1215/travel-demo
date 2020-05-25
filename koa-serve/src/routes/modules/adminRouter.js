import Router from 'koa-router'
import adminController from '../../api/AdminController'
import userController from '../../api/UserController'

const router = new Router()
router.prefix('/admin')

// 获取酒店评论
router.get('/get-comments', adminController.getHotelCommentsAll)

// 删除评论
router.post('/delete-comments', adminController.deleteHotelCommentsBatch)

// 更新评论
router.post('/update-comments', adminController.updateHotelCommentsBatch)

// 获取景点评论
router.get('/get-spotcom', adminController.getSpotCommentsAll)

// 获取用户列表
router.get('/users', userController.getUsers)

// 更新用户信息
router.post('/update-user', userController.updateUserById)

// 检查是否已经存在用户名
router.get('/checkname',userController.checkUsername)

// 添加用户
router.post('/add-user', userController.addUser)

// 删除用户
router.post('/delete-user', userController.deleteUserById)

// 获取角色权限名
router.get('/get-roles-names', adminController.getRoleNames)

// 获取权限列表
router.get('/get-roles', adminController.getRoles)

// 添加角色权限
router.post('/add-role', adminController.addRole)

// 删除角色权限
router.post('/delete-role', adminController.deleteRole)

// 更新角色权限
router.post('/update-role', adminController.updateRole)

// 获取菜单权限
router.get('/get-menu', adminController.getMenu)

// 删除菜单权限
router.post('/delete-menu', adminController.deleteMenu)

// 更新菜单权限
router.post('/update-menu', adminController.updateMenu)

// 新增菜单权限
router.post('/add-menu', adminController.addMenu)

export default router