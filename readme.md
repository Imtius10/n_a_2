# 🚼 DevPulse – Internal Tech Issue & Feature Tracker

DevPulse is a collaborative platform designed for software teams to efficiently report bugs, suggest features, and manage issue workflows in a structured and scalable way. It provides authentication, role-based access control, and a clean issue tracking system built on PostgreSQL with raw SQL queries.

---

## Overview

DevPulse is built using:

Node.js (LTS 24+), TypeScript, Express.js, PostgreSQL, and the native pg driver. It strictly uses raw SQL (`pool.query`) without ORMs or query builders. Authentication is handled using JWT, and passwords are securely hashed using bcrypt.

---

## ⚙️ Core Principles

- Raw SQL only (no ORM / no query builder)
- Secure authentication using JWT
- Passwords hashed using bcrypt (salt rounds 8–12)
- Role-based access control (RBAC)
- Clean separation of contributor and maintainer permissions
- No sensitive data exposed in responses

---

## 👥 User Roles

### Contributor

- Register and login
- Create issues (bug / feature_request)
- View all issues
- Update only their own issues (if allowed)

### Maintainer

- All contributor permissions
- Update any issue
- Delete any issue
- Manage issue status workflow (open → in_progress → resolved)

---

## 🔐 Authentication System (JWT)

JWT-based authentication flow:

User sends credentials → Server validates using bcrypt → Server generates JWT → Client stores token → Token sent in Authorization header → Server verifies token before granting access.

Security rules:

- Passwords are never returned or logged
- Protected routes require valid JWT
- Role-based authorization is enforced on every request

---

## Database Schema

### Users Table

- id → auto-increment primary key
- name → full name (required)
- email → unique email (required)
- password → hashed password (never returned)
- role → contributor | maintainer (default: contributor)
- created_at → timestamp
- updated_at → timestamp

### Issues Table

- id → auto-increment primary key
- title → max 150 characters
- description → minimum 20 characters
- type → bug | feature_request
- status → open | in_progress | resolved (default: open)
- reporter_id → user reference handled in application logic
- created_at → timestamp
- updated_at → timestamp

---

## API Endpoints

### Authentication

POST /api/auth/signup  
Creates a new user account with name, email, password, and role.

POST /api/auth/login  
Authenticates user and returns JWT token + user data.

---

### Issues

POST /api/issues  
Creates a new issue (requires JWT).

GET /api/issues  
Fetches all issues with optional filters:

- sort = newest | oldest
- type = bug | feature_request
- status = open | in_progress | resolved

GET /api/issues/:id  
Fetch single issue by ID.

PATCH /api/issues/:id  
Update issue fields (role-based restrictions apply).

DELETE /api/issues/:id  
Delete issue (maintainer only).

---

## Response Format

### Success Response

{
success: true,
message: "Operation successful",
data: {}
}

### Error Response

{
success: false,
message: "Error message",
errors: {}
}

---

## HTTP Status Codes

200 → OK  
201 → Created  
400 → Bad Request  
401 → Unauthorized  
403 → Forbidden  
404 → Not Found  
409 → Conflict  
500 → Internal Server Error

---

## 🚀 DevPulse Vision

DevPulse is designed to simplify collaboration between developers by providing a structured, secure, and scalable issue tracking system. It ensures clear ownership of issues, controlled workflows, and secure authentication across all operations.
