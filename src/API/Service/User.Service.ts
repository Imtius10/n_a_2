import bcrypt from "bcrypt";
import { sql } from "../../DB";
import type { IssueType, RUser, User } from "../../type/type";

class AuthService {
  async createUser(user: RUser & { password: string }) {
    const { name, email, password, role } = user;
    const password_hash = await bcrypt.hash(password, 12);
    const res = await sql`
        INSERT INTO users(name,email,password_hash,role)
        VALUES (${name},${email},${password_hash},COALESCE(${role},'contributor'))
        RETURNING id,name,email,role,created_at, updated_at
        `;
    return res[0];
  }

  async loginValidator(email: string, password: string) {
    const res = await sql`
        SELECT * FROM users WHERE email=${email}
        `;
    console.log(res);

    if (!res.length) {
      return null;
    }
    const { password_hash, ...user } = res[0] as User;
    const is_valid = await bcrypt.compare(password, password_hash);
    return is_valid ? user : null;
  }
  updateIssue = async (
    id: number,
    title?: string,
    description?: string,
    type?: IssueType,
  ) => {
    const result = await sql`
    UPDATE issues
    SET
      title = COALESCE(${title}, title),
      description = COALESCE(${description}, description),
      type = COALESCE(${type}, type),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

    return result[0];
  };
}

export default new AuthService();
