import { exportExcel, exportPDF } from "../utils/exportHelper.js";
import AsyncHandler from "express-async-handler";
import connectDB from "../config/connection.js";
import sql from "mssql";
import { toSqlDate } from "../utils/toSqlDate.js";


export const exportTransactions = AsyncHandler(async (req, res) => {
  const {
    canteen_calendar_id,
    menu_id,
    transaction_type,
    from_date,
    to_date,
    employee_id,
    format = "excel", // default
  } = req.body;

  const pool = await connectDB();
  if (!pool) return res.status(500).send("Database connection not available");

  const request = pool.request();
  request.input("canteen_calendar_id", canteen_calendar_id);
  request.input("menu_id", menu_id || null);
  request.input("transaction_type", transaction_type);
  request.input("from_date", from_date ? toSqlDate(from_date) : null);
  request.input("to_date", to_date ? toSqlDate(to_date) : null);
  request.input("employee_id", employee_id || null);

  const result = await request.execute("Get_canteen_transaction_export");
  const rows = result.recordset || [];

  const columns = [
    { header: "Transaction ID", key: "transaction_id", width: 18 },
    { header: "Employee", key: "employee_name", width: 25 },
    { header: "Menu", key: "menu_name", width: 30 },
    { header: "Date", key: "date", width: 20 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Status", key: "status", width: 15 },
  ];

  const filename = `transactions-${Date.now()}`;

  if (format === "pdf") {
    await exportPDF(res, filename, columns, rows);
  } else {
    await exportExcel(res, filename, columns, rows);
  }
});
