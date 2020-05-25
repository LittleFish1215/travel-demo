import mongoose from '../config/DBHelper'
import moment from 'dayjs'
const Schema = mongoose.Schema

/**
 * 定义攻略
 */
const StrategySchema = new Schema({
  title: { type: String },   //攻略标题
  content: { type: String }, // 攻略内容
  uid: { type: String, ref: 'users' },  // 攻略作者
  created: { type: Date },  // 攻略发表时间
  collect: { type: Number }, // 攻略收藏数
  hands: { type: Number } // 攻略点赞数
})

StrategySchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

StrategySchema.statics = {
  /**
   * 获取文章列表
   * @param {*} options 查询条件
   * @param {*} sort 排序方式
   * @param {*} page 页数
   * @param {*} limit 限制条数
   */
  getList: function (options, sort, page, limit) {
    return this.find(options)
      .sort({ [sort]: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate({
        path: 'uid',
        select: '_id name pic level'
      })
  },
  countList: function (options) {
    return this.find(options).countDocuments()
  },
  findByTid: function (id) {
    return this.findOne({ _id: id })
  }
}

// 创建schema
const StrategyModel = mongoose.model('strategy', StrategySchema)

// 导出模型
export default StrategyModel
