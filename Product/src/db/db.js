const mongoose =require("mongoose")


const connectDb=async ()=>{
    try {

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("product service db connected");
        
    } catch (error) {
        console.log("db connection failed");
    }
}

module.exports=connectDb