import { app } from "./app/app";
import database from "./db/db";
import dotenv from "dotenv";

dotenv.config();

database
  .connect()
  .then(() => {
    console.log("Banco conectado")})
  .catch((erro) => {
    console.log("ERRO AO SE CONECTAR NO BANCO: " + erro)
  });

  app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando http://localhost:${process.env.PORT}`);
  });
