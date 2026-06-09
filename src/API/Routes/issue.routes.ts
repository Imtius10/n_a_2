import { Router } from "express";
import { authorizeRole } from "../../Middleware/auth";

export const router = Router();


router.use("/", authorizeRole("contributor", "maintainer"),)


export const IssueRoute = router