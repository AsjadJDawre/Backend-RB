import { Router } from "express";
export const  router = Router();
import { BookingHistory } from "../controllers/getBookingHist.controller.js";
import { getAllBookings } from "../controllers/getBookingHist.controller.js";
import { verifyJWT } from "../middlewares/authenticate.js";
router.post('/get-bookings',verifyJWT,BookingHistory)
router.post('/get-Allbookings',verifyJWT,getAllBookings)