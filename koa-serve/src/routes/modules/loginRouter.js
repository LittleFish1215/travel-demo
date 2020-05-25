import Router from 'koa-router'
import LoginController from '../../api/LoginController'

const router = new Router()

router.prefix('/login')
router.post('/login', LoginController.login)
router.post('/reg', LoginController.reg)
export default router
