import { Router } from "express";
import { signUp } from "../Controller/UserReg.controller";

export const router = Router();


router.post("/",signUp)