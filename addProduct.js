require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const productData = JSON.parse(fs.readFileSync(path.join(__dirname, 'add.json'), 'utf8'));

const addProduct = async () => {
  try {
    await connectDB();
    const products = Array.isArray(productData) ? productData : [productData];
    const result = await Product.insertMany(products);
    console.log(`${result.length} product(s) added successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Error adding product:', error.message);
    process.exit(1);
  }
};

addProduct();
