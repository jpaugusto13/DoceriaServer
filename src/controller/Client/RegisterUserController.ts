import { Request, Response } from "express";
import RegisterUser from "../../types/RegisterUser";
import database from "../../db/db";
import { QueryConfig } from "pg";

async function registerUserController(req: Request, res: Response) {
  const {
    nome,
    sobrenome,
    email,
    cpf,
    aniversario,
    senha,
    telefone,
  }: RegisterUser = req.body;

  let query = {} as QueryConfig;

  query = {
    text: `SELECT * FROM usuarios WHERE email = $1`,
    values: [email],
  };

  const result = await database.query(query);

  if (result.rows.length !== 0)
    return res.status(409).json({ result: result.rows.length });

  query = {
    text: "INSERT INTO usuarios (nome, sobrenome, email, cpf, aniversario, senha, telefone) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    values: [nome, sobrenome, email, cpf, aniversario, senha, telefone],
  };

  await database
    .query(query)
    .then(() => {
      return res.status(201).json();
    })
    .catch((err) => {
      return res.status(400).json();
    });
}

export default registerUserController;
