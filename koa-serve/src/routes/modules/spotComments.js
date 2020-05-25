import Router from 'koa-router'
import spotCommentsController from '../../api/SpotCommentsController'

const router = new Router()

router.prefix('/spotComments')

// 添加评论
router.post('/reply', spotCommentsController.addComment)

// 删除指定评论
router.post('/delete', spotCommentsController.deleteComment)

// 更新指定评论
router.post('/update', spotCommentsController.updateComment)

export default router
