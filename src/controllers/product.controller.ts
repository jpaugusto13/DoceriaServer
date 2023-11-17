import { Request, Response } from "express";

import database from "../database/database";
import { QueryConfig } from "pg";
import ProdutType from "../types/ProductType";

class ProdutoController {
	public static async registerProduct(req: Request, res: Response) {
		const { nome, preco, desconto, descricao, imagem , doce_raro, categoria} : ProdutType = req.body;

		let query = {
			text: "INSERT INTO produtos (nome, preco, desconto, descricao, imagem, quantidade, doce_raro, categoria) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
			values: [nome, preco, desconto, descricao, imagem, 0, 0, "aa"]
		} as QueryConfig;


		await database.query(query).then(() => res.status(201).json({ message: "Produto criado com sucesso!" })).catch(() => res.sendStatus(500));
		
	}

	public static async getProduct(req: Request, res: Response) {
		let query = {
			text: "SELECT * FROM produtos",
		} as QueryConfig;

		await database.query(query).then(response => res.status(200).json({ produtos: response.rows })).catch(() => res.sendStatus(500));		
	}

	public static async updateProduct(req: Request, res: Response) {
		const { id, nome, preco, descricao, imagem } : ProdutType = req.body;
		let mudancas: Array<string> = [];
		let values: Array<string | number> = [];

		if(nome) {
			mudancas.push("nome"); 
			values.push(nome);
		}

		if(preco) {
			mudancas.push("preco"); 
			values.push(preco);
		}

		if(descricao) {
			mudancas.push("descricao"); 
			values.push(descricao);
		}

		if(imagem) {
			mudancas.push("imagem"); 
			values.push(imagem);
		}

		let query = {
			text: `UPDATE produtos SET ${mudancas.map((alteracao, index) => alteracao+" = $"+Number(index+1))} WHERE id = $${mudancas.length+1};`,
			values: [ ...values, id],
		} as QueryConfig;
		

		await database.query(query).then(() => res.status(200).json({message: "Produto alterado com sucesso!", alteracoes: [...mudancas], valores: [...values]})).catch((e) => res.status(500).json({ error: e }));
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
