import AsyncHandler from "express-async-handler";
import connectDB from "../config/connection.js";
import sql from "mssql";
import { toSqlDate } from "../utils/toSqlDate.js";

// Get Menu
const getMenu = AsyncHandler(async (req, res) => {
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool.request().execute("get_menu");
    const data = result.recordset;
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Edit Menu
const editMenu = AsyncHandler(async (req, res) => {
  const { menu_id, start_time, end_time, fixed_menu_rate, active } = req.body;
  if (!menu_id) {
    return res.status(400).json({ message: "menu_id is required" });
  }
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("menu_id", menu_id)
      .input("start_time", start_time)
      .input("end_time", end_time)
      .input("active", active)
      .input("fixed_rate", fixed_menu_rate)
      .input("user_id", req.user_id || 0)
      .execute("edit_menu");
    const data = result.recordset;
    res.json({ message: "Menu updated successfully", data });
  } catch (error) {
    res.status(500).json(error);
  }
});

const getCompany = AsyncHandler(async (req, res) => {
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool.request().execute("get_company");
    const data = result.recordset;
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Add Company
const addCompany = AsyncHandler(async (req, res) => {
  const { company_name, user } = req.body;
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("company_name", company_name)
      .input("user", user || req.user?.display_name || "")
      .execute("add_company");
    const data = result.recordset;
    res.json({ message: "Company added successfully", data });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Add Department

const addDepartment = AsyncHandler(async (req, res) => {
  const { department_name } = req.body;
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("department_name", department_name)
      .input("user_id", req.user_id)
      .output("status_code", sql.Int)
      .output("Remarks", sql.VarChar)
      .execute("add_department");
    const data = result.output;

    if (data.status_code == 100) {
      res.json({ message: "Department added successfully", data });
    } else {
      const err = new Error(data.Remarks || "Error Occured");
      err.status_code = data.status_code;
      return res
        .status(400)
        .json({ message: data.Remarks, status_code: data.status_code });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const editDepartment = AsyncHandler(async (req, res) => {
  const { department_id, department_name } = req.body;
  if (!department_id) {
    return res.status(400).json({ message: "department_id is required" });
  }
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("department_id", department_id)
      .input("department_name", department_name)
      .input("user_id", req.user_id)
      .output("status_code", sql.Int)
      .output("Remarks", sql.VarChar)
      .execute("edit_department");

    const data = result.output;

    if (data.status_code == 100) {
      res.json({ message: "Department updated successfully", data });
    } else {
      const err = new Error(data.Remarks || "Error Occured");
      err.status_code = data.status_code;
      return res
        .status(400)
        .json({ message: data.Remarks, status_code: data.status_code });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Add Employee
const addEmployee = AsyncHandler(async (req, res) => {
  const {
    employee_code,
    employee_type,
    employee_name,
    department_id,
    company_id,
    premium_enabled,
    active,
  } = req.body;
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("employee_code", employee_code)
      .input("employee_name", employee_name)
      .input("employee_type", employee_type)
      .input("company_id", company_id)
      .input("department_id", department_id)
      .input("premium_enabled", premium_enabled)
      .input("active", active)
      .input("user", req.user?.display_name || "")
      .output("status_code", sql.Int)
      .output("Remarks", sql.VarChar)
      .execute("add_employee");
    const data = result.output;
    if (data.status_code == 100) {
      res.json({ message: "Employee added successfully", data });
    } else {
      const err = new Error(data.Remarks || "Error Occured");
      err.status_code = data.status_code;
      return res
        .status(400)
        .json({ message: data.Remarks, status_code: data.status_code });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Edit Employee
const editEmployee = AsyncHandler(async (req, res) => {
  const {
    employee_code,
    employee_name,
    department_id,
    company_id,
    employee_type,
    premium_enabled,
    active,
    employee_id,
    user,
  } = req.body;
  if (!employee_id) {
    return res.status(400).json({ message: "employee_id is required" });
  }
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("employee_code", employee_code)
      .input("employee_name", employee_name)
      .input("employee_type", employee_type)
      .input("department_id", department_id)
      .input("company_id", company_id)
      .input("premium_enabled", premium_enabled)
      .input("active", active)
      .input("user", user || req.user?.display_name || "")
      .input("employee_id", employee_id)
      .output("status_code", sql.Int)
      .output("Remarks", sql.VarChar)
      .execute("edit_employee");
    const data = result.output;
    if (data.status_code == 100) {
      res.json({ message: "Employee updated successfully" });
    } else {
      const err = new Error(data.Remarks || "Error Occured");
      err.status_code = data.status_code;
      return res
        .status(400)
        .json({ message: data.Remarks, status_code: data.status_code });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const getEmployee = AsyncHandler(async (req, res) => {
  const { company_id, employee_type = "employee" } = req.query;

  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    const request = pool.request();
    if (company_id && company_id != "null") {
      request.input("company_id", company_id);
    }
    request.input("employee_type", employee_type);
    const result = await request.execute("get_employee");

    const data = result.recordset;
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

const searchEmployee = AsyncHandler(async (req, res) => {
  const { company_id, employee_type = "employee", search_text } = req.body;

  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    const request = pool.request();
    request.input("company_id", company_id);
    request.input("employee_type", employee_type);
    request.input("search_text", search_text);
    const result = await request.execute("get_employee_search");

    const data = result.recordset;

    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

const getDepartment = AsyncHandler(async (req, res) => {
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool.request().execute("get_department");
    const data = result.recordset;
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

const addFixedTransaction = AsyncHandler(async (req, res) => {
  const { menu_id, no_of_entries } = req.body;

  if (!menu_id || !no_of_entries) {
    return res
      .status(400)
      .json({ message: "menu_id, user_id, and no_of_entries are required" });
  }

  const pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }

  try {
    await pool.connect();

    const result = await pool
      .request()
      .input("Employee_Id", null)
      .input("Menu_Id", menu_id)
      .input("user_ID", req.user_id)
      .input("Transaction_Id", null)
      .input("Transaction_Time", null)
      .input("Is_Delete", 0)
      .input("No_Of_Entries", no_of_entries)
      .input("transaction_type", "fixed")
      .input("source", null)
      .output("Transaction_Id_Out", sql.Int)
      .execute("add_canteen_transaction");

    res.status(200).json({
      message: "Fixed transaction added successfully",
      transaction_id: result.output.Transaction_Id_Out,
    });
  } catch (error) {
    console.error("Error adding fixed transaction:", error);
    res.status(500).json({ message: "Failed to add fixed transaction", error });
  }
});

const addContractorTransaction = AsyncHandler(async (req, res) => {
  const { employee_id, menu_id, no_of_entries, trasaction_time } = req.body;

  if (!menu_id || !no_of_entries) {
    return res
      .status(400)
      .json({ message: "menu_id, user_id, and no_of_entries are required" });
  }

  const pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }

  try {
    await pool.connect();

    const result = await pool
      .request()
      .input("Employee_Id", employee_id)
      .input("Menu_Id", menu_id)
      .input("user_ID", req.user_id)
      .input("Transaction_Id", null)
      .input("Transaction_Time", trasaction_time)
      .input("Is_Delete", 0)
      .input("No_Of_Entries", no_of_entries)
      .input("transaction_type", "contractor")
      .input("source", null)
      .output("Transaction_Id_Out", sql.Int)
      .execute("add_canteen_transaction");

    res.status(200).json({
      message: "Contractor transaction added successfully",
      transaction_id: result.output.Transaction_Id_Out,
    });
  } catch (error) {
    console.error("Error adding Contractor transaction:", error);
    res
      .status(500)
      .json({ message: "Failed to add Contractor transaction", error });
  }
});

const addGuestTransaction = AsyncHandler(async (req, res) => {
  const { employee_id, menu_id, no_of_entries, trasaction_time } = req.body;

  if (!menu_id || !no_of_entries) {
    return res
      .status(400)
      .json({ message: "menu_id, user_id, and no_of_entries are required" });
  }

  const pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }

  try {
    await pool.connect();

    const result = await pool
      .request()
      .input("Employee_Id", employee_id)
      .input("Menu_Id", menu_id)
      .input("user_ID", req.user_id)
      .input("Transaction_Id", null)
      .input("Transaction_Time", trasaction_time)
      .input("Is_Delete", 0)
      .input("No_Of_Entries", no_of_entries)
      .input("transaction_type", "guest")
      .input("source", null)
      .output("Transaction_Id_Out", sql.Int)
      .execute("add_canteen_transaction");

    res.status(200).json({
      message: "Guest transaction added successfully",
      transaction_id: result.output.Transaction_Id_Out,
    });
  } catch (error) {
    console.error("Error adding guest transaction:", error);
    res.status(500).json({ message: "Failed to add guest transaction", error });
  }
});

const addEmployeeTransaction = AsyncHandler(async (req, res) => {
  const { employee_id, menu_id, no_of_entries, trasaction_time, remarks } =
    req.body;

  if (!menu_id || !no_of_entries) {
    return res
      .status(400)
      .json({ message: "menu_id, user_id, and no_of_entries are required" });
  }

  const pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }

  try {
    await pool.connect();

    const result = await pool
      .request()
      .input("Employee_Id", employee_id)
      .input("Menu_Id", menu_id)
      .input("user_ID", req.user_id)
      .input("Transaction_Id", null)
      .input("Transaction_Time", trasaction_time)
      .input("Is_Delete", 0)
      .input("No_Of_Entries", no_of_entries)
      .input("transaction_type", "employee")
      .input("source", null)
      .input("remarks", remarks || null)
      .output("Transaction_Id_Out", sql.Int)
      .execute("add_canteen_transaction");

    res.status(200).json({
      message: "Employee transaction added successfully",
      transaction_id: result.output.Transaction_Id_Out,
    });
  } catch (error) {
    console.error("Error adding employee transaction:", error);
    res
      .status(500)
      .json({ message: "Failed to add employee transaction", error });
  }
});

const deleteEmployeeTransaction = AsyncHandler(async (req, res) => {
  const { transaction_id, reason } = req.body;

  const pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }

  try {
    await pool.connect();

    const result = await pool
      .request()
      .input("Transaction_Id", transaction_id)
      .input("Reason", reason)
      .input("user_ID", req.user_id)
      .execute("remove_canteen_transaction");

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res
      .status(500)
      .json({ message: "Failed to deleted employee transaction", error });
  }
});

const getCurrentTransaction = AsyncHandler(async (req, res) => {
  let {
    canteen_calendar_id,
    menu_id,
    transaction_type, //this is for current transaction so all type
    from_date, //this can be null
    to_date, //this can be null
    employee_id, //this can be null
  } = req.body;

  if (
    menu_id == undefined ||
    menu_id == "" ||
    menu_id == "null" ||
    menu_id == "undefined"
  ) {
    menu_id = null;
  }

  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    const request = pool.request();
    request.input("canteen_calendar_id", canteen_calendar_id);
    request.input("menu_id", menu_id);
    request.input("transaction_type", transaction_type);
    request.input("from_date", from_date ? toSqlDate(from_date) : null);
    request.input("to_date", to_date ? toSqlDate(to_date) : null);
    request.input("employee_id", employee_id ? employee_id : null);

    const result = await request.execute("Get_canteen_transaction");

    const data = result.recordset;
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

const getExpense = AsyncHandler(async (req, res) => {
  let { canteen_calendar_id, menu_id } = req.query;

  if (
    menu_id == undefined ||
    menu_id == "" ||
    menu_id == "null" ||
    menu_id == "undefined"
  ) {
    menu_id = null;
  }
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    const request = pool.request();
    request.input("canteen_calendar_id", canteen_calendar_id);
    request.input("menu_id", menu_id);
    const result = await request.execute("get_expense");

    const data = result.recordset;
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

const addExpense = AsyncHandler(async (req, res) => {
  const {
    menu_id,
    canteen_calendar_id,
    expense_date,
    expense_amount,
    remarks,
  } = req.body;

  if (!menu_id || !canteen_calendar_id) {
    return res
      .status(400)
      .json({ message: "menu_id,  and canteen_calendar_id are required" });
  }

  const pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }

  try {
    await pool.connect();

    const result = await pool
      .request()

      .input("Menu_Id", menu_id)
      .input("user_ID", req.user_id)
      .input("canteen_calendar_id", canteen_calendar_id)
      .input("expense_date", expense_date)
      .input("expense_amount", expense_amount)
      .input("remarks", remarks)
      .execute("add_expense");

    res.status(200).json({
      message: "Expense added successfully",
      transaction_id: result.output.Transaction_Id_Out,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Failed to add expense", error });
  }
});

const editExpense = AsyncHandler(async (req, res) => {
  const {
    expense_id,
    menu_id,
    canteen_calendar_id,
    expense_date,
    expense_amount,
    remarks,
    active,
  } = req.body;

  // Validate required fields
  if (
    !expense_id ||
    !menu_id ||
    !canteen_calendar_id ||
    !expense_date ||
    !expense_amount ||
    active === undefined
  ) {
    return res.status(400).json({
      message:
        "All fields (expense_id, menu_id, canteen_calendar_id, expense_date, expense_amount, remarks, active) are required",
    });
  }

  const pool = await connectDB();
  if (!pool) {
    return res
      .status(500)
      .json({ message: "Database connection not available" });
  }

  try {
    const result = await pool
      .request()
      .input("expense_id", expense_id)
      .input("menu_id", menu_id)
      .input("canteen_calendar_id", canteen_calendar_id)
      .input("expense_date", expense_date)
      .input("expense_amount", expense_amount)
      .input("remarks", remarks)
      .input("user_id", req.user_id)
      .input("active", active)
      .execute("edit_expense");

    res.status(200).json({
      message: "Expense updated successfully",
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({
      message: "Failed to update expense",
      error: error.message,
    });
  }
});

const getCanteenCalender = AsyncHandler(async (req, res) => {
  const { is_settled } = req.query;

  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    const request = pool.request();

    if (
      is_settled !== "" &&
      is_settled !== undefined &&
      is_settled !== "undefined"
    ) {
      request.input("is_settled", is_settled);
    } else {
      request.input("is_settled", null);
    }

    const result = await request.execute("Get_canteen_calendar");

    const data = result.recordset;
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

const getSettlementRates = AsyncHandler(async (req, res) => {
  const { canteenCalenderId } = req.query;

  if (canteenCalenderId == undefined || canteenCalenderId == null) {
    return res.status(400).json({ message: "canteenCalenderId is required" });
  }
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    const request = pool.request();
    request.input("canteen_calendar_id", canteenCalenderId);

    const result = await request.execute("Get_settlement_rate");

    const data = result.recordset;
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});



const doSettlement = AsyncHandler(async (req, res) => {
  const { menus, canteen_calendar_id } = req.body;

  if (
    !menus ||
    !Array.isArray(menus) ||
    menus.length === 0 ||
    !canteen_calendar_id
  ) {
    return res.status(400).json({
      message: "menus (array) and canteen_calendar_id are required",
    });
  }

  const pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }

  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    for (const { menu_id, amount } of menus) {
      if (!menu_id || amount == null) {
        throw new Error("Each menu must have menu_id and amount");
      }

      const request = new sql.Request(transaction);
      await request
        .input("Menu_Id", sql.Int, menu_id)
        .input("User_ID", sql.Int, req.user_id)
        .input("canteen_calendar_id", sql.Int, canteen_calendar_id)
        .input("amount", sql.Decimal(18, 2), amount)
        .execute("settlement");
    }

    await transaction.commit();
    res.status(200).json({ message: "All settlements added successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in settlement transaction:", error);
    res
      .status(500)
      .json({ message: "Failed to add settlements", error: error.message });
  }
});

const getCanteenEmployeeReports = AsyncHandler(async (req, res) => {
  const { employeeId, canteenCalendarId } = req.body;

  if (canteenCalendarId == undefined || canteenCalendarId == null) {
    return res.status(400).json({ message: "canteenCalendarId is required" });
  }

  if (employeeId == undefined || employeeId == null) {
    return res.status(400).json({ message: "employeeId is required" });
  }

  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    const request = pool.request();
    request.input("employee_id", employeeId);
    request.input("canteen_calendar_id", canteenCalendarId);
    request.output("is_Settled", sql.Int);
    request.output("AC_Dine_Charge", sql.Decimal(10, 2));
    const result = await request.execute("Get_canteen_employee_report");

    const is_Settled = result.output.is_Settled;
    const AC_Dine_Charge = result.output.AC_Dine_Charge;
    let summaryData = [];
    let transactionDetails = [];
    if (is_Settled === 1) {
      summaryData = result.recordsets[0] || [];
      transactionDetails = result.recordsets[1] || [];
    } else {
      transactionDetails = result.recordsets[0] || [];
    }
    res.json({
      is_Settled,
      AC_Dine_Charge,
      summary: summaryData,
      transactionDetails: transactionDetails,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

const getCanteenReports = AsyncHandler(async (req, res) => {
  const { canteenCalenderId, employeeType, companyId } = req.body;

  if (canteenCalenderId == undefined || canteenCalenderId == null) {
    return res.status(400).json({ message: "canteenCalenderId is required" });
  }

  if (employeeType == undefined || employeeType == null) {
    return res.status(400).json({ message: "employeeType is required" });
  }

  if (companyId == undefined || companyId == null) {
    return res.status(400).json({ message: "companyId is required" });
  }

  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    const request = pool.request();
    request.input("canteen_calendar_id", canteenCalenderId);
    request.input("company_id", companyId);
    request.input("employee_type", employeeType);

    const result = await request.execute("Get_canteen_report");

    const data = result.recordset;
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

const addRating = AsyncHandler(async (req, res) => {
  const { transactionId, rating, isComplaint, remarks } = req.body;
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("transaction_id", transactionId)
      .input("rating", rating)
      .input("is_Complaint", isComplaint)
      .input("Remarks", remarks)
      .input("user_id", req.user_id || 0)
      .execute("add_rating");
    const data = result.recordset;
    res.json({ message: "Rating added successfully", data });
  } catch (error) {
    res.status(500).json(error);
  }
});


const getComplaint = AsyncHandler(async (req, res) => {
  const { from_date, to_date, employee_id } = req.body;

  if (!from_date || !to_date) {
    return res.status(400).json({ message: "from_date and to_date are required" });
  }

  const pool = await connectDB();
  if (!pool) return res.status(500).send("Database connection failed");

  const empId = !employee_id || employee_id === 'undefined' ? null : employee_id;


  try {
    await pool.connect();

    const result = await pool
      .request()
      .input("from_date", from_date)
      .input("to_date", to_date)
      .input("employee_id", empId)
      .execute("get_complaint");
    res.json({ data: result.recordset });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Error fetching complaints", error });
  }
});


export {
  getCanteenCalender,
  getCurrentTransaction,
  addFixedTransaction,
  addContractorTransaction,
  addGuestTransaction,
  addEmployeeTransaction,
  deleteEmployeeTransaction,
  getMenu,
  editMenu,
  addEmployee,
  editEmployee,
  getEmployee,
  getDepartment,
  editDepartment,
  addDepartment,
  addCompany,
  getCompany,
  addExpense,
  getExpense,
  editExpense,
  searchEmployee,
  getSettlementRates,
  doSettlement,
  getCanteenReports,
  getCanteenEmployeeReports,
  addRating,
  getComplaint
};
