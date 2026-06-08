export const UserRole = ["contributor", "maintainer"] as const;

type Role = typeof UserRole[number];


 export type User = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
};
export type RUser = Omit<User, "id" | "password_hash" | "created_at" | "updated_at">;

