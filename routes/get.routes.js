const { Router } = require('express')
const getController = require('../controllers/get.controller')

const router = Router()

router.get('/cookie', getController.getCookie)

module.exports = router
