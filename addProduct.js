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
  await connectDB();
  const products = (Array.isArray(productData) ? productData : [productData]).map(p => ({
    ...p,
    sku: p.sku || p.slug,
    colors: (p.colors || []).map(c => typeof c === 'string' ? { name: c, hex: '' } : c)
  }));

  let inserted = 0;
  for (const product of products) {
    try {
      await Product.create(product);
      console.log(`✅ Added: ${product.slug}`);
      inserted++;
    } catch (err) {
      console.error(`❌ Skipped: ${product.slug} — ${err.message}`);
    }
  }
  console.log(`\n${inserted}/${products.length} product(s) added successfully`);
  process.exit(0);
};

addProduct();
