const { Router } = require('express')
const postController = require('../controllers/post.controller')
const authMiddleware = require('../middlewares/auth-middleware')

const router = Router()

router.post('/auth', postController.authUser)
router.post('/logout', postController.logout)
router.post('/setReport', authMiddleware, postController.setReport)
router.post('/setNewTest', authMiddleware, postController.setNewTest)
router.post('/setNewUser', authMiddleware, postController.setNewUser)
router.post('/removeUsers', authMiddleware, postController.removeUsers)
router.post('/updateUsers', authMiddleware, postController.updateUsers)
router.post('/deleteTest', authMiddleware, postController.deleteTest)

module.exports = router
