import { Request, Response } from "express";
import database from "../database/database";
import { QueryConfig } from "pg";
import ProdutType from "../types/ProductType";
import SaleType from "../types/SaleType";
class SalesController {
  public static async searchSale(forma_pagamento : string, data_venda : Date, status_venda :string, hora_venda : string, valor : number , id: number , id_produto_vendido : number) {
    let mudancas: Array<string> = [];
    let values: Array<string | number | Date> = [];
    
    if(forma_pagamento) {
      mudancas.push("forma_pagamento");
      values.push(forma_pagamento);
    }

    if(data_venda) {
      mudancas.push("data_venda");
      values.push(data_venda);
    }

    if(status_venda) {
      mudancas.push("status_venda");
      values.push(status_venda);
    }

    if(hora_venda) {
      mudancas.push("hora_venda");
      values.push(hora_venda);
    }
    
    if(valor) {
      mudancas.push("valor");
      values.push(valor);
    }

    if(id) {
      mudancas.push("id");
      values.push(id);
    }

    if(id_produto_vendido) {
      mudancas.push("id_produto_vendido");
      values.push(id_produto_vendido);
    }
    
    let query = {} as QueryConfig;
    
    if(mudancas.length > 0) {
      query = {
        text: `SELECT * FROM vendas WHERE ${mudancas.map((alteracao, index) => alteracao + " = $" + Number(index + 1)).join(" AND ")}`,
        values: [...values]
      };
    } else {
      query = {
        text: 'SELECT * FROM vendas',
      };
    }

    const sales = await database.query(query).then(response => response);
    return sales.rows;
  }

  public static async registerSale(req: Request, res: Response) {
    const { forma_pagamento, valor, id_produto_vendido }: SaleType = req.body;
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
    const { forma_pagamento, data_venda, status_venda, hora_venda, valor , id , id_produto_vendido } : SaleType = req.body;
    let sales = await SalesController.searchSale(forma_pagamento, data_venda, status_venda, hora_venda, valor , id , id_produto_vendido);
  
    
    return res.status(200).json({ vendas: sales });	
  }
}

export default SalesController;