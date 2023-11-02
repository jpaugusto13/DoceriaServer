import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import decodedUser from "../types/decodedUser";

dotenv.config();
const secretKey = process.env.SIGNATURE_KEY;

function verifyToken(authorization: string): decodedUser | null {
  const authBody: Array<string> = authorization?.split(" ");

  if (authBody.length !== 2) return null;
  const [bearer, token] = authBody;

  if (bearer !== "Bearer") return null;

  if (typeof secretKey === "string") {
    try {
      const decoded = jwt.verify(token, secretKey) as decodedUser;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  return null;
}

function authMiddlewareAdmin(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  if (!authorization) return res.send(401);

  const decodedUserResult = verifyToken(authorization);

  if (!decodedUserResult) return res.send(401);

  const { userType } = decodedUserResult;
  if (userType === "admin") next();
  return res.send(401);
}

export { authMiddlewareAdmin };
