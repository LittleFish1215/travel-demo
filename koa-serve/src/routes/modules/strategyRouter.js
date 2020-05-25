import Router from 'koa-router'
import strategyController from '../../api/StrategyController'

const router = new Router()

router.prefix('/strategy')

// 添加攻略
router.post('/add', strategyController.addStrategy)

// 删除攻略
router.post('/delete', strategyController.deleteStrategy)

// 更新攻略详情
router.post('/update', strategyController.updateStrategy)

export default router