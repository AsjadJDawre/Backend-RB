import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  applicantName: {
    type: String,
    required: true,
  },
  applicantId: {
    type: String,
    required: true,
  },
  bookingDetails: {
    amount: {
      type: Number,
      required: true,
    },
    bookingType: {
      type: String,
      required: true,
    },
    totalRefill: {
      type: Number,
      required: true,
    },
    consumerNumber: {
      type: String,
    },
    LPGID: {
      type: String,
    },
    mobile: {
      type: String,
    },
  },
  address: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },

  },
  adminStatus: { type: String, default: "Pending" },
  razorpayOrderId: { type: String,  }, // Razorpay order_id
  razorpayPaymentId: { type: String }, // Razorpay payment_id (added on verification)
  razorpaySignature: { type: String }, // Razorpay signature (added on verification)
  paymentStatus: { type: String, default: "Pending" }, // Pending, Success, or Failed

},{timestamps : true});

// Custom validation to ensure at least one of consumerNumber, LPGID, or mobile is provided
BookingSchema.pre("save", function (next) {
  const { consumerNumber, LPGID, mobile } = this.bookingDetails;
  if (!consumerNumber && !LPGID && !mobile) {
    const error = new Error("At least one of consumerNumber, LPGID, or mobile must be provided.");
    return next(error);
  }
  next();
});

export const Booking = mongoose.model("Booking", BookingSchema);
