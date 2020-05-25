import qs from 'qs'
import ErrorRecord from '../models/ErrorRecord'

class ErrorController {
  async getErrorList (ctx) {
    const params = ctx.query

    const methodFilter = await ErrorRecord.aggregate([{ $group: { _id: '$method' } }, { $sort: { _id: 1 } }])
    const codeFilter = await ErrorRecord.aggregate([{ $group: { _id: '$code' } }, { $sort: { _id: 1 } }])

    const obj = qs.parse(params)
    const query = obj.filter ? { ...obj.filter } : {}
    if (query.method) {
      query.method = { $regex: query.method, $options: 'i' }
    }
    // 分页
    const page = params.page ? parseInt(params.page) : 0
    const limit = params.limit ? parseInt(params.limit) : 10

    // { method: /get/i }
    const result = await ErrorRecord.find(query).skip((page - 1) * limit).limit(limit).sort({ created: -1 })
    const total = await ErrorRecord.find(query).countDocuments()
    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: result,
      total: total,
      filters: {
        method: methodFilter.map(o => {
          return {
            label: o._id,
            value: o._id
          }
        }),
        code: codeFilter.map(o => {
          return {
            label: o._id,
            value: parseInt(o._id)
          }
        })
      }
    }
  }

  async deleteError (ctx) {
    const { body } = ctx.request
    const result = await ErrorRecord.deleteMany({ _id: { $in: body.ids } })
    ctx.body = {
      code: 200,
      msg: '删除成功',
      data: result
    }
  }

  async addError (ctx) {
    const body = ctx.request.body
    const error = new ErrorRecord(body)
    const result = await error.save()
    ctx.body = {
      code: 200,
      message: '保存成功',
      data: result
    }
  }
}

export default new ErrorController()
