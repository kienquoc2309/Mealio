# Database Design

## Overview

This project uses **MongoDB** as the primary database.
The system is a **food ordering platform** where users can browse food, add items to cart, create orders, and pay using Stripe or VNPay.

The database is designed to remain **simple, scalable, and optimized for read-heavy operations**.

### Main Collections

The system contains **5 primary collections**:

- `users`
- `refreshTokens`
- `categories`
- `foods`
- `orders`

Relationships:

```
categories
   ↑
foods

users
   ↑
orders
```

Cart data is embedded inside the `users` collection.

---

# Users Collection

Stores all registered users and their cart data.

```ts
{
  _id: ObjectId

  name: string
  email: string
  password: string

  role: "user" | "admin"

  phone: string
  address: {
    street: string
    city: string
  }

  cart: [
    {
      foodId: ObjectId
      quantity: number
    }
  ]

  createdAt: Date
  updatedAt: Date
}
```

### Rules

- `email` must be **unique**
- `password` must be **hashed**
- `role` defaults to `"user"`
- `cart` contains temporary user order items

### Indexes

```
email (unique)
```

---

# RefreshTokens Collection

Stores refresh tokens used for authentication.

```ts
{
  _id: ObjectId;

  userId: ObjectId;

  token: string;

  expiresAt: Date;

  createdAt: Date;
}
```

### Rules

- One user may have multiple refresh tokens
- Tokens should be deleted when user logs out
- Tokens must expire automatically

### Recommended Indexes

```
token
userId
expiresAt
```

Optionally use **TTL index** on `expiresAt`.

---

# Categories Collection

Stores food categories.

Example:

- Pizza
- Drinks
- Dessert

```ts
{
  _id: ObjectId;

  name: string;
  icon: string;
  image: string;

  createdAt: Date;
}
```

### Notes

- `_id` is used as the primary reference.
- Do not create an additional `id` field.

---

# Foods Collection

Stores all available food items.

```ts
{
  _id: ObjectId;

  name: string;
  description: string;

  price: number;

  image: string;

  categoryId: ObjectId;

  isAvailable: boolean;

  rating: number;
  reviews: number;
  tag?: string;

  createdAt: Date;
  updatedAt: Date;
}
```

### Rules

- `categoryId` references `categories._id`
- `isAvailable` determines whether the food can be ordered
- `rating` stores the average rating (0–5), defaults to 0
- `reviews` stores the total number of reviews, defaults to 0
- `tag` is an optional label (e.g. "Best Seller", "Popular", "Chef's Pick")

### Recommended Indexes

```
categoryId
isAvailable
```

---

# Orders Collection

Stores all user orders.

Important:
Orders **must snapshot food data** to prevent issues when food prices change.

```ts
{
  _id: ObjectId

  userId: ObjectId

  items: [
    {
      foodId: ObjectId
      name: string
      price: number
      image: string
      quantity: number
    }
  ]

  feeShip: number

  totalAmount: number

  address: {
    street: string
    city: string
    phone: string
    receiverName: string
  }

  orderStatus:
    "pending"
    | "confirmed"
    | "preparing"
    | "delivering"
    | "delivered"
    | "cancelled"

  paymentMethod:
    "stripe"
    | "vnpay"
    | "momo"

  paymentStatus:
    "pending"
    | "paid"
    | "failed"

  transactionId: string

  createdAt: Date
}
```

### Important Design Rules

Food data must be **snapshotted**:

```
foodId
name
price
image
quantity
```

This prevents inconsistencies when:

- food prices change
- food is deleted
- food name changes

### Indexes

```
userId
createdAt
```

---

# Order Workflow

Order creation flow:

```
1. User adds food to cart
2. Cart is stored in users.cart
3. User creates order
4. Backend reads cart
5. Food data is snapshotted
6. Order document is created
7. Cart is cleared
```

Important:

Orders must **never reference the cart directly**.

Incorrect design:

```
order → cart reference
```

Correct design:

```
order → snapshot food data
```

---

# Payment Flow

Supported payment providers:

- Stripe
- VNPay
- MoMo (optional)

Order payment lifecycle:

```
pending → paid → confirmed
```

Or

```
pending → failed
```

`transactionId` stores the payment gateway transaction ID.

---

# Naming Conventions

Use consistent field naming:

```
createdAt
updatedAt
userId
categoryId
foodId
```

Avoid inconsistent names like:

```
createAt
updateAt
```

---

# Performance Guidelines

Important indexes must exist on:

```
users.email
foods.categoryId
orders.userId
orders.createdAt
refreshTokens.token
```

These indexes significantly improve query performance.

---

# Scalability Notes

This schema is optimized for **version 1 of the application**.

Future improvements may include additional collections:

```
payments
reviews
coupons
addresses
```

However, they are **not required for the current system**.

---

# Summary

Collections used in this project:

```
users
refreshTokens
categories
foods
orders
```

Design principles:

- Keep schema simple
- Use embedded data where appropriate
- Snapshot order data
- Use indexes for performance
- Keep payment state explicit

```

```
