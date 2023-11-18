import { Request, Response, response } from "express";

import database from "../database/database";
import { Query, QueryConfig } from "pg";
import ProdutType from "../types/ProductType";

class ProdutoController {
	public static async registerProduct(req: Request, res: Response) {
		const { nome, preco, desconto, descricao, imagem , doce_raro, categoria } : ProdutType = req.body;

		let query = {
			text: "INSERT INTO produtos (nome, preco, desconto, descricao, imagem, quantidade, doce_raro, categoria) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
			values: [nome, preco, desconto, descricao, imagem, 0, doce_raro, categoria]
		} as QueryConfig;

		await database.query(query).then(() => res.status(201).json({ message: "Produto criado com sucesso!" })).catch(() => res.sendStatus(500));
	}

	public static async getProduct(req: Request, res: Response) {
		const filtroRequest: ProdutType = req.body;
		
		const filtros: string[] = [];
		const values: (string | number)[] = [];

		let query = {} as QueryConfig;

		for (const [field, value] of Object.entries(filtroRequest)) {
			if (value !== undefined) {
				filtros.push(field);
				values.push(value);
			}
		}

		query = {
			text: "SELECT * FROM produtos",
		} as QueryConfig;
		
		if(filtros.length > 0) {
      query = {
        text: `SELECT * FROM produtos WHERE ${filtros.map((alteracao, index) => alteracao + " = $" + Number(index + 1)).join(" AND ")}`,
        values: [...values]
    	};
		}

		await database.query(query).then(response => res.status(200).json({ produtos: response.rows })).catch(() => res.sendStatus(500));		
	}

	public static async updateProduct(req: Request, res: Response) {
		const produtoRequest : ProdutType = req.body;
		
		let query = {
      text: `SELECT * FROM produtos WHERE id = $1`,
      values: [produtoRequest.id],
    } as QueryConfig;

		try {
			const produto = await database.query(query).then(response => response.rows[0]);

			const changes: string[] = [];
			const values: (string | number)[] = [];
			
			for (const [field, value] of Object.entries(produtoRequest)) {
				if (value !== undefined && field !== "id") {
					changes.push(field);
					values.push(value);
				}
			}

			const setClause = changes.map((change, index) => `${change} = $${index + 1}`).join(', ');
			const queryText = `UPDATE produtos SET ${setClause} WHERE id = $${changes.length + 1};`;

			query = {
				text: queryText,
				values: [...values, produtoRequest.id],
			};
				
			await database.query(query);

			query = {
				text: `SELECT * FROM produtos WHERE id = $1`,
				values: [produtoRequest.id],
			} as QueryConfig;
			
			const produtoAlterado = await database.query(query).then(response => response.rows[0]);
			
			res.status(200).json({ message: "Produto alterado com sucesso!", produto: produto, alteracoes: changes, produtoAlterado: produtoAlterado});
		} catch (error) {
			res.status(500).json({ error: "Erro interno do servidor" });
		}
	}
	

	public static async deleteProduct(req: Request, res: Response) {
		const { id } : ProdutType = req.body;

		let query = {
			text: 'DELETE FROM produtos WHERE id = $1',
			values: [ id ],
		} as QueryConfig;
			
    await database.query(query).then(() => res.status(200).json({})).catch((e) => res.status(500).json({ error: e }));
	}
}

export default ProdutoController;
