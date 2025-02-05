import express from 'express';
import { createBooking } from '../controllers/booking.controller.js';
import { verifyJWT } from '../middlewares/authenticate.js';
import { updateBookings } from '../controllers/getBookingHist.controller.js';
import {createAdminQuota} from '../controllers/AdminQuota.model.js'
export const router = express.Router();

router.post('/create-booking', verifyJWT, createBooking);
router.post('/update-booking', verifyJWT, updateBookings);
router.post('/create-booking-adminQuota',verifyJWT,createAdminQuota)