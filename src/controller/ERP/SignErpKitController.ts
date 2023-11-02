import { Request, Response, response } from "express";
import database from "../../db/db";

async function SignErpKitController(req: Request, res: Response) {
  const { price, description } = req.body;

  const insertKitQuery = {
    text: "INSERT INTO kits (descricao, valor, imagem) VALUES ($1, $2, $3)",
    values: [ description, price, ""],
  };

  await database.query(insertKitQuery).then(() => {
    return res.status(201).json({ message: "Kit criado com sucesso!" });
  }).catch((e) => {
    return res.status(400).json({ message: "Erro ao adicionar no banco\n"+e });
  });
}

export default SignErpKitController;
