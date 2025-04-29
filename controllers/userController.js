import AsyncHandler from "express-async-handler";
import { Request, TYPES } from "tedious";
import connectDB from "../config/connection.js";
import { generateAccessToken } from "../utils/generateToken.js";
import {decryptPassword} from "../utils/decrypt.js";

const getDBPool = async () => {
  let pool = await connectDB();
  if (!pool) {
      throw new Error("Database connection not available");
  }
  return pool;
}

const createUser = AsyncHandler(async (req, res) => {
    let pool = await getDBPool();
    if (!pool) {
      return res.status(500).send("Database connection not available");
    }

    const { user_name, display_name, emp_id, user_password} = req.body;

    try {
      await pool.connect();
      const result = await pool.request()
          .input('user_name', user_name)
          .input('display_name', display_name)
          .input('emp_id', emp_id)
          .input('user_password', user_password)
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

    const decryptedPassword = decryptPassword(req.body.psw);

    try {
      await pool.connect();
      const result = await pool.request()
          .input('user_name', req.body.user_name)
          .input('password',decryptedPassword)
          .execute(`user_login`);
      const user = result.recordset;
      if (user.length === 0) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      res.json({
        accessToken: generateAccessToken(user.user_id,user.display_name),
        user
      });
  } catch (error) {
      res.status(500).json(error);
  }
})



const updatePassword = AsyncHandler(async (req, res) => {
  let pool = await getDBPool();
  if (!pool) {
    return res.status(500).send("Database connection not available");
  }

  const { user_id, password } = req.body;

  try {
    await pool.connect();
    const result = await pool.request()
        .input('user_id', TYPES.Int, user_id)
        .input('password', TYPES.NVarChar, password)
        .execute(`update_password`);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});




export { createUser, userLogin, updatePassword };
