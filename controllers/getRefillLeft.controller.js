import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"

 const getRefillLeft = async (req, res ,next) => {
    try {
        const userDetails = req.userdetails
        console.log("I am in Get refills ")
        console.log(userDetails)
        console.log("Total Refils ",userDetails.totalRefills)
        req.TotalRefills =userDetails.totalRefills 


}

catch(error){
    console.log(error);
    

}

}


const GetQuota = asyncHandler(async (req, res, next) => {
console.log('I am in Get Quota')
const userID = req.userdetails.id
try {
    const user = await User.findById(userID).select("RefillsQuotaLeft");
    if (!user) {
      console.log("User not found");
    } else {
      console.log("RefillsQuotaLeft:", user.RefillsQuotaLeft);
      res.status(200).json({ success: true, RefillsQuotaLeft: user.RefillsQuotaLeft });
      next();
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: faslse, error: error.message, message: "Error fetching user" });
    next(  )

  }
  
});
export {getRefillLeft,GetQuota}