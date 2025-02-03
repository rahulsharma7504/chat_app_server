const dotenv=require('dotenv').config()

const mongoose =require('mongoose');

// Connect to MongoDB 
const ConnectDB=async()=>{
    try {
        mongoose.connect(process.env.DB_String);
        console.log("Database Connected")
        
    } catch (error) {
        if(error) throw new Error(error.message)
        
    }
}
module.exports={ConnectDB}