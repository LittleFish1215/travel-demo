import mongoose from '../config/DBHelper'
import moment from 'dayjs'
const Schema = mongoose.Schema

/**
 * 定义酒店
 */
const HotelSchema = new Schema({
  name: { type: String },   //酒店名字
  pic: { type: Array, default: [] }, // 酒店图片
  intro: { type: String },  // 酒店介绍
  mark: { type: Number }, // 酒店评分
  price: { type: String },  // 酒店价格
  created: { type: Date },  // 创建时间 
  address: { type: String }, // 酒店地址
  point: {  //酒店坐标
    type: Object
  },
  strategy: {  // 酒店攻略
    type: Array
  },
  origin: {  // 酒店主打
    type: Array
  },
  // 酒店设施
  facilities: {
    type: Array
  }
})

HotelSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

HotelSchema.statics = {
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
  },
  countList: function (options) {
    return this.find(options).countDocuments()
  },
  findByTid: function (id) {
    return this.findOne({ _id: id })
  }
}

// 创建schema
const PostModel = mongoose.model('hotel', HotelSchema)

// 导出模型
export default PostModel
