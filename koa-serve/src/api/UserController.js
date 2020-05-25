import moment from 'dayjs'
import User from '../models/user'
import { getJWTPayload } from '../common/util'
import { setValue, getValue } from '../config/RedisConfig'
import uuid from 'uuid/v4'
import jwt from 'jsonwebtoken'
import config from '../config'
import bcrypt from 'bcryptjs'

import qs from 'qs'

class UserController {

  /**
   * 更新用户基本信息
   * @param {*} ctx 上下文对象
   */
 

  /**
   * 更新用户名
   * @param {*} ctx 上下文对象
   */
  async updateUsername (ctx) {
    const body = ctx.query
    if (body.key) {
      const token = await getValue(body.key)
      const obj = getJWTPayload('Bearer ' + token)
      await User.updateOne({ _id: obj._id }, {
        username: body.username
      })
      ctx.body = {
        code: 200,
        msg: '更新用户名成功'
      }
    } else {
      ctx.body = {
        code: 403,
        msg: '更新用户名失败'
      }
    }
  }

  /**
   * 修改密码接口
   * @param {*} ctx 上下文对象
   */
  async changePasswd (ctx) {
    const { body } = ctx.request
    const obj = getJWTPayload(ctx.header.authorization)
    const user = await User.findOne({ _id: obj._id })
    if (await bcrypt.compare(body.oldpwd, user.password)) {
      const newpasswd = await bcrypt.hash(body.newpwd, 5)
      const result = await User.updateOne(
        { _id: obj._id },
        { $set: { password: newpasswd } }
      )
      ctx.body = {
        code: 200,
        msg: '更新密码成功'
      }
    } else {
      ctx.body = {
        code: 403,
        msg: '更新密码失败，请检查'
      }
    }
  }

 
  // 获取用户基本信息
  async getBasicInfo (ctx) {
    const params = ctx.query
    const uid = params.uid || ctx._id
    let user = await User.findByID(uid)
    // 取得用户的签到记录 有没有 > today 0:00:00
    user = user.toJSON()
    ctx.body = {
      code: 200,
      data: user,
      msg: '查询成功！'
    }
  }

  // 获取用户列表
  async getUsers (ctx) {
    let params = ctx.query
    params = qs.parse(params)
    const page = params.page ? params.page : 0
    const limit = params.limit ? parseInt(params.limit) : 10
    const sort = params.sort || 'created'
    const option = params.option || {}
    const result = await User.getList(option, sort, page, limit)
    const total = await User.countList(option)
    ctx.body = {
      code: 200,
      message: '查询成功',
      data: result,
      total: total
    }
  }

  // 更新用户信息根据id
  async updateUserById (ctx) {
    const { body } = ctx.request
    const user = await User.findOne({ _id: body._id })

    if (!user) {
      ctx.body = {
        code: 500,
        message: '用户不存在或id信息有误'
      }
      return
    }

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 5)
    }
    const result = await User.updateOne({ _id: body._id }, body)
    if (result.ok === 1 && result.nModified === 1) {
      ctx.body = {
        code: 200,
        message: '更新成功',
      }
    } else {
      ctx.body = {
        code: 500,
        message: '服务异常，更新失败'
      }
    }
  }



  // 检查用户名是否已经存在
  async checkUsername(ctx) {
    const params = ctx.query
    const user = await User.findOne({username: params.username})
    let result = 1
    if (user && user.username) {
      result = 0
      ctx.body = {
        code: 200,
        data: result,
        message: '用户名已经存在，请更换'
      }
    } else {
      ctx.body = {
        code: 200,
        data: result,
        message: '用户名可以使用'
      }
    }
  }

  // 添加用户
  async addUser(ctx) {
    const {body} = ctx.request
    body.password = await bcrypt.hash(body.password, 5)
    const user = new User(body)
    const result = await user.save()
    const userObj = result.toJSON()
    const arr = ['password']
    arr.map((item) => {
      delete userObj[item]
    })
    if (result) {
      ctx.body = {
        code: 200,
        data: userObj,
        message: '添加用户成功'
      }
    } else {
      ctx.body = {
        code: 500,
        message: '服务接口异常，稍后再试'
      }
    }
  }

  async deleteUserById(ctx) {
    const { body } = ctx.request

    const result = await User.deleteMany({_id: {$in: body.ids}})
    if (result.ok === 1) {
      ctx.body = {
        code: 200,
        data: result,
        message: '批量删除成功'
      }
    } else {
      ctx.body = {
        code: 500,
        message: '批量删除失败'
      }
    }
    
  }

}

export default new UserController()
