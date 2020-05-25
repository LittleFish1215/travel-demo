import Router from 'koa-router'
import noteController from '../../api/NoteController'

const router = new Router()

router.prefix('/note')

// 添加游记
router.post('/add', noteController.addNote)

// 删除游记
router.post('/delete', noteController.deleteNote)



// 更新游记详情
router.post('/update', noteController.updateNote)

export default router