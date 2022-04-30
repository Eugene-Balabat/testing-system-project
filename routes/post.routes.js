const { Router } = require('express')
const postController = require('../controllers/post.controller')
const authMiddleware = require('../middlewares/auth-middleware')

const router = Router()

router.post('/auth', postController.authUser)
router.post('/logout', postController.logout)
router.post('/setReport', authMiddleware, postController.setReport)

module.exports = router
