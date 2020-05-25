import SpotComments from '../models/SpotComments'
import { getJWTPayload } from '../common/util'
import { SuccessModel, ErrorModel } from '../core/resModel'
import {
  bannedToPostFail,
  addCommentsFail,
} from '../core/errorInfo'

// 没有登录不能参与文章的回复
const canReply = async (ctx) => {
  let result = false
  const obj = await getJWTPayload(ctx.header.authorization)
  if (typeof obj._id === 'undefined') {
    return result
  } else {
    return true
  }
}

class SpotCommentsController {
  // 获取评论列表
  async getComments (ctx) {
    const params = ctx.query
    const tid = params.tid
    const page = params.page ? params.page : 0
    const limit = params.limit ? parseInt(params.limit) : 10
    let result = await SpotComments.getCommentsList(tid, page, limit)
    const total = await SpotComments.queryCount(tid)
    ctx.body = {
      code: 200,
      total,
      data: result,
      msg: '查询成功'
    }
  }

  // 添加评论
  async addComment (ctx) {
    const check = await canReply(ctx)
    if (!check) {
      ctx.body = new ErrorModel(bannedToPostFail)
      return
    }
    const { body } = ctx.request
    const newComment = new SpotComments(body)
    const obj = await getJWTPayload(ctx.header.authorization)
    newComment.cuid = obj._id
    const comment = await newComment.save()
    if (comment._id) {
      ctx.body = new SuccessModel(comment)
    } else {
      ctx.body = new ErrorModel(addCommentsFail)
    }
  }

  // 删除指定评论接口
  async deleteComment (ctx) {
    const body = ctx.request.body
    const result = await SpotComments.deleteMany({ _id: { $in: body.ids } })
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

  // 更新评论数据
  async updateComment (ctx) {
    const body = ctx.request.body
    console.log('body', body)
    const result = await SpotComments.updateOne({ _id: body._id }, body)
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

}

export default new SpotCommentsController()
