import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../GlobalError/SuccessAndError";
import UserService from "../Service/User.Service";

export const signUp = async (req: Request, res: Response) => {
  
    const user = await UserService.createUser(req.body)
   if (!user) {
    
     return sendError(res, 404, "User profile not found");
   }

  
   sendSuccess(res, 200, "User profile retrieved successfully", user);
   
 
};
