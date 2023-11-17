import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";

import AcessType from "../types/AcessType";

dotenv.config();
const secretKey: string = process.env.SIGNATURE_KEY ?? "";

interface DecodedToken extends JwtPayload, AcessType {}

class AuthMidleware {
  private static verifyToken(authorization: string): DecodedToken | null {
    const authBody: Array<string> = authorization?.split(" ");

    if (authBody.length !== 2 || !authBody[1]) return null;
    const [bearer, token] = authBody;

    if (bearer !== "Bearer") return null;

    try {
      const decoded = jwt.verify(token, secretKey) as DecodedToken;
      return decoded;
    } catch (error) {
      return null;
    }
  }
  
  public static async authRoot(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) return res.sendStatus(401);

    const response = AuthMidleware.verifyToken(authorization) as DecodedToken;
    if (!response) return res.sendStatus(401);
    
    const { acesso } = response;
    
    if (acesso == "root") {
      next();
    } else {
      res.sendStatus(401);
    }
  }

  public static async authAdmin(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) return res.sendStatus(401);

    const response = AuthMidleware.verifyToken(authorization) as DecodedToken;
    if (!response) return res.sendStatus(401);
    
    const { acesso } = response;

    if (acesso == "admin" || acesso == "root") {
      next();
    } else {
      res.sendStatus(401);
    }
  }

  public static async authPadrao(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) return res.sendStatus(401);

    const response = AuthMidleware.verifyToken(authorization) as DecodedToken;
    if (!response) return res.sendStatus(401);
    
    const { acesso } = response;

    if (acesso == "admin" || acesso == "root" || acesso == "padrao") {
      next();
    } else {
      res.sendStatus(401);
    }
  }
}

export default AuthMidleware;
