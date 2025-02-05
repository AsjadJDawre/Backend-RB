import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Booking } from "../models/booking.model.js";
import { createOrder } from "../controllers/razorpay.controller.js"; // Importing the Razorpay createOrder controller

export const booking = asyncHandler(async (req, res, next) => {
  const { bookingDetails, refills, amount } = req.body;
  const userdetails = req.userdetails;

  // Check for missing fields
  if (!bookingDetails || !refills || !amount || !userdetails) {
    console.log("Fields are missing in booking middleware.");
    console.log(bookingDetails, refills, amount, userdetails);
    return res.status(400).json({ message: "All fields are required." });
  }

  const { bookingType, optionType, inputValue } = bookingDetails;
  const { id, fullName, address } = userdetails;

  // Validate individual fields
  if (!bookingType || !optionType || !inputValue || !id || !fullName || !address) {
    return res.status(400).json({ message: "Invalid or incomplete data provided." });
  }

  // Prepare bookingDetails dynamically based on optionType
  const bookingData = {
    amount: amount,
    bookingType: bookingType,
    totalRefill: refills,
    consumerNumber: optionType === "Consumer Number" ? inputValue : undefined,
    LPGID: optionType === "LPGID" ? inputValue : undefined,
    mobile: optionType === "Mobile Number" ? inputValue : undefined,
  };

  // Create a new booking document
  const newBooking = new Booking({
    applicantId: id,
    applicantName: fullName,
    bookingDetails: bookingData,
    address: address,
  });

  // Save booking to database
  console.log("Saving application to database...");
  const savedBooking = await newBooking.save();

  // Create Razorpay Order after booking is created
  const { amount: orderAmount, _id: bookingId } = savedBooking;
  try {
    const razorpayOrderResponse = await createOrder({ amount: orderAmount });

    // Update booking with Razorpay orderId
    savedBooking.razorpayOrderId = razorpayOrderResponse.order.id;
    await savedBooking.save();

    console.log("Razorpay order created and linked to booking.");

    res.status(201).json({
      message: "Booking for refills created successfully.",
      applicationId: savedBooking._id,
      razorpayOrderId: razorpayOrderResponse.order.id,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Error while creating Razorpay order" });
  }

  next();
});
