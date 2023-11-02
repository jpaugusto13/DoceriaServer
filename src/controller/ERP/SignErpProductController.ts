import { Request, Response } from "express";
import database from "../../db/db";

async function SignErpProductController(req: Request, res: Response) {
  const { name, price, discount, description } = req.body;

  const insertProductQuery = {
    text: "INSERT INTO produtos (nome, preco, desconto, descricao, quantidade) VALUES ($1, $2, $3, $4, $5)",
    values: [name, price, discount, description, 0],
  };

  await database.query(insertProductQuery).then(() => {
    return res.status(201).json({ message: "Produto criado com sucesso!" });
  }).catch((e) => {
    return res.status(400).json({ message: "Erro ao adicionar no banco\n"+e });
  });
}

export default SignErpProductController;
