const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      subCategory,
      brand, 
      minPrice, 
      maxPrice, 
      search, 
      sort,
      rating,
      sizes,
      colors,
      availability,
      material,
      shop,
      exclusiveOnly,
      productType,
      secondtype,
      thirdtype
    } = req.query;
    
    const query = {};
    const andConditions = [];
    
    // Category filter
    if (category) {
      query.category = category.includes(',') 
        ? { $in: category.split(',').map(c => new RegExp(`^${c.trim()}$`, 'i')) }
        : { $regex: new RegExp(`^${category}$`, 'i') };
    }
    
    // SubCategory filter
    if (subCategory) {
      query.subCategory = subCategory.includes(',') 
        ? { $in: subCategory.split(',').map(c => new RegExp(`^${c.trim()}$`, 'i')) }
        : { $regex: new RegExp(`^${subCategory}$`, 'i') };
    }
    
    // ProductType filter
    if (productType) {
      const trimmedType = productType.trim();
      query.productType = trimmedType.includes(',') 
        ? { $in: trimmedType.split(',').map(p => new RegExp(`^\\s*${p.trim()}\\s*$`, 'i')) }
        : { $regex: new RegExp(`^\\s*${trimmedType}\\s*$`, 'i') };
    }
    
    // SecondType filter
    if (secondtype) {
      const trimmedType = secondtype.trim();
      query.secondtype = trimmedType.includes(',') 
        ? { $in: trimmedType.split(',').map(p => new RegExp(`^\\s*${p.trim()}\\s*$`, 'i')) }
        : { $regex: new RegExp(`^\\s*${trimmedType}\\s*$`, 'i') };
    }
    
    // ThirdType filter
    if (thirdtype) {
      const trimmedType = thirdtype.trim();
      query.thirdtype = trimmedType.includes(',') 
        ? { $in: trimmedType.split(',').map(p => new RegExp(`^\\s*${p.trim()}\\s*$`, 'i')) }
        : { $regex: new RegExp(`^\\s*${trimmedType}\\s*$`, 'i') };
    }
    
    // Brand filter
    if (brand) {
      query.brand = brand.includes(',') 
        ? { $in: brand.split(',').map(b => new RegExp(`^${b.trim()}$`, 'i')) }
        : { $regex: new RegExp(`^${brand}$`, 'i') };
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.finalPrice = {};
      if (minPrice) query.finalPrice.$gte = Number(minPrice);
      if (maxPrice) query.finalPrice.$lte = Number(maxPrice);
    }
    
    // Rating filter
    if (rating) {
      const ratings = rating.split(',').map(r => Number(r));
      andConditions.push({
        $or: ratings.map(r => ({
          averageRating: { $gte: r, $lt: r + 1 }
        }))
      });
    }
    
    // Size filter
    if (sizes) {
      const sizeArray = sizes.split(',').map(s => s.trim());
      query.sizes = { $in: sizeArray };
    }
    
    // Color filter
    if (colors) {
      const colorArray = colors.split(',').map(c => c.trim());
      query['colors.name'] = { $in: colorArray.map(c => new RegExp(c, 'i')) };
    }
    
    // Availability filter
    if (availability) {
      const availabilityArray = availability.split(',');
      query.availability = { $in: availabilityArray };
    }
    
    // Material filter
    if (material) {
      const materialArray = material.split(',');
      query.material = { $in: materialArray.map(m => new RegExp(m, 'i')) };
    }
    
    // Shop filter
    if (shop) {
      const shopArray = shop.split(',');
      query.shop = { $in: shopArray.map(s => new RegExp(s, 'i')) };
    }
    
    // Exclusive products filter
    if (exclusiveOnly === 'true') {
      query.isExclusive = true;
    }
    
    // Search filter
    if (search) {
      const searchTerm = search.trim();
      const searchRegex = new RegExp(searchTerm, 'i');
      andConditions.push({
        $or: [
          { name: searchRegex },
          { nameAr: searchRegex },
          { description: searchRegex },
          { descriptionAr: searchRegex },
          { shortDescription: searchRegex },
          { shortDescriptionAr: searchRegex },
          { tags: searchRegex },
          { tagsAr: searchRegex },
          { category: searchRegex },
          { categoryAr: searchRegex },
          { brand: searchRegex },
          { brandAr: searchRegex },
          { sku: searchRegex }
        ]
      });
    }
    
    // Combine all conditions
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    // Sort options
    const sortOptions = {};
    switch (sort) {
      case 'price_asc':
        sortOptions.finalPrice = 1;
        break;
      case 'price_desc':
        sortOptions.finalPrice = -1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      case 'rating':
        sortOptions.averageRating = -1;
        break;
      case 'popular':
        sortOptions.totalReviews = -1;
        break;
      case 'name':
        sortOptions.name = 1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.json({ 
      success: true, 
      data: products, 
      totalPages: Math.ceil(count / limit), 
      currentPage: Number(page),
      totalProducts: count,
      hasNextPage: page < Math.ceil(count / limit),
      hasPrevPage: page > 1
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product;
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get filter options dynamically from database
exports.getFilterOptions = async (req, res) => {
  try {
    const [categories, brands, sizes, colors, materials, shops, productTypes, secondTypes, secondTypesAr, thirdTypes, thirdTypesAr] = await Promise.all([
      Product.distinct('category'),
      Product.distinct('brand'),
      Product.distinct('sizes'),
      Product.distinct('colors.name'),
      Product.distinct('material'),
      Product.distinct('shop'),
      Product.distinct('productType'),
      Product.distinct('secondtype'),
      Product.distinct('secondtypeAr'),
      Product.distinct('thirdtype'),
      Product.distinct('thirdtypeAr')
    ]);

    // Get price range
    const priceRange = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$finalPrice' },
          maxPrice: { $max: '$finalPrice' }
        }
      }
    ]);

    // Get availability options
    const availabilityOptions = ['in_stock', 'out_of_stock', 'pre_order'];

    res.json({
      success: true,
      data: {
        categories: categories.filter(Boolean).sort(),
        brands: brands.filter(Boolean).sort(),
        sizes: sizes.flat().filter(Boolean).sort(),
        colors: colors.filter(Boolean).sort(),
        materials: materials.filter(Boolean).sort(),
        shops: shops.filter(Boolean).sort(),
        productTypes: productTypes.filter(Boolean).sort(),
        secondTypes: secondTypes.filter(Boolean).sort(),
        secondTypesAr: secondTypesAr.filter(Boolean).sort(),
        thirdTypes: thirdTypes.filter(Boolean).sort(),
        thirdTypesAr: thirdTypesAr.filter(Boolean).sort(),
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 1000 },
        availability: availabilityOptions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.userId', 'name');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const approvedReviews = product.reviews.filter(review => review.approved);
    const reviewsWithUser = approvedReviews.map(review => ({
      ...review.toObject(),
      user: review.userId || { name: 'Anonymous' }
    }));
    res.json({ success: true, data: reviewsWithUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addRating = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Validate rating
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check for existing review
    const existingReview = product.reviews.find(r => r.userId.toString() === req.user._id.toString());
    
    // Sanitize and trim comment
    const sanitizedComment = comment ? comment.trim().substring(0, 500) : '';
    
    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = sanitizedComment;
      existingReview.approved = false;
      existingReview.createdAt = new Date();
    } else {
      // Add new review
      product.reviews.push({ userId: req.user._id, rating, comment: sanitizedComment, approved: false, createdAt: new Date() });
    }
    
    await product.save();
    
    res.json({ success: true, message: existingReview ? 'Review updated and pending approval' : 'Review submitted and pending approval' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.approved = true;
    const approvedReviews = product.reviews.filter(r => r.approved);
    product.totalReviews = approvedReviews.length;
    product.averageRating = approvedReviews.length > 0 
      ? approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length 
      : 0;
    await product.save();
    
    res.json({ success: true, message: 'Review approved', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search products with suggestions
exports.searchProducts = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json({ success: true, data: [] });
    }

    const searchTerm = q.trim();
    const searchRegex = new RegExp(searchTerm, 'i');
    
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { nameAr: searchRegex },
        { description: searchRegex },
        { descriptionAr: searchRegex },
        { shortDescription: searchRegex },
        { shortDescriptionAr: searchRegex },
        { tags: searchRegex },
        { tagsAr: searchRegex },
        { category: searchRegex },
        { categoryAr: searchRegex },
        { brand: searchRegex },
        { brandAr: searchRegex },
        { sku: searchRegex }
      ]
    })
    .select('name nameAr mainImage finalPrice category categoryAr brand brandAr slug')
    .limit(Number(limit));

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
