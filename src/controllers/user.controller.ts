import { Request, Response } from "express";
import { QueryConfig } from "pg";
import database from "../database/database";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import UserType from "../types/UserType";

dotenv.config();
const secretKey = process.env.SIGNATURE_KEY;

class UserControler {
  public static async login(req: Request, res: Response) {
    const { email, senha } : UserType = req.body;

    if(!email) return res.status(400).json({ erro: `Email não encontrado ` });

    let query = {
      text: `SELECT * FROM usuarios WHERE email = $1`,
      values: [email],
    } as QueryConfig;

    const result = await database.query(query);

    if (result.rows.length === 0) return res.status(404).json({ erro: `${email} não encontrado ` });
    
    const user : UserType = result.rows[0];

    if (senha === user.senha && typeof secretKey == "string") {
      const acessToken = jwt.sign({ acesso: user.acesso }, secretKey, { expiresIn: "10h" });
      return res.status(200).json({ token: acessToken });
    }

    return res.status(401).json({error: "Senha incorreta!"});
  }

  public static async register(req: Request, res: Response) {
    const { nome, sobrenome, email, cpf, aniversario, senha, telefone, acesso } : UserType = req.body;
  
    let query = {
      text: `SELECT * FROM usuarios WHERE email = $1`,
      values: [email],
    } as QueryConfig;
  
    const response = await database.query(query);
  
    if (response.rows.length !== 0) return res.status(409).json({ response: response.rows.length });
  
    query = {
      text: "INSERT INTO usuarios (nome, sobrenome, email, cpf, aniversario, senha, telefone, acesso) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      values: [nome, sobrenome, email, cpf, aniversario, senha, telefone, acesso],
    };
  
    await database.query(query).then(() => res.status(201).json()).catch(() => res.status(500).json({}));
  }
}

export default UserControler;