const productModel = require('../models/product.model');
const { uploadImage } = require('../services/imagekit.service');
const mongoose = require('mongoose');

async function createProduct(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: missing user' });
    }

    const { title, description, priceAmount, priceCurrency = 'INR' } = req.body;
    if (!title || !description || !priceAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const seller = req.user.id;
    const price = {
      amount: Number(priceAmount),
      currency: priceCurrency,
    };

    const images = await Promise.all((req.files || []).map(file => uploadImage({ buffer: file.buffer })));

    const product = await productModel.create({ title, description, price, seller, images });

    // Mock or remove during test
   

    return res.status(201).json({
      message: 'Product created',
      data: product,
    });
  } catch (err) {
    console.error('Create product error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { createProduct };
