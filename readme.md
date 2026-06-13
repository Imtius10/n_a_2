# 🚼 DevPulse – Internal Tech Issue & Feature Tracker

DevPulse is a collaborative platform for software teams to report bugs, suggest features, and manage issue workflows efficiently. It is built using Node.js, TypeScript, Express.js, PostgreSQL, and raw SQL queries using the pg driver.

Technology Stack: Node.js (LTS 24+), TypeScript, Express.js, PostgreSQL, pg native driver, raw SQL (pool.query only, no ORM or query builders), bcrypt for password hashing with salt rounds 8–12, jsonwebtoken for authentication.

User Roles: contributor and maintainer. Contributor can register, login, create issues, view issues, and update their own issues. Maintainer has all contributor permissions plus ability to update any issue, delete any issue, and manage issue status workflow.

Authentication is JWT based. User logs in, server validates credentials using bcrypt, generates JWT, client sends token in Authorization header, server verifies token before allowing access. Passwords are never returned or logged. All protected routes require valid JWT. Role-based authorization is enforced.

Database Schema:

users table has id (auto increment), name (required), email (unique required), password (hashed, never returned), role (contributor or maintainer default contributor), created_at and updated_at timestamps.

issues table has id (auto increment), title (max 150 chars required), description (min 20 chars required), type (bug or feature_request), status (open, in_progress, resolved default open), reporter_id (user reference handled in application logic), created_at and updated_at timestamps.

API Endpoints:

POST /api/auth/signup creates a new user with name, email, password, role and returns user data without password.

POST /api/auth/login authenticates user using email and password and returns JWT token and user data.

POST /api/issues creates a new issue. Requires JWT in Authorization header. Body includes title, description, type. reporter_id is taken from decoded JWT.

GET /api/issues retrieves all issues with optional query params sort (newest or oldest default newest), type (bug or feature_request), and status (open, in_progress, resolved). Returns issues with reporter details.

GET /api/issues/:id retrieves a single issue by id.

PATCH /api/issues/:id updates issue fields. Contributors can update only their own open issues while maintainers can update any issue.

DELETE /api/issues/:id deletes an issue. Only maintainers can perform this action.

Response Format: success responses include success true, message, and data. error responses include success false, message, and errors.

HTTP Status Codes used are 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, and 500 Internal Server Error.

Key rules: only raw SQL using pool.query is allowed, no ORMs or query builders, JWT required for protected routes, bcrypt used for password hashing, passwords and sensitive data must never be exposed, and role-based access control must always be enforced.

DevPulse is built for internal team collaboration, issue tracking, and workflow management in software development teams.
