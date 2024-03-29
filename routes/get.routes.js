import { Router } from 'express'
import getController from '../controllers/get.controller.js'
import authMiddleware from '../middlewares/auth-middleware.js'

const router = Router()

router.get('/getUsers', getController.getUsers)
router.get('/getTests', authMiddleware, getController.getTests)
router.get(
  '/getPersonalTestData',
  authMiddleware,
  getController.getPersonalTestData
)
router.get('/getTestData', authMiddleware, getController.getTestData)
router.get('/getGroups', authMiddleware, getController.getGroups)
router.get('/getTestResults', authMiddleware, getController.getTestResults)
router.get(
  '/getRemoveUserData',
  authMiddleware,
  getController.getRemoveUserData
)
router.get('/getRoles', authMiddleware, getController.getRoles)
router.get('/getPersonalTests', authMiddleware, getController.getPersonalTests)
router.get(
  '/getPersonalReportData',
  authMiddleware,
  getController.getPersonalReportData
)
router.get('/refresh', getController.refresh)

export default router
