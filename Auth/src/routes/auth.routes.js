const express=require("express")
const router=express.Router();
const authController=require("../Controllers/auth.controller")
const {authmiddlewareNext} =require("../Middleware/auth.middleware")
const validators=require("../Middleware/validator.middleware")



router.post("/register",validators.registerUserValidations,authController.registerUser)

router.post("/login",validators.loginUserValidations,authController.loginUser)
router.get("/logout",authController.logoutUser)

router.get("/me",authmiddlewareNext,authController.getCurrentUser)


router.get("/users/me/addresses",authmiddlewareNext,authController.getUserAddresses)

router.post('/users/me/addresses',authmiddlewareNext,validators.addUserAddressValidator,authController.addUserAddress);

router.delete('/users/me/addresses/:addressId',authmiddlewareNext,authController.deleteUserAddress)

module.exports=router   