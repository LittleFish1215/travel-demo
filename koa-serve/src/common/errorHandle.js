import log4js from '../config/Log4j'
import ErrorRecord from '../models/ErrorRecord'
import User from '../models/user'
const logger = log4js.getLogger('error')

export default async (ctx, next) => {
  try {
    await next()
    if (ctx.status !== 200) {
      ctx.throw()
    }
  } catch (err) {
    // 打印出错误信息在控制台
    logger.error(`${ctx.url} ${ctx.method} ${ctx.status} ${err.stack}`)
    let user = ''
    if (ctx._id) {
      user = await User.findOne({_id: ctx._id})
    }
    // 将错误信息存入到数据库
    await ErrorRecord.create({
      message: err.message,
      code: ctx.response.status,
      method: ctx.method,
      path: ctx.path,
      param: ctx.method === 'GET' ? ctx.query : ctx.request.body,
      username: user.username,
      stack: err.stack
    })
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        msg: 'Protected resource, use Authorization header to get access\n'
      }
    } else {
      ctx.status = err.status || 500
      ctx.body = Object.assign({
        code: 500,
        msg: err.message
      }, process.env.NODE_ENV === 'development'
        ? { stack: err.stack } : {})
    }
  }
}
