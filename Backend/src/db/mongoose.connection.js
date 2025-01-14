import mongoose from "mongoose";

const mongodbUrl=process.env.MONGODB_URL;
const mongodbName=process.env.MONGODB_NAME;


const connectDb = async()=>{
    console.log("connecting to db", mongodbUrl)
    try{
        const connect = await mongoose.connect(`${mongodbUrl}/${mongodbName}`); 
        console.log("database connected successfully");
       
    }
    catch(error){
        console.log("error in connecting to db", error.message)
    }
}

export default connectDb;

