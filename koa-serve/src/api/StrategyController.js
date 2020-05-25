/**
 * @description 攻略类
 * 
 */

import Strategy from '../models/Strategy'
import fs from 'fs'
import moment from 'dayjs'
import uuid from 'uuid/v4'
import config from '../config'
import mkdir from 'make-dir'
import qs from 'qs'
import { getJWTPayload } from '../common/util'

class StrategyController {
  /**
   * 获取攻略列表的实例方法
   * @param {*} ctx 上下文
   */
  async getStrategyList (ctx) {
    const body = qs.parse(ctx.query)

    const sort = body.sort ? body.sort : 'created'
    const page = body.page ? parseInt(body.page) : 0
    const limit = body.limit ? parseInt(body.limit) : 20
    const options = {}

    // 通过标题查询
    if (body.title) {
      options.title = { $regex: body.title }
    }

    if (body.content) {
      options.content = { $regex: body.content }
    }

    // 通过创建时间来查询
    if (body.start && body.end) {
      let start = body.start
      let end = body.end
      options.created = { $gte: new Date(start), $lt: new Date(end) }
    }

    let result = await Strategy.getList(options, sort, page, limit)
    let total = await Strategy.countList(options)
    // 通过作者的名字来查询

    ctx.body = {
      code: 200,
      data: result,
      msg: '获取文章列表成功',
      total: total
    }
  }

  /**
   * 上传图片接口
   * @param {*} ctx 
   */
  async uploadImg (ctx) {
    const file = ctx.request.files.file
    const ext = file.name.split('.').pop()
    const dir = `${config.uploadPath}/${moment().format('YYYYMMDD')}`
    await mkdir(dir)
    const picname = uuid()
    const destPath = `${dir}/${picname}.${ext}`
    const reader = fs.createReadStream(file.path)
    const upStream = fs.createWriteStream(destPath)
    const filePath = `/${moment().format('YYYYMMDD')}/${picname}.${ext}`
    reader.pipe(upStream)

    ctx.body = {
      code: 200,
      msg: '图片上传成功',
      data: filePath
    }
  }

  // 添加攻略
  async addStrategy (ctx) {
    // 拿到用户提交的内容 
    const { body } = ctx.request
    // 如果验证码通过了比对，那么就获取jwt的载荷信息 拿到用户的信息
    const obj = await getJWTPayload(ctx.header.authorization)
    const newStrategy = new Strategy(body)
    newStrategy.uid = obj._id
    await newStrategy.save()
    ctx.body = {
      code: 200,
      msg: '成功发表一篇攻略'
    }
  }

  // 更新攻略数据
  async updateStrategy (ctx) {
    const body = ctx.request.body
    const result = await Strategy.updateOne({ _id: body._id }, body)
    if (result.ok === 1) {
      ctx.body = {
        code: 200,
        data: result,
        message: '更新成功'
      }
    } else {
      ctx.body = {
        code: 500,
        data: result,
        message: '更新失败'
      }
    }
  }

  // 获取攻略详情
  async getStrategyDetail (ctx) {
    const params = ctx.query
    if (!params.tid) {
      ctx.body = {
        code: 500,
        msg: '文章id为空'
      }
      return
    }
    const strategy = await Strategy.findByTid(params.tid)
    const newStrategy = strategy.toJSON()
    if (strategy._id) {
      ctx.body = {
        code: 200,
        data: newStrategy,
        msg: '查询文章详情成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '查询文章详情失败'
      }
    }
  }

  // 后台管理系统删除攻略的接口
  async deleteStrategy (ctx) {
    const body = ctx.request.body
    const result = await Strategy.deleteMany({ _id: { $in: body.ids } })
    if (result.ok === 1) {
      ctx.body = {
        code: 200,
        message: '删除成功'
      }
    } else {
      ctx.body = {
        code: 500,
        message: '删除失败'
      }
    }
  }
}

export default new StrategyController()
