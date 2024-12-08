import express from 'express';

//controller functions
import { loginUser, registerUser, getUserByUsername, updateUserByUsername } from '../controllers/user.controller.mjs';


const router = express.Router();

//login route
router.post('/login', loginUser)


//register route
router.post('/register', registerUser)

// get user by username
router.get('/:username', getUserByUsername)

// update user by username
router.put('/:username', updateUserByUsername)

export default router;