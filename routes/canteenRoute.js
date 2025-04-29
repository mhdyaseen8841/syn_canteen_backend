import express from 'express'
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router()

router.route('/visitEntry').post(protect,createReport)
router.route('/getVisitorDashboard').get(protect,getVisitorDashboard)
export default router