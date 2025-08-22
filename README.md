# store-rating-platform

A full-stack web application that allows users to register, log in, and submit ratings for stores.  
The platform supports **role-based access control** for System Administrators, Normal Users, and Store Owners.

## 🚀 Tech Stack
- **Frontend:** React (Vite, TypeScript, TailwindCSS)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)

## 👥 User Roles & Features

### 🔑 System Administrator
- Add new stores, normal users, and admin users
- Dashboard with:
  - Total users
  - Total stores
  - Total ratings
- View & filter users and stores
- View store ratings and user details

### 🙍 Normal User
- Sign up & log in
- Update password
- View & search stores
- Submit and modify ratings (1–5)
- View own submitted ratings

### 🏪 Store Owner
- Log in & update password
- Dashboard with:
  - Users who rated their store
  - Average store rating

## 🧪 Sample Login Credentials

Use the following test accounts:

- **Admin**
  - Email: `admin@example.com`
  - Password: `Admin@123`

- **Store Owner**
  - Email: `owner@example.com`
  - Password: `Owner@123`

- **Normal User**
  - Email: `normaluser@example.com`
  - Password: `User@123`

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in `backend/` with:
```
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
PORT=5000
```
Run backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:5000`

## ✅ Validations
- Name: 20–60 chars  
- Address: max 400 chars  
- Password: 8–16 chars, at least one uppercase & one special character  
- Email: standard format  

---

**Live Demo**: 