const express = require("express");
const multer = require("multer");
const createAuthMiddleware = require("../middleware/auth.middleware");
const productController = require("../Controllers/product.controller");
const { createProductValidators } = require("../validator/product.validators");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  createAuthMiddleware(["admin", "seller","user"]),
  upload.array("images", 3),
  createProductValidators,
  productController.createProduct
);

module.exports = router;
