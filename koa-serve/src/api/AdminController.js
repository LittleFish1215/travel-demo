import Comments from '../models/Comments'
import User from '../models/user'
import SpotComments from '../models/SpotComments'
import Roles from '../models/Roles'
import Menu from '../models/Menus'
import { getMenuData, sortMenus, getRights } from '../common/util'
import qs from 'qs'

class AdminController {

  // 获取菜单列表
  async getMenu (ctx) {
    const result = await Menu.find({})
    ctx.body = {
      code: 200,
      data: sortMenus(result),
      message: '获取成功'
    }
  }

  // 新增菜单
  async addMenu (ctx) {
    const { body } = ctx.request
    const menu = new Menu(body)
    const result = await menu.save()
    ctx.body = {
      code: 200,
      data: result,
      message: '新增成功'
    }
  }

  // 更新菜单
  async updateMenu (ctx) {
    const { body } = ctx.request
    const data = { ...body }
    delete data._id
    const result = await Menu.updateOne({ _id: body._id }, { ...data })
    ctx.body = {
      code: 200,
      data: result,
      message: '更新成功'
    }
  }

  // 删除菜单
  async deleteMenu (ctx) {
    const { body } = ctx.request
    const result = await Menu.deleteOne({ _id: body._id })
    ctx.body = {
      code: 200,
      message: '删除成功',
      data: result
    }
  }

  // 获取用户可以操作的菜单
  async getOperations (ctx) {
    const user = await User.findOne({ _id: ctx._id }, { roles: 1 })
    const { roles } = user
    let menus = []
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i]
      const rights = await Roles.findOne({ role }, { menu: 1 })
      menus = menus.concat(rights.menu)
    }
    menus = Array.from(new Set(menus))
    // 3. menus -> 可以访问的菜单数据
    const treeData = await Menu.find({})
    const operations = getRights(treeData, menus)
    return operations
  }

  // 获取用户的菜单权限，菜单数据
  async getRoutes (ctx) {
    // 1. obj -> _id -> roles
    const user = await User.findOne({ _id: ctx._id }, { roles: 1 })
    const { roles } = user
    // 2. 通过角色 -> menus
    // 用户的角色可能有多个
    // 角色 menus -> 去重
    let menus = []
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i]
      const rights = await Roles.findOne({ role }, { menu: 1 })
      menus = menus.concat(rights.menu)
    }
    menus = Array.from(new Set(menus))
    // 3. menus -> 可以访问的菜单数据
    const treeData = await Menu.find({})
    // 递归查询 type = 'menu' && _id 包含在menus中
    // 结构进行改造
    const routes = getMenuData(treeData, menus, ctx.isAdmin)
    ctx.body = {
      code: 200,
      data: routes
    }
  }

  // 获取所有酒店评论列表
  async getHotelCommentsAll (ctx) {
    // 构建查询条件 limit page 分页必备参数
    // 去数据库查询
    // 返回查询到的数据 评论列表和总数
    const params = qs.parse(ctx.query)
    let query = {}
    if (params.options) {
      query = params.options
    }
    const page = params.page ? parseInt(params.page) : 0
    const limit = params.limit ? parseInt(params.limit) : 20
    const result = await Comments.getCommentsOptions(query, page, limit)
    let total = await Comments.getCommentsOptionsCount(query)
    if (typeof total == 'object') {
      if (total.length > 0) {
        total = total[0].count
      } else {
        total = 0
      }
    }
    ctx.body = {
      code: 200,
      data: result,
      total
    }
  }

  // 批量更新酒店评论(1个或者多个)
  async updateHotelCommentsBatch (ctx) {
    const { body } = ctx.request.body
    const result = await Comments.updateMany(
      { _id: { $in: body.ids } },
      { $set: { ...body.settings } }
    )
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 批量删除酒店评论(1个或者多个)
  async deleteHotelCommentsBatch (ctx) {
    const { body } = ctx.request
    const result = await Comments.deleteMany(
      { _id: { $in: body.ids } }
    )
    ctx.body = {
      code: 200,
      data: result,
      message: '删除成功'
    }
  }

  // 获取所有景点评论列表
  async getSpotCommentsAll (ctx) {
    // 构建查询条件 limit page 分页必备参数
    // 去数据库查询
    // 返回查询到的数据 评论列表和总数
    const params = qs.parse(ctx.query)
    let query = {}
    if (params.options) {
      query = params.options
    }
    const page = params.page ? parseInt(params.page) : 0
    const limit = params.limit ? parseInt(params.limit) : 20
    const result = await SpotComments.getCommentsOptions(query, page, limit)
    let total = await SpotComments.getCommentsOptionsCount(query)
    if (typeof total == 'object') {
      if (total.length > 0) {
        total = total[0].count
      } else {
        total = 0
      }
    }
    ctx.body = {
      code: 200,
      data: result,
      total
    }
  }

  // 批量更新景点评论(1个或者多个)
  async updateSpotCommentsBatch (ctx) {
    const { body } = ctx.request.body
    const result = await SpotComments.updateMany(
      { _id: { $in: body.ids } },
      { $set: { ...body.settings } }
    )
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 批量删除景点评论(1个或者多个)
  async deleteSpotCommentsBatch (ctx) {
    const { body } = ctx.request
    
    const result = await SpotComments.deleteMany(
      { _id: { $in: body.ids } }
    )
    ctx.body = {
      code: 200,
      data: result,
      message: '删除成功'
    }
  }

  //获取角色列表
  async getRoles (ctx) {
    const result = await Roles.find({})
    ctx.body = {
      code: 200,
      data: result,
      message: '查询成功'
    }
  }
  // 添加角色列表
  async addRole (ctx) {
    const { body } = ctx.request
    const role = new Roles(body)
    const result = await role.save()
    ctx.body = {
      code: 200,
      data: result,
      message: '添加成功'
    }
  }

  // 更新角色权限
  async updateRole (ctx) {
    const { body } = ctx.request
    const data = { ...body }
    delete data._id
    const result = await Roles.updateOne({ _id: body._id }, { ...data })
    ctx.body = {
      code: 200,
      data: result,
      message: '更新成功'
    }
  }

  // 删除角色权限
  async deleteRole (ctx) {
    const { body } = ctx.request
    const result = await Roles.deleteOne({ _id: body._id })
    ctx.body = {
      code: 200,
      data: result,
      message: '删除成功'
    }
  }

  // 获取角色名字
  async getRoleNames (ctx) {
    const result = await Roles.find({}, { menu: 0, desc: 0 })
    ctx.body = {
      code: 200,
      data: result,
      message: '获取成功'
    }
  }

}

export default new AdminController()