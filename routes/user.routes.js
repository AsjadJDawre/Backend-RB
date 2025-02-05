import express from "express";
import { verifyJWT } from "../middlewares/authenticate.js";
import { getUser } from "../controllers/user.controller.js";
import {registerUser} from "../controllers/user.controller.js";
const router = express.Router();

router.get("/user-details", verifyJWT, (req, res) => {
  try {
    res.status(200).json(req.userdetails); // Send the extracted user details
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user details" });
  }
});

router.post('/register',registerUser)

router.post('/getUserDetails',verifyJWT,getUser)

export  {router};
