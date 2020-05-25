import Router from 'koa-router'
import userController from '../../api/UserController'
import hotelController from '../../api/HotelController'
import spotController from '../../api/SpotController'
import strategyController from '../../api/StrategyController'
import noteController from '../../api/NoteController'
import spotCommentsController from '../../api/SpotCommentsController'
import commentsController from '../../api/CommentsController'

const router = new Router()

router.prefix('/public')

// 获取酒店列表
router.get('/hotel/list', hotelController.getHotelList)

// 获取酒店详情
router.get('/hotel/detail', hotelController.getHotelDetail)

// 获取景点列表
router.get('/spot/list', spotController.getSpotList)

// 获取景点详情
router.get('/spot/detail', spotController.getSpotDetail)

// 获取攻略列表
router.get('/strategy/list', strategyController.getStrategyList)

// 获取攻略详情
router.get('/strategy/detail', strategyController.getStrategyDetail)

// 获取游记列表
router.get('/note/list', noteController.getNoteList)

// 获取游记详情
router.get('/note/detail', noteController.getNoteDetail)

// 获取评论列表
router.get('/spotComments/list', spotCommentsController.getComments)

// 获取酒店评论列表
router.get('/hotelcomments/list', commentsController.getComments)

// 获取用户的基本信息
router.get('/info', userController.getBasicInfo)

export default router
