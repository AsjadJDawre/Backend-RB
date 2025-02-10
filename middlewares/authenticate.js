import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async (req, res, next) => {

try {
    console.log("i am in authenticate jwt")
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    console.log(token)
    if (!token) {
        console.log(401, "Unauthorized: No token provided");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    
    
    const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
    const user = await User.findById(decoded._id).select("-password -refreshToken")
    
    if (!user) {
        console.log(401, "Unauthorized: Invalid token");
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.userdetails =
    {
        id : decoded._id,
        email : decoded.email,
        fullName : decoded.fullName,
        address :decoded.address,
        TotalRefills:decoded.Total_Refill,
        RefillsLeft:decoded.RefillsQuotaLeft
    }
    req.userId = decoded._id;
    req.user = user;
    console.log("User authenticated:", req.userdetails);
    next();
} catch (error) {
console.log(401, "Unauthorized: Invalid token");
return res.status(401).json({ message: error?.message || "Unauthorized: Invalid token" });}
});