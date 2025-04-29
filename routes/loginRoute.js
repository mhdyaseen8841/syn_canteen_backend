import express from 'express'

import { createUser,updatePassword,userLogin  } from '../controllers/userController.js';

const router = express.Router()

router.route('/register').post(createUser);  // User Registration
router.route('/login').post(userLogin);      // User Login
// router.route('/update-password').put(updatePassword); // Not Implemented

export default router