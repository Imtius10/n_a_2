

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import express from "express";

// src/API/Routes/user.route.ts
import { Router } from "express";

// src/GlobalError/SuccessAndError.ts
var sendSuccess = (res, statusCode, message, data) => {
  const payload = { success: true, message };
  if (data !== void 0) payload.data = data;
  res.status(statusCode).json(payload);
};
var sendError = (res, statusCode, message, errors) => {
  const payload = { success: false, message };
  if (errors !== void 0) payload.errors = errors;
  res.status(statusCode).json(payload);
};

// src/Utils/jwt.ts
import jwt from "jsonwebtoken";

// src/Config/index.ts
import dotenv from "dotenv";
import { env } from "process";
dotenv.config({ quiet: true });
var config = {
  port: env.PORT,
  db_url: env.DB_URL,
  jwt_secret: env.JWT_SECRET,
  jwt_refresh: env.JWT_REFRESH
};
var Config_default = config;

// src/Utils/jwt.ts
var verifyToken = (token, type) => {
  const secret = type === "access" ? Config_default.jwt_secret : Config_default.jwt_refresh;
  const decode = jwt.verify(token, secret);
  return decode;
};
var signToken = (payload) => {
  const accessToken = jwt.sign(payload, Config_default.jwt_secret, {
    expiresIn: "1d"
  });
  const refresToken = jwt.sign(payload, Config_default.jwt_refresh, {
    expiresIn: "3d"
  });
  return { accessToken, refresToken };
};

// src/API/Service/User.Service.ts
import bcrypt from "bcrypt";

// src/DB/index.ts
import pkg from "pg";
var { Pool } = pkg;
var pool = new Pool({
  connectionString: Config_default.db_url,
  ssl: {
    rejectUnauthorized: false
  }
});
var initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(75) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'contributor'
      CHECK (role IN ('contributor', 'maintainer')),
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL CHECK (LENGTH(description) >= 20),
      type VARCHAR(20) NOT NULL
      CHECK (type IN ('bug', 'feature_request')),
      status VARCHAR(20) NOT NULL DEFAULT 'open'
      CHECK (status IN ('open', 'in_progress', 'resolved')),
      reporter_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    )
  `);
};

// src/API/Service/User.Service.ts
var AuthService = class {
  async createUser(user) {
    const { name, email, password, role } = user;
    const password_hash = await bcrypt.hash(password, 12);
    const res = await pool.query(
      `
      INSERT INTO users(name,email,password_hash,role)
      VALUES ($1,$2,$3,COALESCE($4,'contributor'))
      RETURNING id,name,email,role,created_at,updated_at
      `,
      [name, email, password_hash, role]
    );
    return res.rows[0];
  }
  async loginValidator(email, password) {
    const res = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    if (!res.rows.length) {
      return null;
    }
    const { password_hash, ...user } = res.rows[0];
    const is_valid = await bcrypt.compare(password, password_hash);
    return is_valid ? user : null;
  }
  updateIssue = async (id, title, description, type) => {
    const result = await pool.query(
      `
      UPDATE issues
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
      `,
      [title, description, type, id]
    );
    return result.rows[0];
  };
};
var User_Service_default = new AuthService();

// src/API/Service/Issue.service.ts
var IssueService = class {
  createIssue = async (title, description, type, reporter_id) => {
    const result = await pool.query(
      `
      INSERT INTO issues(
        title,
        description,
        type,
        reporter_id
      )
      VALUES($1, $2, $3, $4)
      RETURNING *
      `,
      [title, description, type, reporter_id]
    );
    return result.rows[0];
  };
  getIssueById = async (id) => {
    const result = await pool.query(
      `
      SELECT * FROM issues
      WHERE id = $1
      `,
      [id]
    );
    return result.rows[0];
  };
  deleteIssue = async (id) => {
    const result = await pool.query(
      `
      DELETE FROM issues
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );
    return result.rows[0];
  };
  updateIssue = async (id, title, description, type) => {
    const result = await pool.query(
      `
      UPDATE issues
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
      `,
      [title, description, type, id]
    );
    return result.rows[0];
  };
  updateStatus = async (id, status) => {
    const result = await pool.query(
      `
      UPDATE issues
      SET
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );
    return result.rows[0];
  };
  // getAllIssues = async ({ sort }: IGetIssuesFilters) => {
  //   const order = sort === "oldest" ? "ASC" : "DESC";
  //   const result = await sql`
  //     SELECT *
  //     FROM issues
  //     ORDER BY created_at ${order}
  //   `;
  //   return result;
  // };
  // getAllIssues = async (
  //   filters: IGetIssuesFilters,
  // ): Promise<IssueWithReporter[]> => {
  //   const { sort = "newest", type, status } = filters;
  //   const order = sort === "oldest" ? sql`ASC` : sql`DESC`;
  //   let query = sql`
  //     SELECT
  //       i.id,
  //       i.title,
  //       i.description,
  //       i.type,
  //       i.status,
  //       i.created_at,
  //       i.updated_at,
  //       u.id AS reporter_id,
  //       u.name AS reporter_name,
  //       u.role AS reporter_role
  //     FROM issues i
  //     JOIN users u ON u.id = i.reporter_id
  //     WHERE 1=1
  //   `;
  //   if (type) {
  //     query = sql`${query} AND i.type = ${type}`;
  //   }
  //   if (status) {
  //     query = sql`${query} AND i.status = ${status}`;
  //   }
  //   const result = (await sql`
  //     ${query}
  //     ORDER BY i.created_at ${order}
  //   `) as IssueRow[];
  //   return result.map((row) => ({
  //     id: row.id,
  //     title: row.title,
  //     description: row.description,
  //     type: row.type as any,
  //     status: row.status as any,
  //     created_at: row.created_at,
  //     updated_at: row.updated_at,
  //     reporter: {
  //       id: row.reporter_id,
  //       name: row.reporter_name,
  //       role: row.reporter_role,
  //     },
  //   }));
  // };
  getAllIssues = async (filters) => {
    const { sort = "newest", type, status } = filters;
    const values = [];
    let paramIndex = 1;
    let query = `
      SELECT 
        i.id,
        i.title,
        i.description,
        i.type,
        i.status,
        i.created_at,
        i.updated_at,
        u.id AS reporter_id,
        u.name AS reporter_name,
        u.role AS reporter_role
      FROM issues i
      JOIN users u ON u.id = i.reporter_id
      WHERE 1=1
    `;
    if (type) {
      query += ` AND i.type = $${paramIndex++}`;
      values.push(type);
    }
    if (status) {
      query += ` AND i.status = $${paramIndex++}`;
      values.push(status);
    }
    query += `
      ORDER BY i.created_at ${sort === "oldest" ? "ASC" : "DESC"}
    `;
    const result = await pool.query(query, values);
    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      reporter: {
        id: row.reporter_id,
        name: row.reporter_name,
        role: row.reporter_role
      }
    }));
  };
};
var Issue_service_default = new IssueService();

