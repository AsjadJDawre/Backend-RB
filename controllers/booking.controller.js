import { asyncHandler } from "../utils/asyncHandler.js";
import { Booking } from "../models/booking.model.js";
import { createOrder } from "../controllers/razorpay.controller.js"; // Importing the Razorpay createOrder controller
import { User } from "../models/user.model.js";
export const createBooking = asyncHandler(async (req, res, next) => {
  const { bookingDetails, refills, amount,razorpayOrderId,razorpayPaymentId ,razorpay_Signature, payLater} = req.body;
  const userdetails = req.userdetails;


console.log("I am in booking create",bookingDetails,refills,amount,razorpayOrderId,razorpayPaymentId,"this is sign",razorpay_Signature,"this is userdetails:",userdetails)



try {
  console.log("I am checking for refills left")
  const user = await User.findById(userdetails.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.RefillsQuotaLeft === 0) {
    return res.status(400).json({ message: "No Refills Left" });
  }

} catch (error) {
  console.log("Error checking refills:", error);
     return res.status(500).json({ message: "Server error" });

}



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


  if(payLater){
    console.log('The Payment option selected is :',payLater)
    const bookingData = {
      amount: amount,
      bookingType: bookingType,
      totalRefill: refills,
      consumerNumber: optionType === "Consumer Number" ? inputValue : undefined,
      LPGID: optionType === "LPGID" ? inputValue : undefined,
      mobile: optionType === "Mobile Number" ? inputValue : undefined,
    };
  
    // Create a new booking document
    const newBookingData = {
      applicantId: id,
      applicantName: fullName,
      bookingDetails: bookingData,
      address: address,
      paymentStatus: payLater ? "Pending" : "Paid",  // Check if payLater is true
    };
  // Create a new booking document
  const newBooking = new Booking(newBookingData);

  const userUpdate = await User.findOneAndUpdate(
    { _id: id },
    { $inc: { RefillsQuotaLeft: -refills } },
    { new: true } // Ensures it returns the updated document
  );
  

  // Save booking to database
  console.log("Saving application to database...");
  const savedBooking = await newBooking.save();
  console.log("This is the saved booking document", savedBooking);

const data =    { applicationId: savedBooking._id,
paymentStatus: savedBooking.paymentStatus,   QuotaLeftAfterUpdate: userUpdate?.RefillsQuotaLeft || "Not Updated",
}


res.status(200).json({ message: "Booking for refills created successfully.",data})  
next();
return


}




  


  // Create a new booking document
  const newBooking = new Booking({
    applicantId: id,
    applicantName: fullName,
    bookingDetails: bookingData,
    address: address,
    razorpayOrderId: razorpayOrderId,
    razorpayPaymentId: razorpayPaymentId,
    razorpaySignature: razorpay_Signature,
    paymentStatus: "Paid",
  });

  // Save booking to database
  console.log("Saving application to database...");
  const savedBooking = await newBooking.save();
  console.log("This is the saved booking document",savedBooking)
  const userUpdate = await User.findOneAndUpdate(
    { _id: id },
    { $inc: { RefillsQuotaLeft: -refills } },
    { new: true } // Ensures it returns the updated document
  );
  
  // // Create Razorpay Order after booking is created
  // const { amount: orderAmount, _id: bookingId } = savedBooking;
  // try {
  //   const razorpayOrderResponse = await createOrder({ amount: orderAmount });

  //   // Update booking with Razorpay orderId
  //   savedBooking.razorpayOrderId = razorpayOrderResponse.order.id;
  //   await savedBooking.save();

  //   console.log("Razorpay order created and linked to booking.");

    res.status(201).json({
      message: "Booking for refills created successfully.",
      applicationId: savedBooking._id,
      razorpayOrderId: razorpayOrderId,
      QuotaLeftAfterUpdate: userUpdate?.RefillsQuotaLeft || "Not Updated"
    });
  // } 

  next();
});
