import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import Razorpay from 'razorpay';
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import connectDB from './db/configDB.js';
import { router as authRoutes } from './routes/auth.routes.js';
import { router as bookingRoutes } from './routes/booking.routes.js';
import { router as razorpayRoutes } from './routes/razorpay.routes.js';
import { router as userRoutes } from './routes/user.routes.js';
import { verifyJWT } from './middlewares/authenticate.js';
import { getRefillLeft } from './controllers/getRefillLeft.controller.js';
import { router as getRefills } from "./routes/getRefills.js";
import { router as getBookings } from "./routes/getBookings.route.js";
import { router as messageroutes } from "./routes/messages.route.js";
import { router as PasswordResetRoutes } from "./routes/Password.Reset.routes.js";
import './cronJobs.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
connectDB()
const allowedOrigins = [
  "https://frontend-rb.onrender.com", // Production domain
  // "http://localhost:5173" // Localhost for development
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Array of methods instead of a single string

  credentials: true // Allow cookies
};
app.use(cookieParser());

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Debugging: Log incoming requests
app.get('/', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Routes
app.use('/api', authRoutes);
app.use('/api', bookingRoutes);
app.use('/api', razorpayRoutes);
app.use("/api", userRoutes);
app.use('/api', getRefills);
app.use('/api', getBookings);
app.use('/api', messageroutes);
app.use('/api', PasswordResetRoutes);

// ✅ Secure API Route: Get Refill Left
app.get('/api/get-refill-left', verifyJWT, async (req, res, next) => {
  try {
    console.log('Hit /api/get-refill-left');
    await getRefillLeft(req, res, next);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Razorpay Payment Verification
app.post('/api/verify-payment', async (req, res) => {
  console.log('Hit /api/verify-payment');
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    // console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      console.log('✅ Payment Verified Successfully!');
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully!",
        paymentDetails: { paymentId: razorpay_payment_id, orderId: razorpay_order_id, signature: razorpay_signature },
      });
    } else {
      console.error('❌ Payment Verification Failed!');
      return res.status(400).json({ success: false, message: "Payment verification failed!" });
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ❌ Centralized Error Handling
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
