# 🛒 E-Commerce Backend API

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v4+-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

A robust and scalable REST API for a full-featured e-commerce platform built with Node.js, Express, and MongoDB. This backend provides comprehensive functionality for managing products, users, orders, and more.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Authentication](#-authentication)
- [Error Handling](#-error-handling)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Authentication & Authorization
- 🔐 JWT-based authentication
- 👥 Role-based access control (User/Admin)
- 🔒 Secure password hashing with bcrypt

### User Management
- 📝 User registration and login
- 👤 Profile management
- 📍 Multiple shipping addresses
- 🛒 Shopping cart functionality
- ❤️ Wishlist management

### Product Management
- 📦 CRUD operations for products
- 🔍 Advanced search and filtering
- 📄 Pagination support
- 🏷️ Category and brand organization
- ⭐ Product ratings and reviews
- 🎨 Product variants (size, color, etc.)
- 🏷️ Tag-based organization

### Order Management
- 🛍️ Order creation and tracking
- 📊 Order status management
- 💳 Multiple payment methods
- 📦 Shipping address management

### Additional Features
- 🎟️ Promo code system with validation
- 💬 Product reviews and ratings
- 🏢 Brand management
- 📂 Category hierarchy with subcategories

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Environment Variables**: dotenv

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables))

4. **Start MongoDB**

Make sure MongoDB is running on your system

5. **Run the application**

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT)

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/ecommerce

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Optional: For production
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce
```

> ⚠️ **Security Note**: Never commit your `.env` file to version control. Always use strong, unique values for `JWT_SECRET` in production.

## 📚 API Documentation

### Auth Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (Protected)
- `PUT /profile` - Update user profile (Protected)

### User Routes (`/api/users`)
- `POST /cart` - Add to cart (Protected)
- `DELETE /cart/:productId` - Remove from cart (Protected)
- `GET /cart` - Get cart (Protected)
- `POST /wishlist` - Add to wishlist (Protected)
- `DELETE /wishlist/:productId` - Remove from wishlist (Protected)
- `GET /wishlist` - Get wishlist (Protected)
- `POST /addresses` - Add address (Protected)
- `DELETE /addresses/:addressId` - Delete address (Protected)

### Product Routes (`/api/products`)
- `POST /` - Create product (Admin)
- `GET /` - Get all products (with filters, search, pagination)
- `GET /:id` - Get single product
- `PUT /:id` - Update product (Admin)
- `DELETE /:id` - Delete product (Admin)
- `POST /:id/ratings` - Add rating (Protected)

### Category Routes (`/api/categories`)
- `POST /` - Create category (Admin)
- `GET /` - Get all categories
- `GET /:id` - Get single category
- `PUT /:id` - Update category (Admin)
- `DELETE /:id` - Delete category (Admin)

### Order Routes (`/api/orders`)
- `POST /` - Create order (Protected)
- `GET /` - Get orders (Protected)
- `GET /:id` - Get single order (Protected)
- `PUT /:id/status` - Update order status (Admin)
- `DELETE /:id` - Delete order (Admin)

### Review Routes (`/api/reviews`)
- `POST /` - Create review (Protected)
- `GET /` - Get reviews
- `GET /:id` - Get single review
- `PUT /:id` - Update review (Protected)
- `DELETE /:id` - Delete review (Protected)

### Brand Routes (`/api/brands`)
- `POST /` - Create brand (Admin)
- `GET /` - Get all brands
- `GET /:id` - Get single brand
- `PUT /:id` - Update brand (Admin)
- `DELETE /:id` - Delete brand (Admin)

### PromoCode Routes (`/api/promocodes`)
- `POST /` - Create promo code (Admin)
- `GET /` - Get all promo codes (Admin)
- `GET /:id` - Get single promo code (Admin)
- `POST /validate` - Validate promo code (Protected)
- `POST /apply` - Apply promo code (Protected)
- `PUT /:id` - Update promo code (Admin)
- `DELETE /:id` - Delete promo code (Admin)

### Query Parameters for Products

| Parameter | Type | Description | Default |
|-----------|------|-------------|----------|
| `page` | Number | Page number | 1 |
| `limit` | Number | Items per page | 10 |
| `category` | String | Filter by category ID | - |
| `brand` | String | Filter by brand name | - |
| `minPrice` | Number | Minimum price filter | - |
| `maxPrice` | Number | Maximum price filter | - |
| `search` | String | Search in name, description, tags | - |
| `sort` | String | Sort order: `price_asc`, `price_desc`, `newest` | - |

**Example Request:**
```bash
GET /api/products?page=1&limit=20&category=electronics&minPrice=100&maxPrice=1000&sort=price_asc
```

## 📁 Project Structure

```
Backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/           # Route controllers
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── ...
├── models/               # Mongoose models
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── ...
├── routes/               # API routes
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   └── ...
├── middleware/           # Custom middleware
│   ├── auth.js
│   ├── errorHandler.js
│   └── ...
├── utils/                # Utility functions
├── .env                  # Environment variables
├── .gitignore
├── package.json
├── server.js             # Entry point
└── README.md
```

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication. After logging in or registering, you'll receive a token that must be included in subsequent requests.

### Getting a Token

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Using the Token

Include the token in the Authorization header for protected routes:

```bash
GET /api/auth/profile
Authorization: Bearer <your_jwt_token>
```

### Token Expiration

Tokens expire after the duration specified in `JWT_EXPIRE` (default: 7 days). Users will need to log in again after expiration.

## 📊 Data Models

### User
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (enum: 'user', 'admin')
- `wishlist`: Array of Product IDs
- `cart`: Array of cart items
- `addresses`: Array of shipping addresses
- `orders`: Array of Order IDs

### Product
- `name`: String (required)
- `slug`: String (unique)
- `description`: String
- `category`: ObjectId (ref: Category)
- `brand`: String
- `price`: Number (required)
- `discount`: Number
- `images`: Array of image URLs
- `stock`: Number
- `variants`: Array (size, color, etc.)
- `ratings`: Object (average, count)
- `tags`: Array of strings

### Category
- `name`: String (required)
- `slug`: String (unique)
- `description`: String
- `parentCategory`: ObjectId (ref: Category)

### Order
- `userId`: ObjectId (ref: User)
- `products`: Array of order items
- `status`: String (enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
- `shippingAddress`: Object
- `paymentMethod`: String
- `totalPrice`: Number

### Review
- `productId`: ObjectId (ref: Product)
- `userId`: ObjectId (ref: User)
- `rating`: Number (1-5)
- `comment`: String

### Brand
- `name`: String (required, unique)
- `logo`: String (URL)
- `description`: String

### PromoCode
- `code`: String (required, unique)
- `discount`: Number (percentage or fixed)
- `expiryDate`: Date
- `usageLimit`: Number
- `usedBy`: Array of User IDs

## ⚠️ Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing

You can test the API using tools like:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)

## 🚀 Deployment

### Recommended Platforms
- **Heroku**
- **AWS EC2**
- **DigitalOcean**
- **Railway**
- **Render**

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure MongoDB Atlas or production database
- [ ] Enable CORS for your frontend domain
- [ ] Set up proper logging
- [ ] Configure rate limiting
- [ ] Enable HTTPS
- [ ] Set up monitoring and error tracking

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Made with ❤️ for the e-commerce community**
