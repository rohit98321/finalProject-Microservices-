const {body,validationResult}=require("express-validator")

const responseWithValidationsErrors=(req,res,next)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty){
        return res.status(400).json({errors:errors.array()})
    }

    next()
}

const registerUserValidations=[
    body("username")
    .isString()
    .withMessage("user must be a String")
    .isLength({min:3})
    .withMessage("must contain atleast 3 character"),

    body("email")
    .isEmail()
    .withMessage("invalid email id"),
    body("password")
    .isLength({min:6})
    .withMessage("password should be 6 charater atleast"),
    body("fullName.firstName")
    .isString()
    .withMessage("firstname must be a String")
    .notEmpty()
    .withMessage("firstname required"),
    body("fullName.lastName")
    .isString()
    .withMessage("lastname must be a String")
    .notEmpty()
    .withMessage("lastname required"),

    responseWithValidationsErrors

    
]

module.exports={
    registerUserValidations
}