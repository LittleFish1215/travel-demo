/**
 * @description 景点类
 */

import Spot from '../models/Spot'
import fs from 'fs'
import moment from 'dayjs'
import uuid from 'uuid/v4'
import config from '../config'
import mkdir from 'make-dir'
import qs from 'qs'
import SpotComments from '../models/SpotComments'

class SpotController {
  /**
   * 获取文章列表的实例方法
   * @param {*} ctx 上下文
   */
  async getSpotList (ctx) {
    const body = qs.parse(ctx.query)

    const sort = body.sort ? body.sort : 'created'
    const page = body.page ? parseInt(body.page) : 0
    const limit = body.limit ? parseInt(body.limit) : 20
    const options = {}

    // 通过标题查询
    if (body.name) {
      options.name = { $regex: body.name }
    }
    // 通过评价来查询
    if (body.mark) {
      options.mark = { $regex: body.mark }
    }

    // 通过地址来查询
    if (body.address) {
      options.address = { $regex: body.address }
    }
    // 通过创建时间来查询
    if (body.start && body.end) {
      let start = body.start
      let end = body.end
      options.created = { $gte: new Date(start), $lt: new Date(end) }
    }

    let result = await Spot.getList(options, sort, page, limit)
    let total = await Spot.countList(options)

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

  // 添加景点
  async addSpot (ctx) {
    // 拿到用户提交的内容 
    const { body } = ctx.request
    const newSpot = new Spot(body)
    await newSpot.save()
    ctx.body = {
      code: 200,
      msg: '添加成功',
    }
  }

  // 更新景点数据
  async updateSpot (ctx) {
    const body = ctx.request.body
    const result = await Spot.updateOne({ _id: body._id }, body)
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

  // 获取景点详情
  async getSpotDetail (ctx) {
    const params = ctx.query
    if (!params.tid) {
      ctx.body = {
        code: 500,
        msg: '文章id为空'
      }
      return
    }
    const spot = await Spot.findByTid(params.tid)
    const newSpot = spot.toJSON()
    if (spot._id) {
      ctx.body = {
        code: 200,
        data: newSpot,
        msg: '查询景点详情成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '查询景点详情失败'
      }
    }
  }

  // 后台管理系统删除景点的接口
  async deleteSpot (ctx) {
    const body = ctx.request.body
    const result = await Spot.deleteMany({ _id: { $in: body.ids } })
    const result1 = await SpotComments.deleteMany({ tid: { $in: body.ids } })
    if (result.ok === 1 && result1.ok === 1) {
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

export default new SpotController()
