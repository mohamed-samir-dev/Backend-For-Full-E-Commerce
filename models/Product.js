const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  nameAr: { type: String, required: true },
  slug: { type: String, required: true, lowercase: true },
  shortDescription: { type: String, required: true },
  shortDescriptionAr: { type: String, required: true },
  description: { type: String, required: true },
  descriptionAr: { type: String, required: true },
  basePrice: { type: Number, required: true, min: 0 },
  discount: {
    type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    value: { type: Number, default: 0, min: 0 }
  },
  finalPrice: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'EGP' },
  mainImage: { type: String, required: true },
  imageGallery: [String],
  video: String,
  stock: { type: Number, required: true, min: 0, default: 0 },
  sku: { type: String, required: true },
  availability: { type: String, enum: ['in_stock', 'out_of_stock', 'pre_order'], default: 'in_stock' },
  category: { type: String, required: true },
  categoryAr: { type: String, required: true },
  subCategory: String,
  subCategoryAr: String,
  brand: { type: String, required: true },
  brandAr: { type: String, required: true },
  productType: { type: String },
  secondtype: { type: String },
  secondtypeAr: { type: String },
  thirdtype: { type: String },
  thirdtypeAr: { type: String },
  tags: [String],
  tagsAr: [String],
  sizes: [String],
  colors: [{ name: String, hex: String }],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  material: String,
  weight: String,
  dimensions: {
    length: String,
    width: String,
    height: String
  },
  warranty: String,
  returnPolicy: String,
  specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
  specificationsAr: { type: mongoose.Schema.Types.Mixed, default: {} },
  variants: [{ type: mongoose.Schema.Types.Mixed }],
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  shop: { type: String },
  isExclusive: { type: Boolean, default: false },
  toplay: { type: Boolean, default: false }
}, {
  timestamps: true
});

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ productType: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
