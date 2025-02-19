import mongoose from "mongoose";

const PayementSchema = new mongoose.Schema({
    razorpay_order_id : {
        type : String,
        required : true
    },
razorpay_payment_id : {
    type : String,
    required : true
},
razorpay_signature : {
    type : String,
    required : true
},
amount : {
    type : Number,
    required : true
},


},{
    timestamps : true})

    export const Payment = mongoose.model("Payment", PayementSchema);