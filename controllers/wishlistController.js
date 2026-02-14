const User = require('../models/User');
const Product = require('../models/Product');

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    user.wishlist.push(productId);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json({ message: 'Added to wishlist', wishlist: updatedUser.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json({ message: 'Removed from wishlist', wishlist: updatedUser.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.clearWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = [];
    await user.save();

    res.json({ message: 'Wishlist cleared', wishlist: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.syncWishlist = async (req, res) => {
  try {
    const { productIds } = req.body;
    const user = await User.findById(req.user._id);

    const validIds = productIds.filter(id => {
      return id && id.match(/^[0-9a-fA-F]{24}$/);
    });

    const existingIds = user.wishlist.map(id => id.toString());
    const newIds = validIds.filter(id => !existingIds.includes(id));

    if (newIds.length > 0) {
      user.wishlist.push(...newIds);
      await user.save();
    }

    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json({ wishlist: updatedUser.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
