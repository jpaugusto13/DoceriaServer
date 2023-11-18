import { Request, Response, response } from "express";
import database from "../database/database";
import { QueryConfig } from "pg";
import ProdutType from "../types/ProductType";
import SaleType from "../types/SaleType";
class SalesController {
  public static async registerSale(req: Request, res: Response) {
    const { forma_pagamento, id_produto_vendido }: SaleType = req.body;
    let query = {
      text: 'SELECT * FROM produtos WHERE id = $1',
      values: [id_produto_vendido],
    } as QueryConfig;
  
    const produtoVendido: ProdutType = await database.query(query).then(response => response.rows[0]);
    
    if(produtoVendido.quantidade < 1) return res.status(400).json({error: "O produto não está em estoque"});
    
    query = {
      text: "INSERT INTO vendas (forma_pagamento, valor_venda, id_produto_vendido, status_venda) VALUES ($1, $2, $3, $4)",
      values: [forma_pagamento, produtoVendido.preco, id_produto_vendido, "concluída"]
    };
    
    await database.query(query).then(async () => {
      query = {
        text: 'UPDATE produtos SET quantidade = $1 WHERE id = $2',
        values: [(produtoVendido.quantidade - 1), id_produto_vendido],
      };

      await database.query(query).then(() => res.status(200).json({})).catch((e) => res.status(500).json({ error: e }));
    }).catch((e) => res.status(500).json({ error: e }));
  }

  public static async getSale(req: Request, res: Response) {
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
			text: "SELECT * FROM vendas",
		} as QueryConfig;
		
		if(filtros.length > 0) {
      query = {
        text: `SELECT * FROM vendas WHERE ${filtros.map((alteracao, index) => alteracao + " = $" + Number(index + 1)).join(" AND ")}`,
        values: [...values]
    	};
		}

		await database.query(query).then(response => res.status(200).json({ vendas: response.rows })).catch(() => res.sendStatus(500));
  }

  public static async updateSale(req: Request, res: Response) {
		const produtoRequest : SaleType = req.body;
		
    if(produtoRequest.status_venda == "cancelada") return res.sendStatus(401);

		let query = {
      text: `SELECT * FROM vendas WHERE id = $1`,
      values: [produtoRequest.id],
    } as QueryConfig;


		try {
			const venda = await database.query(query).then(response => response.rows[0]);

			const changes: string[] = [];
			const values: (string | number | Date)[] = [];
			
			for (const [field, value] of Object.entries(produtoRequest)) {
				if (value !== undefined && (field !== "id" && field !== "data_venda" && field !== "hora_venda" && field !== "valor_venda")) {
					changes.push(field);
					values.push(value);
				}
			}

			const setClause = changes.map((change, index) => `${change} = $${index + 1}`).join(', ');
			const queryText = `UPDATE vendas SET ${setClause} WHERE id = $${changes.length + 1};`;

			query = {
				text: queryText,
				values: [...values, produtoRequest.id],
			};
				
			await database.query(query);

			query = {
				text: `SELECT * FROM vendas WHERE id = $1`,
				values: [produtoRequest.id],
			} as QueryConfig;
			
			const vendaAlterada = await database.query(query).then(response => response.rows[0]);
			
			res.status(200).json({ message: "Venda alterada com sucesso!", venda: venda, alteracoes: changes, vendaAlterada: vendaAlterada});
		} catch (error) {
			res.status(500).json({ error: "Erro interno do servidor" });
		}
	}

  public static async cancelProduct(req: Request, res: Response) {
		const { id } : SaleType = req.body;

    let query = {
      text: `UPDATE vendas SET status_venda = $1 WHERE id = $2};`,
      values: ["cancelada", id],
    } as QueryConfig;
			
    await database.query(query).then(() => res.status(200).json({})).catch((e) => res.status(500).json({ error: e }));
	}
}

export default SalesController;