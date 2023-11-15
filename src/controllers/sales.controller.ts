import { Request, Response } from "express";
import database from "../database/database";
import { QueryConfig } from "pg";
import ProdutType from "../types/ProductType";

type SalesType = {
  id: number;
  forma_pagamento: string;
  valor: number;
  data_venda: Date;
  hora_venda: string;
  id_produto_vendido: number;
  status_venda: "concluida" | "cancelada" | "analise";
}

class SalesController {
  public static async registerSale(req: Request, res: Response) {
    const { forma_pagamento, valor, id_produto_vendido }: SalesType = req.body;
    let query = {
      text: 'SELECT * FROM produtos WHERE id = $1',
      values: [id_produto_vendido],
    } as QueryConfig;
  
    const response = await database.query(query);
    const produtoVendido: ProdutType = response.rows[0];
    
    if(produtoVendido.quantidade < 1) return res.status(400).json({error: "O produto não está em estoque"});
    
    const date = new Date();

    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    
    let hour = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');

    const date_sale = `${year}-${month}-${day}`;
    const time_sale = `${hour}:${minutes}`;

    query = {
      text: "INSERT INTO vendas (forma_pagamento, valor, data_venda, hora_venda, id_produto_vendido, status_venda) VALUES ($1, $2, $3, $4, $5, $6)",
      values: [forma_pagamento, valor, date_sale, time_sale, id_produto_vendido, "concluída"]
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
 
  }
}

export default SalesController;