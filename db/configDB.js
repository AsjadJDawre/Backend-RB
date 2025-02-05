import mongoose from "mongoose";
const connectDB= async ()=>{
    try {
      const connectionInstance=  await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
      console.log(`\n MOngoDB connected !! DB HOST : ${connectionInstance.connection.host}`); 
        
    } catch (error) {
        console.log("MONGODB connection ERROR ::",error);
        process.exit(1)
    }
}



export default connectDB;