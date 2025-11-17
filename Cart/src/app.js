const express =require("express")
const cartRouter =require("./routes/cart.routes")
const app=express()


app.use(express.json())
app.use("/api/cart",cartRouter)



module.exports=app;