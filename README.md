# 🏪 Rating System - Full Stack Application

A modern, full-stack web application that allows users to submit ratings for stores registered on the platform. Features a sleek dark theme with cyan-blue gradient accents.

Built with **Express.js** (Backend), **PostgreSQL** (Database), **React.js** + **Tailwind CSS** (Frontend).

---

## 🌐 Live Demo

🔗 **Frontend**: [rating-system-sigma.vercel.app](https://rating-system-sigma.vercel.app)  
🔗 **Backend API**: [ratingsystem-ztjj.onrender.com](https://ratingsystem-ztjj.onrender.com)

---

## Default Login Credentials

> ⚠️ **Important**: These are the default seeded credentials for testing purposes.

| Role           | Email                    | Password    |
| -------------- | ------------------------ | ----------- |
| 👑 **Admin**   | `admin@ratingsystem.com` | `Admin@123` |
| 🏬 Store Owner | `owner@store.com`        | `Owner@123` |
| 👤 Normal User | `user@example.com`       | `User@123`  |

---

## ✨ Features

### User Roles

1. **System Administrator**
   - Add new stores, normal users, and admin users
   - Dashboard with statistics (total users, stores, ratings)
   - View/filter all users and stores
   - Manage users and stores (CRUD operations)

2. **Normal User**
   - Sign up and log in to the platform
   - View list of all registered stores
   - Search stores by name and address
   - Submit ratings (1-5) for stores
   - Modify submitted ratings
   - Update password

3. **Store Owner**
   - Log in and view dashboard
   - View list of users who submitted ratings
   - See average rating of their store
   - Update password

### 📋 Form Validations

- **Name**: Min 20 characters, Max 60 characters
- **Address**: Max 400 characters
- **Password**: 8-16 characters, at least one uppercase letter and one special character
- **Email**: Standard email validation

---

## 🛠️ Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | React.js, Tailwind CSS, Vite      |
| Backend  | Express.js (Node.js)              |
| Database | PostgreSQL                        |
| Auth     | JWT (JSON Web Tokens)             |
| Styling  | Tailwind CSS v4 with custom theme |

---

## 📁 Project Structure

```
RatingSystem/
├── backend/
│   ├── migrations/
│   │   ├── 01_create_database.js
│   │   ├── 02_create_schema.js
│   │   └── 03_seed_data.js
│   ├── src/
│   │   ├── config/
│   │   │   ├── constants.js
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── ratingController.js
│   │   │   └── storeController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── Rating.js
│   │   │   ├── Store.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── storeOwnerRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── validators.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── AddStorePage.js
│   │   │   ├── AddUserPage.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminStoresPage.js
│   │   │   ├── AdminUsersPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── SignupPage.js
│   │   │   ├── StoreOwnerDashboard.js
│   │   │   ├── UpdatePasswordPage.js
│   │   │   └── UserStoresPage.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## Database Schema

### Users Table

| Column     | Type         | Description                        |
| ---------- | ------------ | ---------------------------------- |
| id         | SERIAL       | Primary key                        |
| name       | VARCHAR(60)  | User's full name (min 20 chars)    |
| email      | VARCHAR(255) | Unique email address               |
| password   | VARCHAR(255) | Hashed password                    |
| address    | VARCHAR(400) | User's address                     |
| role       | VARCHAR(50)  | admin, normal_user, or store_owner |
| created_at | TIMESTAMP    | Account creation date              |
| updated_at | TIMESTAMP    | Last update date                   |

### Stores Table

| Column     | Type         | Description                |
| ---------- | ------------ | -------------------------- |
| id         | SERIAL       | Primary key                |
| name       | VARCHAR(60)  | Store name (min 20 chars)  |
| email      | VARCHAR(255) | Unique store email         |
| address    | VARCHAR(400) | Store address              |
| owner_id   | INTEGER      | Foreign key to users table |
| created_at | TIMESTAMP    | Store creation date        |
| updated_at | TIMESTAMP    | Last update date           |

### Ratings Table

| Column     | Type      | Description                 |
| ---------- | --------- | --------------------------- |
| id         | SERIAL    | Primary key                 |
| user_id    | INTEGER   | Foreign key to users table  |
| store_id   | INTEGER   | Foreign key to stores table |
| rating     | INTEGER   | Rating value (1-5)          |
| created_at | TIMESTAMP | Rating submission date      |
| updated_at | TIMESTAMP | Last update date            |

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your PostgreSQL credentials:

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=rating_system
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

5. Run migrations:

   ```bash
   # Create database
   node migrations/01_create_database.js

   # Create schema
   node migrations/02_create_schema.js

   # Seed initial data
   node migrations/03_seed_data.js
   ```

6. Start the backend server:

   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. Start the frontend development server:

   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - Normal user signup
- `POST /api/auth/update-password` - Update password (authenticated)

### Admin Routes (requires admin role)

- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users (with filtering/sorting)
- `POST /api/admin/users` - Add new user
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stores` - Get all stores (with filtering/sorting)
- `POST /api/admin/stores` - Add new store
- `PUT /api/admin/stores/:id` - Update store
- `DELETE /api/admin/stores/:id` - Delete store

### User Routes (requires normal_user role)

- `GET /api/users/stores` - Get all stores
- `POST /api/users/ratings` - Submit a rating
- `GET /api/users/ratings/store/:storeId` - Get user's rating for a store

### Store Owner Routes (requires store_owner role)

- `GET /api/store-owner/dashboard/:storeId` - Get store statistics
- `GET /api/store-owner/dashboard/:storeId/ratings` - Get store ratings with user info
