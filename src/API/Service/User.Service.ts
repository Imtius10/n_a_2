import bcrypt from "bcrypt";
import { pool } from "../../DB";
import type { IssueType, RUser, User } from "../../type/type";

class AuthService {
  async createUser(user: RUser & { password: string }) {
    const { name, email, password, role } = user;
    const password_hash = await bcrypt.hash(password, 12);

    const res = await pool.query(
      `
      INSERT INTO users(name,email,password_hash,role)
      VALUES ($1,$2,$3,COALESCE($4,'contributor'))
      RETURNING id,name,email,role,created_at,updated_at
      `,
      [name, email, password_hash, role],
    );
    // const res = await sql`
    //     INSERT INTO users(name,email,password_hash,role)
    //     VALUES (${name},${email},${password_hash},COALESCE(${role},'contributor'))
    //     RETURNING id,name,email,role,created_at, updated_at
    //     `;
    return res.rows[0];
  }

  async loginValidator(email: string, password: string) {
    const res = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    // const res = await sql`
    //     SELECT * FROM users WHERE email=${email}
    //     `;

    if (!res.rows.length) {
      return null;
    }
    const { password_hash, ...user } = res.rows[0] as User;
    const is_valid = await bcrypt.compare(password, password_hash);
    return is_valid ? user : null;
  }
  updateIssue = async (
    id: number,
    title?: string,
    description?: string,
    type?: IssueType,
  ) => {
  //   const result = await sql`
  //   UPDATE issues
  //   SET
  //     title = COALESCE(${title}, title),
  //     description = COALESCE(${description}, description),
  //     type = COALESCE(${type}, type),
  //     updated_at = NOW()
  //   WHERE id = ${id}
  //   RETURNING *
  // `;

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
      [title, description, type, id],
    );

    return result.rows[0];
  };
}

export default new AuthService();
