const productModel = require("../models/product.model");
const { uploadImage } = require("../services/imagekit.service");

const mongoose = require("mongoose");

const createProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: missing user" });
    }

    const { title, description, priceAmount, priceCurrency = "INR" } = req.body;
    if (!title || !description || !priceAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const seller = req.user.id;
    const price = {
      amount: Number(priceAmount),
      currency: priceCurrency,
    };

    const images = await Promise.all(
      (req.files || []).map((file) => uploadImage({ buffer: file.buffer }))
    );

    const product = await productModel.create({
      title,
      description,
      price,
      seller,
      images,
    });

    // Mock or remove during test

    return res.status(201).json({
      message: "Product created",
      data: product,
    });
  } catch (err) {
    console.error("Create product error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProducts = async (req, res) => {
  const { q, minprice, maxprice, skip = 0, limit = 20 } = req.query;

  const filter = {};

  if (q) {
    filter.$text = { $search: q };
  }

  if (minprice) {
    filter["price.amount"] = {
      ...filter["price.amount"],
      $gte: Number(minprice),
    };
  }

  if (maxprice) {
    filter["price.amount"] = {
      ...filter["price.amount"],
      $lte: Number(maxprice),
    };
  }

  const products = await productModel
    .find(filter)
    .skip(Number(skip))
    .limit(Math.min(Number(limit), 20));

  return res.status(200).json({ data: products });
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }
  const product = await productModel.findById(id);
  console.log(product);

  if (!product) {
    return res.status(404).json({
      message: "product not found",
    });
  }

  try {
    res.status(200).json({
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error,
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const product = await productModel.findOne({
    _id: id,
  });

  if (!product) {
    return res.status(404).json({
      message: "product not found",
    });
  }

  if(product.seller.toString() !== req.user.id){
    return  res.status(403).json({ message: "Forbidden: You can only update your own products" });
  }

  const allowedUpdates = ["title", "description", "price"];
  for (const key of Object.keys(req.body)) {
    if (allowedUpdates.includes(key)) {
      if (key === 'price' && typeof req.body.price === 'object') {
        if (req.body.price.amount !== undefined) {
          product.price.amount = Number(req.body.price.amount);
        }
        if (req.body.price.currency !== undefined) {
          product.price.currency = req.body.price.currency;
        }
      } else {
        product[key] = req.body[key];
      }
    }
  }


  await product.save();
  return res.status(200).json({ data: product });
};

const deleteProduct = async (req, res)=>{
  const {id} =req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const product = await productModel.findOne({
    _id: id,
  });
  if (!product) {
    return res.status(404).json({
      message: "product not found",
    });
  }

  if(product.seller.toString() !== req.user.id){
    return  res.status(403).json({ message: "Forbidden: You can only delete your own products" });
  }

  await productModel.deleteOne({_id:id});

  res.status(200).json({message:"Product deleted successfully"});

}

const getProductBySeller =async (req,res)=>{
    const seller=req.user;
    const {skip =0, limit =20}=req.query;
    const products = await productModel.find({seller : seller.id}).skip(skip).limit(Math.min(limit,20)); 

    return res.status(200).json({data:products});
}
module.exports = { createProduct, getProducts, getProductById,updateProduct,deleteProduct,getProductBySeller};
