import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";

import AccessType from "../types/AccessType";

dotenv.config();
const secretKey: string = process.env.SIGNATURE_KEY ?? "";

interface DecodedToken extends JwtPayload, AccessType {}

class AuthMidleware {
  private static verifyToken(authorization: string): string {
    const authBody: Array<string> = authorization?.split(" ");

    if (authBody.length !== 2 || !authBody[1]) return "";
    const [bearer, token] = authBody;

    if (bearer !== "Bearer") return "";
    
    const { role } = jwt.verify(token, secretKey) as DecodedToken;
    return role;
  }
  
  public static async authRoot(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    const response = authorization && AuthMidleware.verifyToken(authorization);
    
    const access = { role: response } as AccessType;
    const { role } = access;

    role == "root" ? next() : res.sendStatus(401);
  }

  public static async authAdmin(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    const response = authorization && AuthMidleware.verifyToken(authorization);
    
    const access = { role: response } as AccessType;
    const { role } = access;

    role == "admin" || role == "root" ? next() : res.sendStatus(401);
  }

  public static async authDefault(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    const response = authorization && AuthMidleware.verifyToken(authorization);
    
    const access = { role: response } as AccessType;
    const { role } = access;

    role == "admin" || role == "root" || role == "default" ? next() : res.sendStatus(401);
  }
}

export default AuthMidleware;
