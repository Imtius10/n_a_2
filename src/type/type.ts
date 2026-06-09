export const UserRole = ["contributor", "maintainer"] as const;
export type IssueType = "bug" | "feature_request";
export type IssueStatus = "open" | "in_progress" | "resolved";
export type Role = (typeof UserRole)[number];

export interface IGetIssuesFilters {
  sort: "newest" | "oldest";
  type?: IssueType | undefined; 
  status?: IssueStatus | undefined; 
}
export type User = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
};
export type RUser = Omit<
  User,
  "id" | "password_hash" | "created_at" | "updated_at"
>;

export interface Issue {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IssueWithReporter extends Omit<Issue, "reporter_id"> {
  reporter: {
    id: number;
    name: string;
    role: Role;
  };
}

export interface JwtPayload {
  id: number;
  name: string;
  role: Role;
}

