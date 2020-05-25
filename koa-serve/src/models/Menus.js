import mongoose from '../config/DBHelper'

const Schema = mongoose.Schema

const MenuSchema = new Schema({
  title: { type: String, default: '' },
  name: { type: String, default: '' },
  path: { type: String, default: '' },
  component: { type: String, default: '' },
  hideInBread: { type: Boolean, default: false },
  hideInMenu: { type: Boolean, default: false },
  notCache: { type: Boolean, default: false },
  icon: { type: String, default: '' },
  sort: { type: String, default: 0 },
  link: { type: String, default: '' },
  redirect: { type: String, default: '' },
  type: { type: String, default: 'menu' },
  expand: { type: Boolean, default: true }
})

const OperationSchema = new Schema({
  name: { type: String, default: '' },
  type: { type: String, default: '' },
  method: { type: String, default: '' },
  path: { type: String, default: '' },
  regmark: { type: String, default: '' }
})

// mongodb嵌套嵌套Model定义方法
MenuSchema.add({
  children: [MenuSchema],
  operations: [OperationSchema]
})

const Menus = mongoose.model('menus', MenuSchema)

export default Menus