// src/API/Controller/User.controller.ts
var signUp = async (req, res) => {
  try {
    const user = await User_Service_default.createUser(req.body);
    return sendSuccess(res, 201, "User registered successfully", user);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error", error);
  }
};
var login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User_Service_default.loginValidator(email, password);
    if (!user) {
      return sendError(res, 401, "Invalid email or password");
    }
    const { accessToken, refresToken } = signToken(user);
    res.cookie("refreshToken", refresToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });
    return sendSuccess(res, 200, "Login successful", {
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    return sendError(res, 500, "Internal Server Error", error);
  }
};

// src/Middleware/auth.ts
var auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendError(res, 401, "Access Token missing");
    }
    const payload = verifyToken(authHeader, "access");
    req.user = {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role
    };
    next();
  } catch (error) {
    return sendError(res, 401, "Invalid access token", error);
  }
};
var authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, "Unauthorized");
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, "Forbidden");
    }
    next();
  };
};

// src/API/Controller/Issue.Controller.ts
var createIssue = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const issue = await Issue_service_default.createIssue(
      title,
      description,
      type,
      req.user.id
    );
    return sendSuccess(res, 201, "Issue created successfully", issue);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error", error);
  }
};
var getIssueById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const issue = await Issue_service_default.getIssueById(id);
    if (!issue) {
      return sendError(res, 404, "Issue not found");
    }
    return sendSuccess(res, 200, "Issue retrieved successfully", issue);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error", error);
  }
};
var updateIssue = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { id: userId, role: userRole } = req.user;
    const issue = await Issue_service_default.getIssueById(id);
    if (!issue) {
      return sendError(res, 404, "Issue not found");
    }
    if (userRole === "contributor") {
      if (issue.reporter_id !== userId) {
        return sendError(
          res,
          403,
          "Forbidden: Contributors can only update their own issues"
        );
      }
      if (issue.status !== "open") {
        return sendError(
          res,
          403,
          "Forbidden: Contributors cannot update an issue that is not open"
        );
      }
    }
    const { title, description, type } = req.body;
    const updated = await Issue_service_default.updateIssue(
      id,
      title,
      description,
      type
    );
    return sendSuccess(res, 200, "Issue updated successfully", updated);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error", error);
  }
};
var deleteIssue = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await Issue_service_default.deleteIssue(id);
    if (!deleted) {
      return sendError(res, 404, "Issue not found");
    }
    return sendSuccess(res, 200, "Issue deleted successfully", deleted);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error", error);
  }
};
var getAllIssues = async (req, res) => {
  try {
    const { sort, type, status } = req.query;
    const sortValue = sort === "oldest" ? "oldest" : "newest";
    const typeValue = type === "bug" || type === "feature_request" ? type : void 0;
    const statusValue = status === "open" || status === "in_progress" || status === "resolved" ? status : void 0;
    const filters = {
      sort: sortValue
    };
    if (typeValue) {
      filters.type = typeValue;
    }
    if (statusValue) {
      filters.status = statusValue;
    }
    const issues = await Issue_service_default.getAllIssues(filters);
    return sendSuccess(res, 200, "Issues retrieved successfully", issues);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error", error);
  }
};

// src/API/Routes/user.route.ts
var router = Router();
router.post("/auth/signup", signUp);
router.get("/auth/login", login);
router.patch(
  "/issues/:id",
  auth,
  authorizeRole("contributor", "maintainer"),
  updateIssue
);

// src/API/Routes/issue.routes.ts
import { Router as Router2 } from "express";
var router2 = Router2();
router2.post(
  "/issues",
  auth,
  authorizeRole("contributor", "maintainer"),
  createIssue
);
router2.get("/issues/:id", getIssueById);
router2.patch(
  "/issues/:id",
  auth,
  authorizeRole("contributor", "maintainer"),
  updateIssue
);
router2.delete(
  "/issues/:id",
  auth,
  authorizeRole("maintainer"),
  deleteIssue
);
router2.get(
  "/issues",
  getAllIssues
);
var IssueRoute = router2;

// src/app.ts
import cookieparser from "cookie-parser";
var app = express();
app.use(express.json());
app.use(cookieparser());
app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/api", router);
app.use("/api", IssueRoute);
var app_default = app;

// src/server.ts
var main = async () => {
  await initDB();
  app_default.listen(Config_default.port);
};
main();
//# sourceMappingURL=server.js.map