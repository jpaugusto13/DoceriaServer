// Importações do Controller
import { Request, Response } from "express";

// Importações de Ambiente
import database from "../database/database";
import { QueryConfig } from "pg";
import CategoryType from "../types/CategoryType";

class CategoryController {
  // Método para criar categoria
  public static async registerCategory(req: Request, res: Response) {
    const { categoria } : CategoryType = req.body; 
      let query = {
        text: `SELECT * FROM categorias WHERE categoria = $1`,
        values: [ categoria.toLowerCase() ],
      } as QueryConfig;

      await database.query(query)
      .then(response => response.rows.length !== 0 ? res.status(409).json({ message: "Categoria já existe" }) : {})
      .catch(() => res.sendStatus(500));

      query = {
        text: "INSERT INTO categorias (categoria) VALUES ($1)",
        values: [ categoria.toLowerCase() ],
      };

      await database.query(query).then(() => res.status(201).json({ message: "Categoria criada com sucesso!" })).catch(() => res.sendStatus(500));
  }

  // Método para retonar categoria
  public static async getCategory(req: Request, res: Response) {
    let query = { 
      text: `SELECT * FROM categorias`,
    } as QueryConfig;

    await database.query(query).then(response => res.status(200).json({ categorias: response.rows })).catch(() => res.sendStatus(500));
  }

  // Método para atualizar categoria
  public static async updateCategory(req: Request, res: Response) {
		const { id, categoria } : CategoryType = req.body;

		let query = {
			text: `UPDATE produtos SET categoria = $1 WHERE id = $2;`,
			values: [ categoria, id],
		} as QueryConfig;
		
		await database.query(query).then(() => res.status(200).json({message: "Categoria alterada com sucesso!"})).catch(() => res.sendStatus(500));
	}

  // Método para deletar categoria
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