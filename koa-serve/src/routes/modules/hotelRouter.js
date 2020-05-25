import Router from 'koa-router'
import hotelController from '../../api/HotelController'

const router = new Router()

router.prefix('/hotel')

// 添加酒店
router.post('/add', hotelController.addHotel)

// 删除酒店
router.post('/delete', hotelController.deleteHotel)

// 更新酒店详情
router.post('/update', hotelController.updateHotel)

export default router