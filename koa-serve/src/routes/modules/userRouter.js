import Router from 'koa-router'
import errorController from '../../api/ErrorController'

const router = new Router({
  prefix: '/user'
})


// 增加错误日志
router.post('add-error', errorController.addError)

export default router
