import mongoose from '../config/DBHelper'
import moment from 'dayjs'
const Schema = mongoose.Schema

/**
 * 定义景点
 */
const SpotSchema = new Schema({
  name: { type: String },   //景点名字
  pic: { type: Array, default: [] }, // 景点图片
  intro: { type: Object },  // 景点介绍
  mark: { type: Number }, // 景点评分
  weather: {type: String}, // 景点天气
  created: { type: Date },  // 创建时间 
  address: { type: String }, // 景点地址
  point: {  // 景点坐标
    type: Object
  },
  spot_nearby: {type: Array, default: []}, // 附近景点
  traffic_nearby: {type: Array, default: []}, // 附近交通
  discount_msg: {type: Array, default: []}, // 优惠
  inner_spot: {type: Array, default: []}, // 景区其他景点
})

SpotSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

SpotSchema.statics = {
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
const SpotModel = mongoose.model('spot', SpotSchema)

// 导出模型
export default SpotModel
