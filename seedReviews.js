require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const CustomerSay = require('./models/CustomerSay');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const dataFile = process.argv[2] || 'seeds/customer-says.json';
const reviewsData = JSON.parse(fs.readFileSync(path.join(__dirname, dataFile), 'utf8'));

const seedReviews = async () => {
  await connectDB();

  let inserted = 0;
  for (const review of reviewsData) {
    try {
      await CustomerSay.create(review);
      console.log(`✅ Added: ${review.name}`);
      inserted++;
    } catch (err) {
      console.error(`❌ Skipped: ${review.name} — ${err.message}`);
    }
  }
  console.log(`\n${inserted}/${reviewsData.length} review(s) added successfully`);
  process.exit(0);
};

seedReviews();
