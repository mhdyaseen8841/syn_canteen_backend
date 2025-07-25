import jwt from 'jsonwebtoken'
import AsyncHandler from 'express-async-handler'


import { generateAccessToken } from '../utils/generateToken.js';

const protect = AsyncHandler(async (req, res, next) => {
  let token;
  try {
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded.user
    req.user_id = decoded.user?.user_id
    if (req.user === undefined) {
      next()
      res.status(401).json({ msg: 'No user found..' })
      throw new Error('Not Autherized')
    } else {
      next();
    }

  } catch (error) {
  next()
    res.status(401).json({ msg: 'Not authorized..' })
    throw new Error('Not authorized, token failed');

  }
});

const protectRefreshToken = AsyncHandler(async (req, res) => {
  const token = req.cookies.jwt;
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const accessToken = generateAccessToken(decoded.id);
    res.status(201)
      .json({"token":accessToken})
  } catch (error) {
    res.status(402).json({ msg: 'Not authorized..' })
  }
})

export { protect, protectRefreshToken };