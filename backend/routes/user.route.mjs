import express from 'express';
import multer from 'multer';

//controller functions
import { loginUser, registerUser, getUserByUsername, updateUserByUsername } from '../controllers/user.controller.mjs';


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

//login route
router.post('/login', loginUser)


//register route
router.post('/register', registerUser)

// get user by username
router.get('/:username', getUserByUsername)

// update user by username
router.put('/:username', upload.single("avatar"), updateUserByUsername)

export default router;