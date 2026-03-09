# Mealio Backend

Backend API for Mealio - a food ordering platform where users can browse foods, add items to cart, place orders, and pay through Stripe.

## Tech Stack

- **Framework:** NestJS
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (Access + Refresh Token)
- **Image Upload:** Cloudinary
- **Payment:** Stripe

## Project Structure

```
src/
├── common/          # Guards, interfaces, shared utilities
├── config/          # App, database, cloudinary configs
├── database/        # MongoDB connection module
├── modules/
│   ├── auth/        # Login, register, refresh token, logout
│   ├── users/       # User profile, admin management
│   ├── foods/       # Food CRUD (admin), food listing
│   ├── cart/        # Add/remove items, get cart
│   └── orders/      # Place order, payment, order history
```

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Stripe account

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your values in .env
```

### Running

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/logout` - Logout

### Users
- `GET /users/profile` - Get current user profile
- `PATCH /users/update-profile` - Update profile

### Foods
- `POST /foods` - Add food (admin)
- `GET /foods` - List all foods
- `PATCH /foods/:id` - Update food (admin)
- `DELETE /foods/:id` - Delete food (admin)

### Cart
- `POST /cart/add` - Add item to cart
- `DELETE /cart/remove/:foodId` - Remove item from cart
- `GET /cart` - Get current cart

### Orders
- `POST /orders/placeOrder` - Place order
- `POST /orders/verifyOrder` - Verify payment
- `GET /orders/userOrders` - Get user orders
- `GET /orders/listOrders` - List all orders (admin)
- `PATCH /orders/updateStatus` - Update order status (admin)
