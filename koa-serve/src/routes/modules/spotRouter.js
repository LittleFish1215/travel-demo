import Router from 'koa-router'
import spotController from '../../api/SpotController'

const router = new Router()

router.prefix('/spot')

// 添加景点
router.post('/add', spotController.addSpot)

// 删除景点
router.post('/delete', spotController.deleteSpot)

// 更新景点详情
router.post('/update', spotController.updateSpot)

export default router