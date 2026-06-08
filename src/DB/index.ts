import { neon } from "@neondatabase/serverless";
import config from "../Config/config.index";

export const sql = neon(config.db_url);

export const initDB = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(75) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
    `;

  await sql`
    CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL CHECK (LENGTH(description) >= 20),
        type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        reporter_id INT NOT NULL, -- Application logic will validate existence against users(id)
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
    `;
  console.log("db conn");
};
