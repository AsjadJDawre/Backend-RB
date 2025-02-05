import { Router } from "express";
import {getRefills,}  from '../controllers/getRefills.js'
import { verifyJWT } from "../middlewares/authenticate.js";
import {GetQuota} from '../controllers/getRefillLeft.controller.js'

export const router = Router();

router.post('/remaining-refills', verifyJWT,getRefills)
router.post('/get-quota', verifyJWT,GetQuota)
