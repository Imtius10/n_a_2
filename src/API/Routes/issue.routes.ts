import { Router } from "express";
import { auth, authorizeRole } from "../../Middleware/auth";
import {
  createIssue,
  deleteIssue,
  getIssueById,
  updateIssue,
} from "../Controller/Issue.Controller";

export const router = Router();

router.use(
  "/createIssue",
  auth,
  authorizeRole("contributor", "maintainer"),
  createIssue,
);
//router.patch("/:id/status", auth, authorizeRole("maintainer"), updateIssue);
router.get("/issue/:id", getIssueById);

router.patch(
  "/issue/:id",
  auth,
  authorizeRole("contributor", "maintainer"),
  updateIssue,
);
router.delete("/issue/:id", auth, authorizeRole("maintainer"), deleteIssue);
export const IssueRoute = router;
