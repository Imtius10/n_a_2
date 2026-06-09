import { sql } from "../../DB";
import type { IssueType } from "../../type/type";

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
}

export default new IssueService