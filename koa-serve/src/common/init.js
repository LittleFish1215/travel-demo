import {setValue} from '../config/RedisConfig'
import User from '../models/user'
import config from '../config/index'

export const run = async () => {
  if (config.adminEmail && config.adminEmail.length > 0) {
    const emails = config.adminEmail
    const arr = []
    for (let email of emails) {
      const user = await User.findOne({username: email})
      arr.push(user._id)
    }
    setValue('admin', JSON.stringify(arr))
  }
}
