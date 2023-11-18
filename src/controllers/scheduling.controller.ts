import { Request, Response, response } from "express";
import database from "../database/database";
import { QueryConfig } from "pg";

import SchedulingType from "../types/SchedulingType";
class SchedulingController {
  public static async searchScheduling(nome_cliente? : string, data_busca?: Date, hora_entrega?: string ) {
    let mudancas: Array<string> = [];
    let values: Array<string | number | Date> = [];
    
    if(nome_cliente) {
      mudancas.push("nome_cliente");
      values.push(nome_cliente);
    }

    if(data_busca) {
      mudancas.push("data_busca");
      values.push(data_busca);
    }

    if(hora_entrega) {
      mudancas.push("hora_entrega");
      values.push(hora_entrega);
    }

    let query = {
      text: `SELECT * FROM agendamentos WHERE ${mudancas.map((alteracao, index) => alteracao + " = $" + Number(index + 1)).join(" AND ")}`,
      values: [...values]
    } as QueryConfig;

    const schedulings = await database.query(query).then(response => response.rows);
    return schedulings;
  }

  public static async createScheduling(req: Request, res: Response) {
    const { nome_cliente, numero_contato, data_busca, hora_entrega }: SchedulingType = req.body;
    const date = new Date();

    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    let hour = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');

    const data_agendamento = `${year}-${month}-${day}`;
    const hora_agendamento = `${hour}:${minutes}`;
    
    let query = {
      text: "INSERT INTO agendamentos (nome_cliente, numero_contato, data_busca, hora_entrega, data_agendamento, hora_agendamento) VALUES ($1, $2, $3, $4, $5, $6)",
      values: [nome_cliente, numero_contato, data_busca, hora_entrega, data_agendamento, hora_agendamento]
    } as QueryConfig;

    await database.query(query).then(() => res.status(201).json({})).catch((e) => res.status(500).json({ error: e }));
  }

  public static async getScheduling(req: Request, res: Response) {

  }
}

export default SchedulingController;