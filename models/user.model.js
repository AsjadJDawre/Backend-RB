import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
   role : {
    type : String,
    enum : ["user", "admin"],
    default : "user"
   },
   refreshToken : {
    type : String
   },
   username : {
    type : String,
    unique: true,
    lowercase: true,
    required: true

},
firstName: {
    type: String,
    required: true,
},
middleName: {
    type: String,
},
lastName: {
    type: String,
    required: true,
},
gender: {
    type: String,
    enum: ["Male", "Female", "Other"], // Gender options
    required: true,
},
address: {
    addressLine1: {
        type: String,
        required: true,
    },
    addressLine2: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
},
mobile: {
    type: String,
    required: true,
},
ConsumerId: {
    type: String,
    unique: true,
    required: true
},
Total_Refill: {
    type: Number,
    default: 12,
},
RefillsQuotaLeft: {
    type: Number,
    default: 12,
    min: [0, "RefillsQuotaLeft cannot be negative"],


},
Distributor:{
    type: String,
    required: true
}
},{timestamps : true})

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
    
}

userSchema.methods.generateAccessToken=function (){
    return jwt.sign({
         _id:this._id,
         email:this.email,
         fullName:this.firstName+" "+this.middleName+" "+this.lastName,
         address:this.address,
         Total_Refill: this.Total_Refill,
         RefillsQuotaLeft: this.RefillsQuotaLeft
     },process.env.ACCESS_TOKEN_SECRET,
     {
         expiresIn:process.env.ACCESS_TOKEN_EXPIRY
     })
 }
 userSchema.methods.generateRefreshToken=function (){
     return jwt.sign({
         _id:this._id,
            },process.env.REFRESH_TOKEN_SECRET,
     {
         expiresIn:process.env.REFRESH_TOKEN_EXPIRY
     })
 }
 
export const User = mongoose.model("User", userSchema);