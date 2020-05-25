import mongoose from '../config/DBHelper'

const Schema = mongoose.Schema

const RolesSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  menu: {
    type: Array,
    default: []
  }
})

const Roles = mongoose.model('roles', RolesSchema)

export default Roles