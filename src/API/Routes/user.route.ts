import { Router } from "express";
import { login, signUp, } from "../Controller/User.controller";
import { auth, authorizeRole } from "../../Middleware/auth";
import { updateIssue } from "../Controller/Issue.Controller";

export const router = Router();


router.post("/auth/signup", signUp);
router.get("/auth/login", login);
router.patch(
  "/issues/:id",
  auth,
  authorizeRole("contributor", "maintainer"),
  updateIssue,
);