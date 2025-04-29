import express from 'express'
import { addPerson, addPurpose, createReport, getCompanyData, getCurrentVisitor, getPersonData, getPurpose, getVisitorDashboard, getVisitorReport, visitorCheckout,  } from '../controllers/visitorReportsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router()

// router.route('/visitEntry').post(protect,createReport)
router.route('/visitEntry').post(protect,createReport)
router.route('/getVisitorDashboard').get(protect,getVisitorDashboard)
router.route('/getCurrentVisitor').get(protect,getCurrentVisitor)
router.route('/getVisitorReport').get(protect,getVisitorReport)
router.route('/visitorCheckout').post(protect,visitorCheckout)
router.route('/visitorCheckout').post(protect,visitorCheckout)
router.route('/visitorCheckout').post(protect,visitorCheckout)
router.route('/getPurpose').get(protect,getPurpose)
router.route('/addPurpose').post(protect,protect,addPurpose)
router.route('/addPerson').post(protect,addPerson)
router.route('/getPerson').get(protect,getPersonData)
router.route('/getCompany').get(protect,getCompanyData)
export default router