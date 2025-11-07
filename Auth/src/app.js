const express=require("express")
const authRouter=require("./routes/auth.routes")
const cookieparser=require("cookie-parser")
const app=express();
app.use(cookieparser())
app.use(express.json())


app.use("/auth",authRouter)

module.exports=app