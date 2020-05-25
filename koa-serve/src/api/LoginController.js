import moment from 'dayjs'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/user'
import config from '../config'
import { SuccessModel, ErrorModel } from '../core/resModel'
import { loginFailInfo, registerUserNameExistInfo, registerNameExistInfo, } from '../core/errorInfo'

class LoginController {

  // 登录
  async login (ctx) {
    const { body } = ctx.request
    // 验证用户名和密码是否正确
    let checkUserPasswd = false
    const user = await User.findOne({ username: body.username })
    if (user === null) {
      ctx.body = new ErrorModel(registerUserNameExistInfo)
      return
    }
    // 比对密码和数据库的是否一致
    if (await bcrypt.compare(body.password, user.password)) {
      checkUserPasswd = true
    }
    // 验证通过
    if (checkUserPasswd) {
      const userObj = user.toJSON()
      const arr = ['password']
      arr.map(item => {
        delete userObj[item]
      })
      const token = jsonwebtoken.sign({ _id: userObj._id }, config.JWT_SECRET, {
        expiresIn: '1d'
      })

      ctx.body = {
        code: 200,
        data: userObj,
        token: token
      }
    } else {
      ctx.body = new ErrorModel(loginFailInfo)
    }
  }

  // 注册
  async reg (ctx) {
    const { body } = ctx.request
    let check = true
    const user1 = await User.findOne({ username: body.username })
    if (user1 !== null && typeof user1.username !== 'undefined') {
      // msg.username = ['此邮箱已经注册，可以通过邮箱找回密码']
      ctx.body = new ErrorModel(registerUserNameExistInfo)
      check = false
    }
    const user2 = await User.findOne({ name: body.name })
    // 查库，看name是否被注册
    if (user2 !== null && typeof user2.name !== 'undefined') {
      // msg.name = ['此昵称已经被注册，请修改']
      ctx.body = new ErrorModel(registerNameExistInfo)
      check = false
    }
    if (check) {
      body.password = await bcrypt.hash(body.password, 5)
      const user = new User({
        username: body.username,
        password: body.password,
        name: body.name,
        created: moment().format('YYYY-MM-DD HH:mm:ss')
      })
      const result = await user.save()
      ctx.body = new SuccessModel(result)
      return
    }
  }

}

export default new LoginController()
