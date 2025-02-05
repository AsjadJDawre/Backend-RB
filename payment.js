import Razorpay from "razorpay";
import dotenv from "dotenv"
import express from "express"
import { Router } from "express";
import crypto from "crypto"
import { ApiError } from "./utils/ApiError";
dotenv.config()
const razorpayInstance = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

const router =  Router()

router.post('/order',async(req,res)=>{  
    const {amount} = req.body
try {
    const options = {
        amount: Number(amount),
        currency: "INR",
        receipt: crypto.randomBytes(10).toString("hex")
    };
    const order = await razorpayInstance.orders.create(options,(err,order)=>{
        if(err){
            console.log(err);
            throw new ApiError(500,err)
        }
        return res.status(200).json({data:order})
    })
    }

catch (error) {
    console.log(error);
    throw new ApiError(500,error)
}

})
