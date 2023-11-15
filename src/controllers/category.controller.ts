// Importações do Controller
import { Request, Response } from "express";

// Importações de Ambiente
import database from "../database/database";
import { QueryConfig } from "pg";

type categoryType = {
  categoria: string;
  id: number;
}

class CategoryController {
  public static async registerCatogory(req: Request, res: Response) {
    const { categoria: novaCategoria } : categoryType = req.body; 

    try {
      const query = {
        text: `SELECT * FROM categorias WHERE categoria = $1`,
        values: [ novaCategoria.toLowerCase() ],
      };

      const response = await database.query(query);
      if (response.rows.length !== 0) {
        return res.status(409).json({ message: "Categoria já existe" });
      }

      const insertCategoriaQuery = {
        text: "INSERT INTO categorias (categoria) VALUES ($1)",
        values: [ novaCategoria.toLowerCase() ],
      };

      await database.query(insertCategoriaQuery);
      
      return res.status(201).json({ message: "Categoria criada com sucesso!" });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao processar a requisição: " + error });
    }
  }
  
  public static async getCategory(req: Request, res: Response) {
    try {
      let query = {} as QueryConfig;
  
      query = {
        text: `SELECT * FROM categorias`,
      };
  
      const categorias = await database.query(query);
      
      return res.status(200).json({ categorias: categorias.rows });
    } catch (error) {
      console.error("Erro ao retornar categorias:", error);
      return res.status(500).json({ error: "Erro ao retornar categorias" });
    }
  }
}

export default CategoryController;