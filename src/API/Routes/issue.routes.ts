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
router.use(
  "/createIssue",
  auth,
  authorizeRole("contributor", "maintainer"),
  createIssue,
);
//router.patch("/:id/status", auth, authorizeRole("maintainer"), updateIssue);
//2
router.get("/issue/:id", auth,authorizeRole("contributor", "maintainer"),getIssueById);
//3
router.patch(
  "/issue/:id",
  auth,
  authorizeRole("contributor", "maintainer"),
  updateIssue,
);
//4
router.delete("/issue/:id", auth, authorizeRole("maintainer"), deleteIssue);
//5
router.get("/allissue",auth,authorizeRole("contributor", "maintainer"),getAllIssues);
export const IssueRoute = router;
