# 🚀 Cognifyz - SaaS Task Management Platform

A full-stack SaaS web application built with **React, Node.js, Express, and MongoDB**, featuring authentication, task management, AI chat, and an admin dashboard.

🌐 Live Demo
🔗 Frontend: https://cognifyz-three.vercel.app
🔗 Backend API: https://cognifyz-2.onrender.com

## ✨ Features

* 🔐 Secure Authentication (JWT-based Login / Signup)
* 📊 Task Dashboard (Priority, Status, Due Dates)
* 🤖 AI Chat Integration (Groq API)
* 👑 Admin Panel (User Management)
* 👤 User Profile Management
* 🌙 Dark / Light Mode Support
* 🔔 Toast Notifications
* 📱 Fully Responsive UI

## 🛠 Tech Stack

### Frontend

* React (Vite)
* React Router DOM
* Axios
* Framer Motion
* Context API

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* REST API Architecture

### Deployment

* Frontend: Vercel
* Backend: Render / Vercel
* Database: MongoDB Atlas

## 📦 Getting Started

### ⚙️ Prerequisites

* Node.js v18+
* MongoDB Atlas account
* Vercel / Render account

## 🔧 Installation

### 1️⃣ Clone Repository

git clone https://github.com/Rasagna2409/cognifyz.git
cd cognifyz

### 2️⃣ Backend Setup

cd backend
npm install


Create `.env` file:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
GROQ_API_KEY=your_groq_api_key


Run backend:

npm start

### 3️⃣ Frontend Setup

cd frontend
npm install

Create `.env` file:
VITE_API_URL=http://localhost:5000

Run frontend:

npm run dev

## 🌐 API Endpoints

### 🔐 Auth

* `POST /api/auth/register` → Register user
* `POST /api/auth/login` → Login user
* `GET /api/auth/me` → Get profile
* `PUT /api/auth/me` → Update profile

### 📊 Tasks

* `GET /api/tasks` → Get tasks
* `POST /api/tasks` → Create task
* `PUT /api/tasks/:id` → Update task
* `DELETE /api/tasks/:id` → Delete task

### 🤖 AI Chat

* `POST /api/chat` → Chat with AI

### 👑 Admin

* `GET /api/admin/users` → Get all users

## 📁 Project Structure
cognifyz/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.jsx
│   └── vite.config.js
│
└── backend/
    ├── models/
    ├── routes/
    ├── middleware/
    └── server.js

## 🚀 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add `VITE_API_URL`
4. Deploy

### Backend (Render/Vercel)

1. Add environment variables
2. Set start command:
npm start

3. Deploy

🏗 Architecture Diagram

You can add this simple structure:

## 🏗 Architecture

Frontend (React + Vite)
        │
        │ Axios (REST API calls)
        ▼
Backend (Node.js + Express)
        │
        │ JWT Authentication
        ▼
MongoDB Atlas (Database)
        │
        └── AI Service (Groq API)

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Rasagna**
GitHub: [@Rasagna2409](https://github.com/Rasagna2409)




