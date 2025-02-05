import express from 'express';
import { loginUser, logOutUser, registerUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/authenticate.js';

export const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/logout',verifyJWT, logOutUser);
router.post('/verify', verifyJWT, (req, res) => {
    res.status(200).json({
        status:200,
        message: "User verified successfully",
        user: req.userdetails
    });
});
