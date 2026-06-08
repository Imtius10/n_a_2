import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../Config/config.index";
import type { RUser } from "../type/type";

export const verifyToken = (token: string, type: "access" | "refresh") => {
  const secret = type === "access" ? config.jwt_secret : config.jwt_refresh;
  const decode = jwt.verify(token, secret);
  return decode as JwtPayload;
};

export const signToken = (payload: RUser & { id: number }) => {
  const accessToken = jwt.sign(payload, config.jwt_secret, {
    expiresIn: "1d",
  });
  const refresToken = jwt.sign(payload, config.jwt_refresh, {
    expiresIn: "3d",
  });

  return { accessToken, refresToken };
};
