import mongoose from '../config/DBHelper'
import moment from 'dayjs'

const Schema = mongoose.Schema

// 定义景点评论字段
const SpotCommentsSchema = new Schema({
  tid: { type: String, ref: 'spot' },  // 酒店的id
  cuid: { type: String, ref: 'users' },  // 用户的id
  content: { type: String },  // 评论的内容
  created: { type: Date },  // 评论创建的时间
  status: {type: String, default: '1'}
}, { toJSON: { virtuals: true } })

SpotCommentsSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

SpotCommentsSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'))
  } else {
    next(error)
  }
})

SpotCommentsSchema.statics = {
  // 根据Tid找到对应的评论
  findByTid: function (id) {
    return this.find({ tid: id })
  },
  // 根据Cid找到对应的评论
  findByCid: function (id) {
    return this.findOne({ _id: id })
  },
  // 找到某一文章下的评论 并且把用户的信息和酒店的信息也找到
  getCommentsList: function (id, page, limit) {
    return this.find({ tid: id }).populate({
      path: 'cuid',
      select: '_id name pic level',
    }).populate({
      path: 'tid',
      select: '_id name'
    }).skip(page * limit).limit(limit)
  },
  // 获取某一酒店下的评论数量
  queryCount: function (id) {
    return this.find({ tid: id }).countDocuments()
  },
  // 获取所有评论信息
  getCommentsOptions: function (options, page, limit) {
    let query = {}
    console.log('options', options)
    if (typeof options.search !== 'undefined') {
      if (typeof options.search === 'string' && options.search.trim() !== '') {
        // 单选
        query[options.item] = options.search
      }

      if (['uid', 'tid', 'cuid'].includes(options.item)) {
        let arr = [
          {
            $lookup: {
              from: 'spots',
              let: { pid: { $toObjectId: '$tid' } },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$pid'] } } },
                { $project: { _id: 1, cuid: 1, name: 1 } }
              ],
              as: 'tid'
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [{ $arrayElemAt: ['$tid', 0] }, '$$ROOT']
              }
            }
          },
          { $unwind: '$tid' }
        ]
        if (options.item === 'tid') {
          arr.push({
            $match: { name: { $regex: options.search, $options: 'i' } }
          })
        }
        arr = arr.concat([
          { $addFields: { fuserId: { $toObjectId: '$cuid' } } },
          { $lookup: { from: 'users', localField: 'fuserId', foreignField: '_id', as: 'cuid' } }
        ])
        if (options.item === 'cuid' && options.search.trim() !== '') {
          arr.push({
            $match: { 'cuid.name': { $regex: options.search, $options: 'i' } }
          })
        }
        arr = arr.concat([
          { $unwind: '$cuid' },
          { $project: { tid: 1, cuid: { name: 1, _id: 1 }, uid: { name: 1, _id: 1 }, status: 1, content: 1, created: 1 } },
          { $skip: limit * page },
          { $limit: limit },
          { $sort: { created: -1 } }
        ])
        return this.aggregate(arr)
      }
      // 按照时间查找
      if (options.item === 'created') {
        const start = options.search[0]
        const end = options.search[1]
        query = { created: { $gte: new Date(start), $lt: new Date(end) } }
      }
      if (options.item === 'content') {
        query = { content: { $regex: options.search, $options: 'i' } }
      }
      // 查询条件构成了 连表查询
      return this.find(query)
        .populate({
          path: 'tid',
          select: '_id name'
        })
        .populate({
          path: 'cuid',
          select: '_id name'
        })
        .populate({
          path: 'uid',
          select: '_id name'
        })
        .skip(page * limit)
        .limit(limit)
        .sort({ created: -1 })
    }
  },

  getCommentsOptionsCount: function (options) {
    let query = {}
    if (typeof options.search !== 'undefined') {
      if (typeof options.search === 'string' && options.search.trim() !== '') {
        // radio
        query[options.item] = options.search
      }
      if (['uid', 'tid', 'cuid'].includes(options.item)) {
        let arr = [
          {
            $lookup: {
              from: 'spots',
              let: { pid: { $toObjectId: '$tid' } },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$pid'] } } },
                { $project: { _id: 1, uid: 1, name: 1 } }
              ],
              as: 'tid'
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [{ $arrayElemAt: ['$tid', 0] }, '$$ROOT']
              }
            }
          },
          { $unwind: '$tid' }
        ]
        if (options.item === 'tid') {
          arr.push({
            $match: { title: { $regex: options.search, $options: 'i' } }
          })
        }
        arr = arr.concat([
          { $addFields: { fuserId: { $toObjectId: '$cuid' } } },
          { $lookup: { from: 'users', localField: 'fuserId', foreignField: '_id', as: 'cuid' } }
        ])
        if (options.item === 'cuid' && options.search.trim() !== '') {
          arr.push({
            $match: { 'cuid.name': { $regex: options.search, $options: 'i' } }
          })
        }
        arr.push({ $unwind: '$cuid' })
        arr.push({ $project: { tid: 1, cuid: { name: 1, _id: 1 }, uid: { name: 1, _id: 1 }, status: 1, content: 1, created: 1 } })
        arr.push({ $group: { _id: null, count: { $sum: 1 } } })
        return this.aggregate(arr)
      }

      if (options.item === 'content') {
        query = { content: { $regex: options.search, $options: 'i' } }
      }

      if (options.item === 'created') {
        const start = options.search[0]
        const end = options.search[1]
        query = { created: { $gte: new Date(start), $lt: new Date(end) } }
      }
      return this.find(query).countDocuments()
    }
    return this.find(query).countDocuments()
  },

}

const SpotComments = mongoose.model('spotComments', SpotCommentsSchema)

export default SpotComments