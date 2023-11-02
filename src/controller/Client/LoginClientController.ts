import { Request, Response } from "express";
import { LoginUser } from "../../types/Login";
import { QueryConfig } from "pg";

import database from "../../db/db";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SIGNATURE_KEY;

async function loginClientController(req: Request, res: Response) {
  const { email, password }: LoginUser = req.body;

  let query = {} as QueryConfig;

  query = {
    text: `SELECT * FROM usuarios WHERE email = $1`,
    values: [email],
  };

  const result = await database.query(query);

  if (result.rows.length === 0) return res.status(404).json({ erro: `${email} não encontrado ` });
  
  const user = result.rows[0];
  const { senha } = user;

  if (password === senha && typeof secretKey == "string") {
    const acessToken = jwt.sign({ email }, secretKey, {
      expiresIn: "10h",
    });
    
    return res.status(200).json({ token: acessToken });
  }
  return res.status(401).json({});
}

export default loginClientController;
