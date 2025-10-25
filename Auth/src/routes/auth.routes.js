const express=require("express")
const router=express.Router();
const authController=require("../Controllers/auth.controller")
const authmiddleware =require("../Middleware/auth.middleware")
const validators=require("../Middleware/validator.middleware")



router.post("/register",validators.registerUserValidations,authController.registerUser)

router.post("/login",validators.loginUserValidations,authController.loginUser)

router.get("/me",authmiddleware.authmiddlewareNext,authController.getCurrentUser)

router.get("/logout",authController.logoutUser)

router.get("/users/me/addresses",authmiddleware.authmiddlewareNext,authController.getUserAddresses)

router.post('/user/me/addresses',validators.addUserAddressValidator,authmiddleware.authmiddlewareNext,authController.getUserAddresses);

router.delete('/user/me/addresses/:addressId',authmiddleware.authmiddlewareNext,authController.deleteUserAddress)

module.exports=router