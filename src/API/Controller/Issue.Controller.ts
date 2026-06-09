import type { Request, Response } from "express";
import IssueService from "../Service/Issue.service";
import { sendError, sendSuccess } from "../../GlobalError/SuccessAndError";
import type { IGetIssuesFilters } from "../../type/type";

export const createIssue = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;
    const issue = await IssueService.createIssue(
      title,
      description,
      type,
      req.user.id,
    );
    return sendSuccess(res, 201, "Issue created successfully", issue);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error", error);
  }
};

export const getIssueById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const issue = await IssueService.getIssueById(id);

    if (!issue) {
      return sendError(res, 404, "Issue not found");
    }

    return sendSuccess(res, 200, "Issue retrieved successfully", issue);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error", error);
  }
};

export const updateIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, description, type } = req.body;

    const updated = await IssueService.updateIssue(
      id,
      title,
      description,
      type,
    );

    if (!updated) {
      return sendError(res, 404, "Issue not found");
    }

    return sendSuccess(res, 200, "Issue updated successfully", updated);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error", error);
  }
};

export const deleteIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const deleted = await IssueService.deleteIssue(id);

    if (!deleted) {
      return sendError(res, 404, "Issue not found");
    }

    return sendSuccess(res, 200, "Issue deleted successfully", deleted);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error", error);
  }
};

export const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query;

    const sortValue = sort === "oldest" ? "oldest" : "newest";

    const typeValue =
      type === "bug" || type === "feature_request" ? type : undefined;

    const statusValue =
      status === "open" || status === "in_progress" || status === "resolved"
        ? status
        : undefined;

    const filters: IGetIssuesFilters = {
      sort: sortValue,
    };

    if (typeValue) {
      filters.type = typeValue;
    }

    if (statusValue) {
      filters.status = statusValue;
    }

    const issues = await IssueService.getAllIssues(filters);

    return sendSuccess(res, 200, "Issues retrieved successfully", issues);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error", error);
  }
};