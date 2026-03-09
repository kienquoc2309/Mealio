# Project Overview

This project is a food ordering platform where users can browse foods, add items to a cart, place orders, and pay through supported payment providers.

Tech stack:

- Backend: NestJS
- Frontend: Vue.js
- Database: MongoDB
  The backend follows a modular architecture and is designed to be easily maintainable and scalable.

---

# Important Documentation

Backend architecture and database design are documented here:

- backend/docs/database.md
- backend/docs/api-spec.md

Agents must follow the schema and rules defined in this document when generating backend code.

## Database Overview

MongoDB collections used in this project:

users
refreshTokens
categories
foods
orders

Cart data is stored inside `users.cart`.

No separate cart collection exists.

## Backend Architecture

The backend is built using **NestJS** and follows a modular architecture.

The system is divided into the following modules.

### Auth Module

Handles authentication and authorization.

Responsibilities:

- User registration
- User login
- Access token generation
- Refresh token handling
- Logout

Routes (high level):

```
POST /auth/login
POST /auth/register
POST /auth/refresh-token
POST /auth/logout
```

---

### Users Module

Handles user profile and administrative user management.

Responsibilities:

- Get current user profile
- Update user profile
- Admin management of users

Admin-only actions:

- Update user information
- Change user password
- Change user role

Routes (high level):

```
GET /users/profile
PATCH /users/update-profile
PATCH /users/:id (admin)
```

---

### Foods Module

Handles food menu management.

Responsibilities:

- Add new food items
- List available foods
- Update food information
- Remove food items

Admin-only actions:

- Add food
- Update food
- Remove food

Routes (high level):

```
POST /foods
GET /foods
PATCH /foods/:id
DELETE /foods/:id
```

---

### Cart Module

Handles the user shopping cart.

Important note:

Cart data is stored inside the `users.cart` field in the database.

Responsibilities:

- Add food items to cart
- Remove food items from cart
- Get current cart

Routes (high level):

```
POST /cart/add
DELETE /cart/remove/:foodId
GET /cart
```

---

### Orders Module

Handles order creation and order lifecycle.

Responsibilities:

- Place order
- Generate payment link
- Verify payment result
- Get user order history
- Admin list all orders
- Admin update order status

Admin-only actions:

- List all orders
- Update order status

Routes (high level):

```
POST /orders/placeOrder
POST /orders/verifyOrder
GET /orders/userOrders
GET /orders/listOrders (admin)
PATCH /orders/updateStatus (admin)
```

---

### Payments Module

Handles payment provider integrations.

Currently supported:

- Stripe

Planned future providers:

- VNPay
- MoMo

Responsibilities:

- Generate payment sessions
- Verify payment transactions
- Handle payment gateway callbacks or webhooks
- Update order payment status

The payment module works closely with the Orders module to update:

```
orders.paymentStatus
orders.transactionId
```

---

# Route Naming Convention

Routes should follow REST-style naming conventions.

Examples:

POST /auth/login  
GET /users/profile  
POST /foods  
GET /foods  
PATCH /foods/:id  
DELETE /foods/:id

Avoid inconsistent route naming styles.

---

# Order Data Rules

Orders must snapshot food data at the time of order creation.

Each order item must include:

foodId  
name  
price  
image  
quantity

This ensures that order history remains consistent even if food data changes later.

---

# Order Flow

Typical order workflow:

User login  
↓  
Browse foods  
↓  
Add foods to cart  
↓  
Place order  
↓  
Generate payment link  
↓  
Payment verification  
↓  
Order processing  
↓  
Delivery

---

### General Backend Rules

1. All protected routes require authentication.
2. Admin routes require the `admin` role.
3. Orders must snapshot food data at the time of order creation.
4. The cart must be cleared after a successful order creation.
5. Payment status must always be stored inside the order document.

### Development Guidelines for AI Agents

When generating backend code:

- Follow the database schema exactly as defined.
- Do not introduce new collections without explicit instruction.
- Always use ObjectId for relations between collections.
- Admin routes must check the `admin` role.
- Cart logic must always read and update users.cart
- Order creation must snapshot food data and then clear the cart
- Payment verification must update orders.paymentStatus and orders.transactionId

# API Design Status

The routes listed in this file represent the current architectural intention.

The detailed request and response schemas will be defined later in:

backend/docs/api-spec.md
