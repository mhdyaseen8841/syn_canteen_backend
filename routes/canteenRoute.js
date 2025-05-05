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
} from "../controllers/canteenController.js";

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

//Transaction

// Add fixed transaction
router.post("/fixed-transaction", addFixedTransaction);

// Add contractor transaction
router.post("/contractor-transaction", addContractorTransaction);

// Add guest transaction
router.post("/guest-transaction", addGuestTransaction);

//Manage Expense
router.post("/expense", addExpense);
router.get("/expense", getExpense);

//canteen_calender
router.get("/canteen-calender",getCanteenCalender)
export default router;
