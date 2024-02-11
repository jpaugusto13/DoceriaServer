// Importações do Controller
import { Request, Response } from "express";

// Importações de Ambiente
import database from "../database/database";
import { QueryConfig } from "pg";
import CategoryType from "../types/CategoryType";

class CategoryController {
  public static async createCategory(req: Request, res: Response) {
    const { name } : CategoryType = req.body; 

		let query = {
			text: `SELECT * FROM categorias WHERE categoria = $1`,
			values: [ name ],
		} as QueryConfig;

		await database.query(query).then(response => response.rows[0]).catch(() => res.sendStatus(404));

		query = {
			text: "INSERT INTO categorias (categoria) VALUES ($1)",
			values: [ name ],
		};

		await database.query(query).then(() => res.sendStatus(201)).catch(() => res.sendStatus(500));
  }

  public static async getCategory(req: Request, res: Response) {
    
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

		query = {
			text: "SELECT * FROM categories",
		} as QueryConfig;
		
		if(filtros.length > 0) {
      query = {
        text: `SELECT * FROM categories WHERE ${filtros.map((alteracao, index) => alteracao + " = $" + Number(index + 1)).join(" AND ")}`,
        values: [...values]
    	};
		}

		await database.query(query).then(response => res.status(200).json({ categorias: response.rows })).catch(() => res.sendStatus(500));
  }

  public static async updateCategory(req: Request, res: Response) {
		const { id, name } : CategoryType = req.body;

		let query = {
			text: `UPDATE produtos SET categoria = $1 WHERE id = $2;`,
			values: [ name, id],
		} as QueryConfig;
		
		await database.query(query).then(() => res.status(200).json({message: "Categoria alterada com sucesso!"})).catch(() => res.sendStatus(500));
	}

	public static async deleteCategory(req: Request, res: Response) {
		const { id } : CategoryType = req.body;

		let query = {
			text: 'DELETE FROM categorias WHERE id = $1',
			values: [ id ],
		} as QueryConfig;
			
    await database.query(query).then(() => res.status(200).json({})).catch(() => res.status(500).json({}));
	}
}

export default CategoryController;