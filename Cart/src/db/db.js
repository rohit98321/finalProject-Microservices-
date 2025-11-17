const mongoose=require("mongoose")


const connectDb=()=>{
    try {
        mongoose.connect(process.env.MONGODB_URL)
        console.log("cart database connected sucessfully");
    } catch (error) {
        console.log(error);
    }
}

module.exports=connectDb;