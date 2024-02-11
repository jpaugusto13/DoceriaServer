 import { Request, Response, response } from "express";
import { QueryConfig } from "pg";
import database from "../database/database";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import UserType from "../types/UserType";
import EmployeeType from "../types/EmployeeType";

dotenv.config();
const secretKey = process.env.SIGNATURE_KEY;

class EmployeeController {
  public static async accessEmployee(req: Request, res: Response) {
    const { email, password } : UserType = req.body;

    if(!email) return res.status(400).json({ erro: `Email não encontrado ` });

    let query = {
      text: `SELECT * FROM employees WHERE email = $1`,
      values: [ email ],
    } as QueryConfig;

    const employee : EmployeeType = await database.query(query).then(response => response.rows[0] ).catch(() => res.sendStatus(404));
     
    if (password === employee.cpf && typeof secretKey == "string") {
      const acessToken = jwt.sign({ acesso: employee.role }, secretKey, { expiresIn: "10h" });
      return res.status(200).json({ token: acessToken });
    }

    return res.sendStatus(401);
  }

  public static async register(req: Request, res: Response) {
    const { email } : UserType = req.body;
  
    let query = {
      text: `SELECT * FROM usuarios WHERE email = $1`,
      values: [email],
    } as QueryConfig;
  
    const response = await database.query(query);
  
    if (response.rows.length !== 0) return res.status(409).json({ response: response.rows.length });
  
    query = {
      text: "INSERT INTO usuarios (nome, sobrenome, email, cpf, aniversario, senha, telefone, acesso) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      values: [],
    };
  
    await database.query(query).then(() => res.status(201).json()).catch(() => res.status(500).json({}));
  }
}

export default EmployeeController;