import { Router } from "express";
import { auth, authorizeRole } from "../../Middleware/auth";
import { createIssue } from "../Controller/Issue.Controller";

export const router = Router();


router.use("/createIssue",auth ,authorizeRole("contributor", "maintainer"),createIssue)


export const IssueRoute = router