import { Request, Response } from "express";
import database from "../database/database";
import { QueryConfig } from "pg";

type SchedulingType = {
  id: number;
  nome_cliente: string;
  numero_contato: number;
  data_busca: Date 
  hora_entrega: string
  data_agendamento: Date
}

class SchedulingController {
  public static async createScheduling(req: Request, res: Response) {
    const { nome_cliente, numero_contato, data_busca, hora_entrega }: SchedulingType = req.body;

    const date = new Date();

    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    let hour = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes.toString().padStart(2, '0');

    const data_agendamento = `${year}-${month}-${day}`;
    const hora_agendamento = `${hour}:${minutes}`;
    
    let query = {
      text: "INSERT INTO agendamento (nome_cliente, numero_contato, data_busca, hora_entrega, data_agendamento, hora_agendamento) VALUES ($1, $2, $3, $4, $5, $6)",
      values: [nome_cliente, numero_contato, data_busca, hora_entrega, data_agendamento, hora_agendamento]
    } as QueryConfig;

    await database.query(query).then(() => res.status(201).json({})).catch((e) => res.status(500).json({ error: e }));
  }
}

export default SchedulingController;