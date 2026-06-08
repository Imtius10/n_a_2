import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../GlobalError/SuccessAndError";
import { signToken } from "../../Utils/jwt";
import UserService from "../Service/User.Service";

export const signUp = async (req: Request, res: Response) => {
  const user = await UserService.createUser(req.body);
  if (!user) {
    return sendError(res, 404, "User profile not found");
  }

  sendSuccess(res, 200, "User profile retrieved successfully", user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await UserService.loginValidator(email, password);
    console.log(user);

    if (!user) {
      return sendError(res, 400, "invalid password or email");
    }

    const { accessToken, refresToken } = signToken(user);
    res.cookie("refreshToken", refresToken, {
      sameSite: "lax",
      httpOnly: true,
      secure: false,
    });
    const result = {
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
    sendSuccess(res, 200, "Login successful", result);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error", error);
  }
};
