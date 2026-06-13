# 🚀 – Internal Tech Issue & Feature Tracker

**Live URL:** https://jwt3-theta.vercel.app/

DevPulse is a role-based issue tracking platform that allows software teams to report bugs, request features, and manage issue workflows efficiently. The application provides secure authentication, authorization, and issue management using Node.js, Express.js, TypeScript, PostgreSQL, and JWT.

---

# 📌 Features

- User Registration & Login
- JWT Authentication
- Role-Based Access Control (Contributor & Maintainer)
- Create Issues
- View All Issues
- View Single Issue
- Update Issues
- Delete Issues (Maintainer Only)
- Issue Status Management
- Filtering & Sorting Issues
- Secure Password Hashing with bcrypt
- PostgreSQL Database Integration
- Raw SQL Queries (No ORM)

---

# 🛠 Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- PostgreSQL
- pg Driver

### Authentication & Security

- JWT (JSON Web Token)
- bcrypt

### Deployment

- Vercel

---

# 📂 Project Structure

# 📂 Project Structure

```text
.
├── dist/
├── node_modules/
├── src/
│   ├── API/
│   │   ├── Controller/
│   │   ├── Routes/
│   │   └── Service/
│   ├── Config/
│   ├── DB/
│   ├── GlobalError/
│   ├── Middleware/
│   ├── Utils/
│   ├── type/
│   ├── app.ts
│   └── server.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsup.config.ts
├── vercel.json
└── README.md
```

---

# ⚙️ Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/Imtius10/n_a_2.git
cd n_a_2
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Create Environment Variables

Create a `.env` file:

```env
PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=
JWT_REFRESH=
```

## 4. Run Development Server

```bash
npm run dev
```

## 5. Build Project

```bash
npm run build
```

## 6. Start Production Server

```bash
npm start
```

---

# 🔐 Authentication

Protected routes require a JWT token in the request header:

```http
Authorization: Bearer <token>
```

---

# 📡 API Endpoint List

## Authentication

### Register User

```http
POST /api/auth/signup
```

### Login User

```http
POST /api/auth/login
```

---

## Issues

### Create Issue

```http
POST /api/issues
```

Requires Authentication.

### Get All Issues

```http
GET /api/issues
```

Optional Query Parameters:

```http
?sort=newest
?sort=oldest
?type=bug
?type=feature_request
?status=open
?status=in_progress
?status=resolved
```

### Get Single Issue

```http
GET /api/issues/:id
```

### Update Issue

```http
PATCH /api/issues/:id
```

### Delete Issue

```http
DELETE /api/issues/:id
```

Maintainer Only.

---

# 🗄 Database Schema Summary

## Users Table

| Column     | Type      | Description              |
| ---------- | --------- | ------------------------ |
| id         | SERIAL    | Primary Key              |
| name       | VARCHAR   | User Name                |
| email      | VARCHAR   | Unique Email             |
| password   | TEXT      | Hashed Password          |
| role       | ENUM      | contributor / maintainer |
| created_at | TIMESTAMP | Creation Time            |
| updated_at | TIMESTAMP | Last Update Time         |

---

## Issues Table

| Column      | Type         | Description                   |
| ----------- | ------------ | ----------------------------- |
| id          | SERIAL       | Primary Key                   |
| title       | VARCHAR(150) | Issue Title                   |
| description | TEXT         | Issue Details                 |
| type        | ENUM         | bug / feature_request         |
| status      | ENUM         | open / in_progress / resolved |
| reporter_id | INTEGER      | User Reference                |
| created_at  | TIMESTAMP    | Creation Time                 |
| updated_at  | TIMESTAMP    | Last Update Time              |

---

# 📄 Response Format

## Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": {}
}
```

---

# 📊 HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 500  | Internal Server Error |

---

# 👥 User Roles

## Contributor

- Register & Login
- Create Issues
- View Issues
- Update Own Issues

## Maintainer

- All Contributor Permissions
- Update Any Issue
- Delete Any Issue
- Manage Issue Status

---

# 🎯 Project Goal

DevPulse helps development teams track bugs and feature requests in a structured environment. By combining secure authentication, role-based authorization, and issue workflow management, it provides a scalable foundation for internal project collaboration.
