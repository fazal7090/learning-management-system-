# 📚 Library Management System (LMS) – Backend (NestJS + Prisma + PostgreSQL)

This is a **backend project** for a Library Management System built with **NestJS**, **Prisma**, and **PostgreSQL**.  
It demonstrates **modern backend practices** including authentication, authorization, pagination, filtering, sorting, and clean modular design.

---

## 🚀 Features Implemented (So Far)

### 🔐 Authentication & Authorization
- **Signup & Login** using JWT.
- Passwords hashed with **bcrypt**.
- **AuthGuard** to protect routes (validates JWT and attaches user payload to `req.user`).
- Global `ConfigModule` to manage environment variables like `JWT_SECRET`.

### 👤 Users
- `GET /users/:id` → fetch user by ID (with validation).
- `PATCH /users/me` → update user profile (name/password only, requires token).
- Token payload (`sub`, `email`, `role`) attached to `req.user`.

### Routes implemented till now 
- Login/Signup
- Get logged in user detail 
- Update logged in user detail 
- Get route for all the books available with pagination filtering and sorting
- Post route for borrowing a book , the book should be returned in 2 weeks else fine when returning which will be implemented in that route
- Get route for details of a single book
- Post route for returning of book (it will be implemented in admin route)
- Post route for adding a review by user 
- Get route for getting all reviews of a specific book
