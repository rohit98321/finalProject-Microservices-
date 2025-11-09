const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        enum: ["USD", "INR"],
        default: "INR",
      },
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // optional but recommended
    },
    images: [
      {
        url: String,
        thumbnail: String,
        id: String,
      },
    ],
  },
  { timestamps: true }
);

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
