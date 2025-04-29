import AsyncHandler from "express-async-handler";
import { Request, TYPES } from "tedious";
import connectDB from "../config/connection.js";

const createReport = AsyncHandler(async (req, res) => {


    let pool = await connectDB();
    if (!pool) {
      return res.status(500).send("Database connection not available");
    }

    const { name, address, email, phone, company, personToVisit, purpose, remarks, image,visitorType } = req.body;

    try {
      await pool.connect();
      const result = await pool.request()
          .input('visitor_name', name)
          .input('address', address)
          .input('email', email)
          .input('phone', phone)
          .input('company', company)
          .input('person_to_visit', personToVisit)
          .input('purpose', purpose)
          .input('visitor_type', visitorType)
          .input('remarks', remarks)
          .input('user',  req.user?.display_name || "")
          .input('photo', image)
          .execute(`visit_entry`);
      const employees = result.recordset;

      res.json(employees);
  } catch (error) {
      res.status(500).json(error);
  }
});

const getVisitorDashboard = AsyncHandler(async (req, res) => {

    let pool = await connectDB();
    if (!pool) {
      return res.status(500).send("Database connection not available");
    }

    try {
      await pool.connect();
      const result = await pool.request()
         .input('report_type', "Dashboard")
         .execute(`get_visit`);
      const employees = result.recordset;

      res.json(employees);
  } catch (error) {
      res.status(500).json(error);
  }
})


export { createReport, getVisitorDashboard};