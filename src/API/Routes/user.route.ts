import { Router } from "express";
import { login, signUp, updateIssue } from "../Controller/User.controller";
import { auth, authorizeRole } from "../../Middleware/auth";

export const router = Router();


router.post("/signup", signUp)
router.get("/login", login)
router.patch(
  "/update/:id",
  auth,
  authorizeRole("contributor", "maintainer"),
  updateIssue,
);