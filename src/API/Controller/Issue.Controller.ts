import type { Request, Response } from "express";
import IssueService from "../Service/Issue.service";
import { sendError, sendSuccess } from "../../GlobalError/SuccessAndError";



export const createIssue = async (req: Request, res: Response) => {
    try {
        const { title, description, type } = req.body
        const issue = await IssueService.createIssue(title, description, type, req.user.id);
        return sendSuccess(res, 201, "Issue created successfully", issue);
    } catch (error) {
         return sendError(res, 500, "Internal Server Error", error);
    }
}