import { Router } from "express";
import { login, signUp } from "../Controller/User.controller";

export const router = Router();


router.post("/signup", signUp)
router.get("/login",login)