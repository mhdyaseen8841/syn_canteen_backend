import AsyncHandler from "express-async-handler";
import { Request, TYPES } from "tedious";
import connectDB from "../config/connection.js";
import { generateAccessToken } from "../utils/generateToken.js";
import { decryptPassword } from "../utils/decrypt.js";

const getDBPool = async () => {
  let pool = await connectDB();
  if (!pool) {
    throw new Error("Database connection not available");
  }
  return pool;
};

const createUser = AsyncHandler(async (req, res) => {
  let pool = await getDBPool();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }

  const { user_name, display_name, emp_id, user_password } = req.body;

  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("user_name", user_name)
      .input("display_name", display_name)
      .input("emp_id", emp_id)
      .input("user_password", user_password)
      .execute(`user_entry`);
    const user = result.recordset;

    res.json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

const userLogin = AsyncHandler(async (req, res) => {
  let pool = await getDBPool();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }

  // const decryptedPassword = decryptPassword(req.body.psw);
  const decryptedPassword = req.body.psw;
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("user_name", req.body.user_name)
      .input("password", decryptedPassword)
      .execute(`user_login`);
   
          const recordsets = result.recordsets; // ✅ Use 'recordsets' instead of 'recordset'

    const userInfo = recordsets?.[0]?.[0]; // First result set: user info
    const companyList = recordsets?.[1] || []; // Second result set: companies

    if (!userInfo) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({
      accessToken: generateAccessToken(userInfo.User_ID, userInfo.display_name, userInfo.user_type),
      user: userInfo,
      companies: companyList,
    });
    
  } catch (error) {
    res.status(500).json(error);
  }
});

const updatePassword = AsyncHandler(async (req, res) => {
  let pool = await getDBPool();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }

  const { user_id, password } = req.body;

  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("user_id", TYPES.Int, user_id)
      .input("password", TYPES.NVarChar, password)
      .execute(`update_password`);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

export { createUser, userLogin, updatePassword };
