import Router from 'koa-router'
import commentsController from '../../api/CommentsController'

const router = new Router()

router.prefix('/comments')

// 添加评论
router.post('/reply', commentsController.addComment)


// 删除指定评论
router.post('/delete', commentsController.deleteComment)

// 更新指定评论
router.post('/update', commentsController.updateComment)

export default router
