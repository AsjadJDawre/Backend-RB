import { User } from "../models/user.model.js"

const getRefills = async (req, res, next) => {
    try {
        console.log("I am in Get refills ")
        const userID = req.userdetails.id
        User.findById(userID).then((user) => {
            req.userdetails.Total_Refill = user.Total_Refill
        })
        console.log('from get refills',req.userdetails)
        next();
    } catch (error) {
        console.log(error);
}
}

export {getRefills}