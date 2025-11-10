const express = require("express");
const multer = require("multer");
const createAuthMiddleware = require("../middleware/auth.middleware");
const productController = require("../Controllers/product.controller");
const { createProductValidators } = require("../validator/product.validators");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

//POST
router.post(
  "/",
  createAuthMiddleware(["admin", "seller"]),
  upload.array("images", 3),
  createProductValidators,
  productController.createProduct
);


//PATCH
router.patch(
  "/updateproducts/:id",
  createAuthMiddleware(["seller"]),
  productController.updateProduct
);

//DELETE
router.delete(
  "/deleteproducts/:id",
  createAuthMiddleware(["seller"]),
  productController.deleteProduct
)

router.get("/sellerproducts",
createAuthMiddleware(['seller']),
productController.getProductBySeller);


//GET
router.get("/getproducts",productController.getProducts)
router.get("/getproducts/:id",productController.getProductById);

module.exports = router;
