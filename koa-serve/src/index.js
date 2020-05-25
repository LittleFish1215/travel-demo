import koa from 'koa'
import path from 'path'
import helmet from 'koa-helmet'
import statics from 'koa-static'
import router from './routes/routes'
import koaBody from 'koa-body'
import jsonutil from 'koa-json'
import cors from '@koa/cors'
import compose from 'koa-compose'
import compress from 'koa-compress'
import config from './config'
import JWT from 'koa-jwt'
import errorHandle from '../src/common/errorHandle'
import log4js from './config/Log4j'
import logger from './common/logger'
import auth from './common/auth'

const app = new koa()
const jwt = JWT({ secret: config.JWT_SECRET }).unless({ path: [/^\/public/, /^\/login/] })


/**
 * 使用koa-compose 集成中间件
 */
const middleware = compose([
  logger,
  koaBody({
    multipart: true,
    formidable: {
      keepExtensions: true,
      maxFieldsSize: 5 * 1024 * 1024
    },
    onError: (err) => {
      console.log('koaBody err', err);
    }
  }),
  statics(path.join(__dirname, '../public')),
  cors(),
  jsonutil({ pretty: false, param: 'pretty' }),
  helmet(),
  jwt,
  auth,
  errorHandle,
  config.isDevMode ? log4js.koaLogger(log4js.getLogger('http'), { level: 'auto' }) : log4js.koaLogger(log4js.getLogger('access'), { level: 'auto' })
])

if (!config.isDevMode) {
  app.use(compress())
}

app.use(middleware)
app.use(router())
app.listen(3333,() => {
  const logger = log4js.getLogger('out')
  logger.info('app is runnig at localhost: 3333')
})
