const express=require("express")
const router=express.Router();
const authController=require("../Controllers/auth.controller")
const validators=require("../Middleware/validator.middleware")



router.post("/register",validators.registerUserValidations,authController.registerUser)


module.exports=router