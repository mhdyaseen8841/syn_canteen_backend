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


const getVisitorReport = AsyncHandler(async (req, res) => {
  const { from_date, to_date } = req.query; 
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }

  try {
    await pool.connect();
    const result = await pool.request()
       .input('report_type', "Report")
       .input('from_date', from_date)
       .input('to_date', to_date)
       .execute(`get_visit`);
    const employees = result.recordset;

    res.json(employees);
} catch (error) {
    res.status(500).json(error);
}
})

const getCurrentVisitor = AsyncHandler(async (req, res) => {

  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool.request()
       .input('report_type', "Current_Visitor")
       .execute(`get_visit`);
    const employees = result.recordset;

    res.json(employees);
} catch (error) {
    res.status(500).json(error);
}
})


const visitorCheckout = AsyncHandler(async (req, res) => {

  const { visit_id  } = req.body;
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool.request()
        .input('user',  req.user?.display_name || "")
        .input('visit_id', visit_id)
       .execute(`visit_checkout`);
    const employees = result.recordset;

    res.json(employees);
} catch (error) {
    res.status(500).json(error);
}

})

const getCompanyData = AsyncHandler(async (req, res) => {
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool.request()
       .execute(`get_company`);
    const data = result.recordset;
    res.json(data);
} catch (error) {
    res.status(500).json(error);
}

})

const getPersonData = AsyncHandler(async (req, res) => {
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool.request()
       .input('company_id', req.query.company_id)
       .execute(`get_person`);
    const data = result.recordset;
    res.json(data);
} catch (error) {
    res.status(500).json(error);
}

})


const getPurpose = AsyncHandler(async (req, res) => {
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool.request()
       .execute(`get_purpose`);
    const data = result.recordset;
    res.json(data);
} catch (error) {
    res.status(500).json(error);
}

})


const addPurpose = AsyncHandler(async (req, res) => {
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool.request()
    .input('purpose', req.body.purpose)
    .input('user', req.body.user)
       .execute(`purpose_entry`);
    const data = result.recordset;
    res.json(data);
} catch (error) {
    res.status(500).json(error);
}

})


const addPerson = AsyncHandler(async (req, res) => {
  let pool = await connectDB();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }
  try {
    await pool.connect();
    const result = await pool.request()
    .input('person_name', req.body.person_name)
    .input('company_id', req.body.company_id)
    .input('user', req.body.user)
    .execute(`person_entry`);
    const data = result.recordset;
    res.json(data);
} catch (error) {
    res.status(500).json(error);
}

})
export { createReport, getVisitorDashboard, getVisitorReport, getCurrentVisitor, visitorCheckout, getCompanyData, getPersonData, getPurpose, addPurpose, addPerson };
