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
  const { menu_id, start_time, end_time, active } = req.body;
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
      // .input('user', req.user?.display_name || "")
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
//Not Implemented
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
//Not Implemented
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
      .execute("add_department");
    const data = result.recordset;
    res.json({ message: "Department added successfully", data });
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
      .execute("edit_department");
    const data = result.recordset;
    res.json({ message: "Department updated successfully", data });
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
      .input("reference_id", employee_code)
      .input("active", active)
      .input("user", req.user?.display_name || "")
      .execute("add_employee");
    const data = result.recordset;
    res.json({ message: "Employee added successfully", data });
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
      .execute("edit_employee");
    const data = result.recordset;
    res.json({ message: "Employee updated successfully", data });
  } catch (error) {
    res.status(500).json(error);
  }
});

const getEmployee = AsyncHandler(async (req, res) => {
  const { company_id, employee_type = "employee" } = req.query;
  if (!company_id) {
    return res.status(400).json({ message: "company_id is required" });
  }
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    const request = pool.request();
    request.input("company_id", company_id);
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
  if (!company_id) {
    return res.status(400).json({ message: "company_id is required" });
  }

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
  const { transaction_id } = req.body;

  const pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }

  try {
    await pool.connect();

    const result = await pool
      .request()
      .input("Transaction_Id", transaction_id)
      .input("Is_Delete", 1)
      .input("user_ID", req.user_id)
      .output("Transaction_Id_Out", sql.Int)
      .execute("add_canteen_transaction");

    res.status(200).json({
      message: "Guest transaction deleted successfully",
      transaction_id: result.output.Transaction_Id_Out,
    });
  } catch (error) {
    console.error("Error  deleted transaction:", error);
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
  const { is_settled = 0 } = req.query;

  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    const request = pool.request();
    request.input("is_settled", is_settled);

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

const doSettlement1 = AsyncHandler(async (req, res) => {
  const { menus,menu_id, canteen_calendar_id, amount } = req.body;

  if (!menu_id || !canteen_calendar_id || !amount) {
    return res
      .status(400)
      .json({
        message: "menu_id, amount and canteen_calendar_id are required",
      });
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
      .input("User_ID", req.user_id)
      .input("canteen_calendar_id", canteen_calendar_id)
      .input("amount", amount)
      .execute("settlement");

    res.status(200).json({
      message: "Settled added successfully",
    });
  } catch (error) {
    console.error("Error adding settlement:", error);
    res.status(500).json({ message: "Failed to add settlement", error });
  }
});


const doSettlement = AsyncHandler(async (req, res) => {
  const { menus, canteen_calendar_id } = req.body;

  if (!menus || !Array.isArray(menus) || menus.length === 0 || !canteen_calendar_id) {
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
    res.status(500).json({ message: "Failed to add settlements", error: error.message });
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
};
