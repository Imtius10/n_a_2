import { sql } from "../../DB";
import type { RUser } from "../../type/type";
import brypt from "bcrypt"


class AuthService{ 
    async createUser(user: RUser & { password: string }) {
        const { name, email, password, role } = user;
        const password_hash = await brypt.hash(password, 12);
        const res = await sql`
        INSERT INTO users(name,email,password_hash,role)
        VALUES (${name},${email},${password_hash},COALESCE(${role},'contributor'))
        RETURNING id,name,email,role,created_at, updated_at
        `;
        return res[0];
    }
}

export default new AuthService()