import moment from 'dayjs'
import mongoose from '../config/DBHelper'
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: { type: String, index: { unique: true }, sparse: true },  //用户名
  password: { type: String },  // 密码
  name: { type: String }, // 昵称
  created: { type: Date }, // 创建时间
  updated: { type: Date }, // 更新时间
  level: { type: Number, default: 1 },  // 等级
  gender: { type: String, default: '' }, // 性别
  roles: { type: Array, default: ['user'] },  // 角色
  pic: { type: String, default: 'http://dqd.guozhaoxi.com/img/header.jpg' }, // 头像
  mobile: { type: String, match: /^1[3-9](\d{9})$/, default: '' }, // 手机号
  status: { type: String, default: '0' }, // 禁用
  regmark: { type: String, default: '' },  // 个签
  location: { type: String, default: '' },  // 位置
})

// 保存数据之前生成一个创建时间保存到created字段中
UserSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

// 更新数据之前生成一个更新时间保存到updated字段中
UserSchema.pre('update', function (next) {
  this.updated = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

UserSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Error: Mongoose has a duplicate key.'))
  } else {
    next(error)
  }
})

UserSchema.statics = {
  findByID: function (id) {
    return this.findOne({ _id: id }, {
      password: 0,
      mobile: 0
    })
  },
  getList: function (options, sort, page, limit) {
    let query = {}
    if (typeof options.search !== 'undefined') {
      if (typeof options.search === 'string' && options.search.trim() !== '') {
        // 根据用户名或者昵称  模糊查询
        if (['name', 'username'].includes(options.item)) {
          query[options.item] = { $regex: new RegExp(options.search) }
        } else {
          query[options.item] = options.search
        }
      }
      // 根据权限来查询
      if (options.item === 'roles') {
        query = { roles: { $in: options.search } }
      }
      // 根据创建时间来查询
      if (options.item === 'created') {
        const start = options.search[0]
        const end = options.search[1]
        query = { created: { $gte: new Date(start), $lt: new Date(end) } }
      }
    }
    // 条件已经构成 下一步进行查询
    return this.find(query, { password: 0, mobile: 0 })
    .sort({ [sort]: -1 })
    .skip(page * limit)
    .limit(limit)
  },
  countList: function(options) {
    let query = {}
    if (typeof options.search !== 'undefined') {
      if (typeof options.search === 'string' && options.search.trim() !== '') {
        // 根据用户名或者昵称  模糊查询
        if (['name', 'username'].includes(options.item)) {
          query[options.item] = { $regex: new RegExp(options.search) }
        } else {
          query[options.item] = options.search
        }
      }
      // 根据权限来查询
      if (options.item === 'roles') {
        query = { roles: { $in: options.search } }
      }
      // 根据创建时间来查询
      if (options.item === 'created') {
        const start = options.search[0]
        const end = options.search[1]
        query = { created: { $gte: new Date(start), $lt: new Date(end) } }
      }
    }
    return this.find(query).countDocuments()
  }
}

const UserModel = mongoose.model('users', UserSchema)

export default UserModel