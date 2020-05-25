import svgCaptcha from 'svg-captcha'
import { setValue } from '../config/RedisConfig'

class PublicController {
  constructor() { }
  async getCaptcha (ctx) {
    const body = ctx.request.query
    const newCaptcha = svgCaptcha.create({
      size: 4,
      color: true,
      ignoreChars: '0oil1',
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 48
    })
    // 保存图片验证码数据  设置过期时间
    setValue(body.sid, newCaptcha.text, 10 * 60)
    ctx.body = {
      code: 200,
      data: newCaptcha.data,
    }
  }

}

export default new PublicController()
