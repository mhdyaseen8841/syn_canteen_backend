import AsyncHandler from "express-async-handler";
import connectDB from "../config/connection.js";
import sql from "mssql";

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
})

// Add Employee
const addEmployee = AsyncHandler(async (req, res) => {
  const {employee_code,employee_type, employee_name, department_id, company_id,
     premium_enabled, user, active } =
    req.body;
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
      .input("reference_id",employee_code)
      .input("active", active)
      .input("user", user || req.user?.display_name || "")
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
  const { company_id,employee_type="employee" } = req.query;
  if(!company_id) {
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
    return res.status(400).json({ message: "menu_id, user_id, and no_of_entries are required" });
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
  const { employee_id, menu_id, no_of_entries,trasaction_time } = req.body;

  if (!menu_id || !no_of_entries) {
    return res.status(400).json({ message: "menu_id, user_id, and no_of_entries are required" });
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
    res.status(500).json({ message: "Failed to add Contractor transaction", error });
  }
});


const addGuestTransaction = AsyncHandler(async (req, res) => {
  const { employee_id, menu_id, no_of_entries,trasaction_time } = req.body;

  if (!menu_id || !no_of_entries) {
    return res.status(400).json({ message: "menu_id, user_id, and no_of_entries are required" });
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



export {addFixedTransaction,addContractorTransaction,addGuestTransaction, getMenu, editMenu, addEmployee, editEmployee, getEmployee, getDepartment,editDepartment,addDepartment,addCompany,getCompany };
