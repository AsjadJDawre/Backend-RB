import { AdminQuota } from "../models/AdminQuota.model.js";
import { Booking } from "../models/booking.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const BookingHistory = asyncHandler(async (req, res, next) => {
    try {
        console.log("I am in booking History");
        const userID = req.userdetails.id;
        console.log('yO', userID);

        const bookings = await Booking.find({ applicantId: userID });
        const adminQuota = await AdminQuota.find({ applicantId: userID });

        console.log(bookings.length, 'This is the admin quota', adminQuota.length);

        res.status(200).json({ success: true, data: { bookings, adminQuota } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
});


const getAllBookings = asyncHandler(async (req, res, next) => {
    try {
        console.log(" I am in Get All bookings ")
        
        const adminQuota = await AdminQuota.find()
        console.log("All Bookings",adminQuota);

        
        res.status(200).json({ success: true, adminQuota });
    
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
        
    }
})

const updateBookings = asyncHandler(async (req, res, next) => {
    try {
        console.log(" I am in update Bookings ")
        const { id, status } = req.body
        console.log(id,status)
        const bookings = await AdminQuota.updateOne(
            { _id: id }, 
            { $set: { adminStatus: status } } // Use $set to update a specific field
        );
        console.log("Bookings updated successfully",bookings);
        
        res.status(200).json({ success: true, bookings });
    
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
        
    }
})

export {BookingHistory,getAllBookings,updateBookings}