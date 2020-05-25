import path from 'path'
// mongodb config
const MONGO_HOSTNAME = process.env.DB_HOSTNAME || 'localhost'
const MONGO_PORT = process.env.DB_PORT || '27017'
const MONGO_DBNAME = process.env.DB_NAME || 'testdb'
const DB_URL = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DBNAME}`

// redis config
const REDIS = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || '6379'
}

const JWT_SECRET = 'GZX_940313#'

const baseUrl = process.env.NODE_ENV === 'production' ? 'http://dqd.guozhaoxi.com' : 'http://localhost:8080'
const uploadPath = process.env.NODE_ENV === 'production' ? '/app/public' : path.join(path.resolve(__dirname, '../../public'))

const adminEmail = ['admin@test.com']

const publicPath = [/^\/public/, /^\/login/, /^\/comments/]
const isDevMode = process.env.NODE_ENV !== 'production'

export default {
  DB_URL,
  REDIS,
  JWT_SECRET,
  baseUrl,
  uploadPath,
  publicPath,
  isDevMode,
  adminEmail,
}