import { Request, Response } from "express";
import { LoginErp } from "../../types/Login";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SIGNATURE_KEY;

async function loginErpController(req: Request, res: Response) {
  const { user, password }: LoginErp = req.body;

  if (user === "admin" && password === "admin" && typeof secretKey == "string") {
    const acessToken = jwt.sign({ user }, secretKey, {
      expiresIn: "8h",
    });

    return res.status(200).json({ token: acessToken });
  }
  
  return res.status(401).json({ message: "Usuário não autorizado"});
}

export default loginErpController;
