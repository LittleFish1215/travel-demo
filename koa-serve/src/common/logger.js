import log4js from '../config/Log4j'

const logger = log4js.getLogger('out')

export default async (ctx, next) => {
  let start = Date.now()
  await next()
  const resTime = Date.now() - start
  // 如果响应时间超过1秒了 咱们打印一下日志到文件中
  if (resTime / 1000 > 1) {
    logger.info(`[${ctx.method}] - ${ctx.url} - time:${resTime / 1000}s`)
  }
}