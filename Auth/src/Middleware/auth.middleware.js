const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authmiddlewareNext = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    
    const decode=jwt.verify(token,process.env.JWT_SECRET)
    const user=await userModel.findById(decode.id).select("-password")

    req.user=user;
    next()

  } catch (error) {

    return res.status(401).json({
        message:"unauthorized"
    })
    
  }



};

module.exports={
    authmiddlewareNext
}
