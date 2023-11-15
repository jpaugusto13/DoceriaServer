import { Request, Response } from "express";

import database from "../database/database";
import { QueryConfig } from "pg";

class ProdutoController {
	public static async registerProduct(req: Request, res: Response) {
		try {
			const { name, price, discount, description, imagem } = req.body;

			const insertProductQuery = {
					text: "INSERT INTO produtos (nome, preco, desconto, descricao, imagem, quantidade) VALUES ($1, $2, $3, $4, $5, $6)",
					values: [name, price, discount, description, imagem, 0],
			};

			await database.query(insertProductQuery);

			res.status(201).json({ message: "Produto criado com sucesso!" });
		} catch (error) {
			res.sendStatus(500);
		}
	}

	public static async getProduct(req: Request, res: Response) {
		try {
			let query = {
				text: `SELECT * FROM produtos`,
			} as QueryConfig;
	
			const produtos = await database.query(query);
			
			return res.status(200).json({ produtos: produtos.rows });
		} catch (error) {
			return res.status(500).json({ error: "Erro ao retornar produtos" });
		}
	}
}

export default ProdutoController;
