import mongoose from '../config/DBHelper'
import moment from 'dayjs'
const Schema = mongoose.Schema

/**
 * 定义游记
 */
const NoteSchema = new Schema({
  title: { type: String },   //游记标题
  content: { type: String }, // 游记内容
  uid: { type: String, ref: 'users' },  // 游记作者
  created: { type: Date },  // 游记发表时间
  collect: { type: Number }, // 游记收藏数
  hands: { type: Number } // 游记点赞数
})

NoteSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

NoteSchema.statics = {
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
    return this.findOne({ _id: id }).populate({
      path: 'uid',
      select: '_id name pic level'
    })
  }
}

// 创建schema
const NoteModel = mongoose.model('note', NoteSchema)

// 导出模型
export default NoteModel
