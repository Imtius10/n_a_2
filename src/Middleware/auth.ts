import type { NextFunction, Request, Response } from "express";
import { sendError } from "../GlobalError/SuccessAndError";
import { verifyToken } from "../Utils/jwt";
import type { Role, RUser } from "../type/type";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return sendError(res,401,"Access Token missing")
        }
       // const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader
        const payload = verifyToken(authHeader, "access")
          req.user = {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            role: payload.role,
          };

          next();
        
    } catch (error) {
        return sendError(res,401,"Invalid access token",error)
    }
}


export const authorizeRole = (...roles: Role[]) => {
    return (
        req: Request,
        res: Response,
        next:NextFunction
    ) => {
         if (!req.user) {
           return sendError(res, 401, "Unauthorized");
         }

         if (!roles.includes(req.user.role)) {
           return sendError(res, 403, "Forbidden");
         }
        next();
    }
}