const mongoose = require("mongoose");

const connectDb = () => {

    
 
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
            console.log("database connected successfully");
    }).catch((error)=>{
        console.log("database not connect yet");
    })
   
  
};

module.exports=connectDb;
