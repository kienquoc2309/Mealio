# Mealio

A food ordering platform where users can browse foods, add items to a cart, place orders, and pay through supported payment providers.

**Demo:** [https://mealio-ashen.vercel.app](https://mealio-ashen.vercel.app/)

## Tech Stack

- **Backend:** NestJS, MongoDB, Mongoose
- **Frontend:** Vue.js, Pinia, Tailwind CSS, Vite
- **Payments:** Stripe
- **Auth:** JWT, Google OAuth, Facebook OAuth
- **Email:** Nodemailer (Gmail SMTP)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [npm](https://www.npmjs.com/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Mealio.git
cd Mealio
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Fill in the required environment variables in `.env`:

| Variable                                   | Description                                     |
| ------------------------------------------ | ----------------------------------------------- |
| `MONGO_URI`                                | MongoDB connection string                       |
| `JWT_SECRET`                               | Secret key for access tokens                    |
| `JWT_REFRESH_SECRET`                       | Secret key for refresh tokens                   |
| `CLOUD_NAME`, `CLOUD_KEY`, `CLOUD_SECRET`  | Cloudinary credentials for image uploads        |
| `STRIPE_SECRET_KEY`                        | Stripe secret key for payments                  |
| `STRIPE_WEBHOOK_SECRET`                    | Stripe webhook signing secret                   |
| `SMTP_USER`, `SMTP_PASS`                   | Gmail SMTP credentials for sending emails       |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 credentials                    |
| `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`   | Facebook OAuth credentials                      |
| `FRONTEND_URL`                             | Frontend URL (default: `http://localhost:5173`) |
| `BACKEND_URL`                              | Backend URL (default: `http://localhost:5000`)  |

Start the backend development server:

```bash
npm run start:dev
```

The backend will run at **http://localhost:5000**.

### 3. Setup Frontend

```bash
cd frontend
pnpm install
```

Start the frontend development server:

```bash
pnpm dev
```

The frontend will run at **http://localhost:5173**.

### 4. Seed Data (Optional)

To populate the database with sample data:

```bash
cd backend
npm run seed
```

## Project Structure

```
Mealio/
├── backend/
│   └── src/
│       ├── common/          # Filters, interceptors, logger
│       ├── config/          # App configuration
│       └── modules/
│           ├── auth/        # Authentication (JWT, OAuth)
│           ├── cart/        # Shopping cart
│           ├── email/       # Email service
│           ├── foods/       # Food menu management
│           ├── orders/      # Order lifecycle
│           ├── payments/    # Stripe payment integration
│           └── users/       # User management
├── frontend/
│   └── src/app/
│       ├── components/      # Reusable Vue components
│       ├── pages/           # Page views
│       ├── services/        # API service layers
│       ├── stores/          # Pinia state stores
│       └── types/           # TypeScript type definitions
└── README.md
```

## Available Scripts

### Backend

| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `npm run start:dev`  | Start in development mode (hot reload) |
| `npm run start:prod` | Start in production mode               |
| `npm run build`      | Build for production                   |
| `npm run seed`       | Seed database with sample data         |
| `npm run lint`       | Run ESLint                             |
| `npm run test`       | Run unit tests                         |

### Frontend

| Command      | Description              |
| ------------ | ------------------------ |
| `pnpm dev`   | Start development server |
| `pnpm build` | Build for production     |
