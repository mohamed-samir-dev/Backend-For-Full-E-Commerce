const CustomerSay = require('../models/CustomerSay');

exports.createCustomerSay = async (req, res) => {
  try {
    const { name, email, rating, comment } = req.body;

    // Validate rating
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5' });
    }

    // Check for existing testimonial by email
    const existingTestimonial = await CustomerSay.findOne({ email: email.toLowerCase().trim() });
    
    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedComment = comment ? comment.trim().substring(0, 500) : '';

    if (existingTestimonial) {
      // Update existing testimonial
      existingTestimonial.name = sanitizedName;
      existingTestimonial.rating = rating;
      existingTestimonial.comment = sanitizedComment;
      existingTestimonial.isApproved = false;
      await existingTestimonial.save();

      return res.status(200).json({
        success: true,
        message: 'Testimonial updated and pending approval',
        data: existingTestimonial
      });
    }

    // Create new testimonial
    const customerSay = await CustomerSay.create({
      name: sanitizedName,
      email: sanitizedEmail,
      rating,
      comment: sanitizedComment
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully',
      data: customerSay
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getApprovedCustomerSays = async (req, res) => {
  try {
    const customerSays = await CustomerSay.find({ isApproved: true })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: customerSays.length,
      data: customerSays
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllCustomerSays = async (req, res) => {
  try {
    const customerSays = await CustomerSay.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: customerSays.length,
      data: customerSays
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const customerSay = await CustomerSay.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true, runValidators: true }
    );

    if (!customerSay) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customerSay
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteCustomerSay = async (req, res) => {
  try {
    const { id } = req.params;

    const customerSay = await CustomerSay.findByIdAndDelete(id);

    if (!customerSay) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
