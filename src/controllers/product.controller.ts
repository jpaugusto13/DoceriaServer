import { Request, Response } from "express";
import { QueryConfig } from "pg";

import database from "../database/database";
import ProdutType from "../types/ProductType";

class ProductController {
	public static async createProduct(req: Request, res: Response) {
		const { name, price, image, description, category } : ProdutType = req.body;
		
		let query = {
			text: "SELECT * FROM categories WHERE name = $1",
			values: [ category ]
		} as QueryConfig;
	
		await database.query(query).then().catch(() => res.sendStatus(404));
		
		query = {
			text: "INSERT INTO products (name, price, image, stock, description, category, sales_quantity, discount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
			values: [ name, price, image, 0, description, category, 0, 0 ]
		};

		await database.query(query).then(() => res.status(201)).catch(() => res.sendStatus(500));
	}

	public static async getProduct(req: Request, res: Response) {
		const filtroRequest = req.query;
		
		const filtros: string[] = [];
		const values: (string | number)[] = [];

		let query = {} as QueryConfig;

		for (const [field, value] of Object.entries(filtroRequest)) {
			if (value !== undefined) {
				const typedValue: string | number = typeof value === 'string' ? value : Number(value);

				filtros.push(field);
				values.push(typedValue);
			}
		}	

		if(filtros.length == 0) {
			query = {
				text: "SELECT * FROM products",
			} as QueryConfig;
		} else {	
      query = {
        text: `SELECT * FROM products WHERE ${filtros.map((alteracao, index) => alteracao + " = $" + Number(index + 1)).join(" AND ")}`,
        values: [...values]
    	};
		}

		await database.query(query).then(response => res.status(200).json({ response: response.rows })).catch(() => res.sendStatus(500));		
	}

	public static async updateProduct(req: Request, res: Response) {
		const produtoRequest : ProdutType = req.body;
		
		let query = {
      text: `SELECT * FROM products WHERE id = $1`,
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
			const queryText = `UPDATE products SET ${setClause} WHERE id = $${changes.length + 1};`;

			query = {
				text: queryText,
				values: [...values, produtoRequest.id],
			};
				
			await database.query(query);

			query = {
				text: `SELECT * FROM products WHERE id = $1`,
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
			text: 'DELETE FROM products WHERE id = $1',
			values: [ id ],
		} as QueryConfig;
			
    await database.query(query).then(() => res.status(200).json({})).catch((e) => res.status(500).json({ error: e }));
	}
}

export default ProductController;
