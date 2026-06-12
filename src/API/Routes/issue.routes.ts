import { Router } from "express";
import { auth, authorizeRole } from "../../Middleware/auth";
import {
  createIssue,
  deleteIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
} from "../Controller/Issue.Controller";

export const router = Router();
//1
router.post(
  "/issues",
  auth,
  authorizeRole("contributor", "maintainer"),
  createIssue,
);
//router.patch("/:id/status", auth, authorizeRole("maintainer"), updateIssue);
//2
router.get("/issues/:id", getIssueById);
//3
router.patch(
  "/issues/:id",
  auth,
  authorizeRole("contributor", "maintainer"),
  updateIssue,
);
//4
router.delete(
  "/issues/:id",
  auth,
  authorizeRole("maintainer"),
  deleteIssue,
);
//5
router.get(
  "/issues",
  getAllIssues,
);
export const IssueRoute = router;
