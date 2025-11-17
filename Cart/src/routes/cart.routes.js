const express=require("express")
const createAuthMiddleware =require("../middleware/auth.middleware")
const cartController =require("../controller/cart.controller")
const validator = require("../middleware/validator.middleware")
const router =express.Router();




router.get('/',
    createAuthMiddleware([ 'user' ]),
    cartController.getCart
);


router.post("/items",
validator.validateAddItemToCart,
    createAuthMiddleware([ "user" ]),
    cartController.addItemToCart
)


router.patch(
    '/items/:productId',
    validator.validateUpdateCartItem,
    createAuthMiddleware([ 'user' ]),
    cartController.updateItemQuantity
);






module.exports=router;