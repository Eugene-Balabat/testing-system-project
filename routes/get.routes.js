const { Router } = require('express')
const getController = require('../controllers/get.controller')
const authMiddleware = require('../middlewares/auth-middleware')

const router = Router()

router.get('/getUsers', getController.getUsers)
router.get('/getTests', authMiddleware, getController.getTests)
router.get('/getTestData', authMiddleware, getController.getTestData)
router.get('/getGroups', authMiddleware, getController.getGroups)
router.get('/getPersonalTests', authMiddleware, getController.getPersonalTests)
router.get('/refresh', getController.refresh)

module.exports = router
