import { Router } from "express";
import { checkUserController ,resetPassword, verifyOTP} from "../controllers/passReset.controller.js";
export const router = Router()

router.post("/checkUser",checkUserController)
router.post("/resetPassword",resetPassword)
router.post("/verifyOTP",verifyOTP)