import mongoose from "mongoose";
export default async function connectDb(){

    try {
       await mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("db connected");
       })

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error(error)
        
    }


}