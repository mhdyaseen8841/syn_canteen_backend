import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getMenu,
  editMenu,
  addCompany,
  addDepartment,
  editDepartment,
  addEmployee,
  editEmployee,
  getEmployee,
  getDepartment,
  getCompany,
  addFixedTransaction,
  addContractorTransaction,
  addGuestTransaction,
  addExpense,
  getExpense,
  getCanteenCalender,
  editExpense,
  searchEmployee,
  addEmployeeTransaction,
  getCurrentTransaction,
  deleteEmployeeTransaction,
  getSettlementRates,
  doSettlement,
  getCanteenReports,
  getCanteenEmployeeReports,
  addRating,
  getComplaint,
  getFixedDashboard,
  getContractorDashboard,
  getVendor,
  cancelCoupon,
  getSettledFixedDashboard
} from "../controllers/canteenController.js";

// import { exportTransactions } from "../controllers/exportController.js";

const router = express.Router();

// Menu
router.route("/menu").get(protect, getMenu);
router.route("/menu").put(protect, editMenu);

// Company
router.route("/company").post(protect, addCompany).get(protect, getCompany);

// Department
router.route("/department").post(protect, addDepartment);
router.route("/department").put(protect, editDepartment);
router.route("/department").get(protect, getDepartment);

// Employee
router.route("/employee").get(protect, getEmployee);
router.route("/employee").post(protect, addEmployee);
router.route("/employee").put(protect, editEmployee);
router.route("/employee/search").post(protect, searchEmployee);

//Transaction

router.post("/get-current-transaction", protect, getCurrentTransaction);

// Add fixed transaction
router.post("/fixed-transaction", protect, addFixedTransaction);

// Add contractor transaction
router.post("/contractor-transaction", protect, addContractorTransaction);

// Add guest transaction
router.post("/guest-transaction", protect, addGuestTransaction);

// Add guest transaction
router.post("/employee-transaction", protect, addEmployeeTransaction);
//delete transaction
router.post("/delete-employee-transaction", protect, deleteEmployeeTransaction);
//Manage Expense
router.post("/expense", protect, addExpense);
router.get("/expense", protect, getExpense);
router.put("/expense", protect, editExpense);
//canteen_calender
router.get("/canteen-calender", protect, getCanteenCalender);

//settlement
router.post("/do-settlement", protect, doSettlement);
router.get("/settlement-rates", protect, getSettlementRates);

//reports
router.post("/get-canteen-employee-report", protect, getCanteenEmployeeReports);
router.post("/get-canteen-report", protect, getCanteenReports);

//rating
router.route("/rating").post(protect, addRating);
router.route("/get-complaint").post(protect, getComplaint);

router.post('/fixed-dashboard', protect, getFixedDashboard);
router.post('/settled-fixed-dashboard', protect, getSettledFixedDashboard);
router.post('/contractor-dashboard', protect, getContractorDashboard)


// Vendor
router.route("/vender").get(protect, getVendor);


// Coupon Cancel
router.route("/cancel-coupon").put(protect, cancelCoupon);

// router.post('/export-transactions',protect, exportTransactions)
export default router;
