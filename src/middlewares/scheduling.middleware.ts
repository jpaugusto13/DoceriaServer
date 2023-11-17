import { NextFunction, Request, Response } from "express";
import SchedulingType from "../types/SchedulingType";
import SchedulingController from "../controllers/scheduling.controller";

class SchedulingMiddleware {
  public static async verifyScheduling(req: Request, res: Response, next: NextFunction) {
    const { nome_cliente, data_busca, hora_entrega }: SchedulingType = req.body;
    
    let search = await SchedulingController.searchScheduling(nome_cliente, data_busca, hora_entrega);
    if(search.length > 0) return res.status(409).json({error: "Agendamento duplicado!"});
  
    search = await SchedulingController.searchScheduling("", data_busca, hora_entrega);
    if(search.length > 0) return res.status(409).json({error: "Já possuí um agendamento para esse horário!"});
    
    search = await SchedulingController.searchScheduling("", data_busca);
    if(search.length === 5) return res.status(400).json({error: "O limite de agendamento é apenas 5!"});

    next();
  }
}

export default SchedulingMiddleware;