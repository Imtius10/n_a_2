import { sql } from "../../DB";
import type {
  IGetIssuesFilters,
  IssueStatus,
  IssueType,
  IssueWithReporter,
  Role,
} from "../../type/type";

type IssueRow = {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  created_at: Date;
  updated_at: Date;

  reporter_id: number;
  reporter_name: string;
  reporter_role: Role;
};
class IssueService {
  createIssue = async (
    title: string,
    description: string,
    type: IssueType,
    reporter_id: number,
  ) => {
    const result = await sql`
    INSERT INTO issues(
        title,
        description,
        type,
        reporter_id
    )
    VALUES(
        ${title},
        ${description},
        ${type},
        ${reporter_id}
    )
    RETURNING *
    `;
    return result[0];
  };

  getIssueById = async (id: number) => {
    const result = await sql`
       SELECT * FROM issues
       WHERE id=${id}
      `;
    return result[0];
  };

  deleteIssue = async (id: number) => {
    const result = await sql`
        DELETE FROM issues
        WHERE id=${id}
        RETURNING *
        `;
    return result[0];
  };
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
  updateStatus = async (id: number, status: IssueStatus) => {
    const result = await sql`
    UPDATE issues
    SET
      status = ${status},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

    return result[0];
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

  getAllIssues = async (
    filters: IGetIssuesFilters,
  ): Promise<IssueWithReporter[]> => {
    const { sort = "newest", type, status } = filters;

    const order = sort === "oldest" ? sql`ASC` : sql`DESC`;

    let query = sql`
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
      query = sql`${query} AND i.type = ${type}`;
    }

    if (status) {
      query = sql`${query} AND i.status = ${status}`;
    }

    const result = (await sql`
      ${query}
      ORDER BY i.created_at ${order}
    `) as IssueRow[];

    return result.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type as any,
      status: row.status as any,
      created_at: row.created_at,
      updated_at: row.updated_at,
      reporter: {
        id: row.reporter_id,
        name: row.reporter_name,
        role: row.reporter_role,
      },
    }));
  };
}

export default new IssueService();
