require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const dataFile = process.argv[2] || 'add.json';
const productData = JSON.parse(fs.readFileSync(path.join(__dirname, dataFile), 'utf8'));

const addProduct = async () => {
  try {
    await connectDB();
    const products = (Array.isArray(productData) ? productData : [productData]).map(p => ({
      ...p,
      sku: p.sku || p.slug
    }));
    const result = await Product.insertMany(products, { ordered: false });
    console.log(`${result.length} product(s) added successfully`);
    if (result.length === 0) console.log('No products inserted - possible duplicate slugs or skus');
    process.exit(0);
  } catch (error) {
    console.error('Error adding product:', error.message);
    if (error.writeErrors) {
      error.writeErrors.forEach(e => console.error('Write error:', e.errmsg || e.err?.errmsg));
    }
    process.exit(1);
  }
};

addProduct();
