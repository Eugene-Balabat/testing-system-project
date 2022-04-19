const { Router } = require('express')
const postController = require('../controllers/post.controller')

const router = Router()

router.post('/auth', postController.authUser)
router.post('/logout', postController.logout)

module.exports = router
