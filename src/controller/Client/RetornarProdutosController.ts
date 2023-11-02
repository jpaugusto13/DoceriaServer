import { Request, Response } from "express";
import { QueryConfig } from "pg";
import database from "../../db/db";

async function RetornarProdutosController(req: Request, res: Response) {
  try {
    let query = {} as QueryConfig;

    query = {
      text: `SELECT * FROM produtos`,
    };

    const produtos = await database.query(query);

    return res.status(200).json({ produtos: produtos.rows });
  } catch (error) {
    console.error("Erro ao retornar produtos:", error);
    return res.status(500).json({ error: "Erro ao retornar produtos" });
  }
}

export default RetornarProdutosController