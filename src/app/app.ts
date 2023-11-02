import express from "express";
import cors from "cors";

// Rotas Client
import registerRouter from "../router/Client/registerClientRouter";
import loginClientRouter from "../router/Client/loginClientRouter";
import retornarProdutosRouter from "../router/Client/retornarProdutosRouter";

// Rotas ERP
import loginErpRouter from "../router/ERP/LoginErpRouter";
import SignErpProductRouter from "../router/ERP/SignErpProductRouter";
import SignErpKitRouter from "../router/ERP/SignErpKitRouter";
import SignErpKitController from "../controller/ERP/SignErpKitController";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*"
}));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Status: ON\nRota: ");
});

app.use("/client", registerRouter);
app.use("/client", loginClientRouter);
app.use("/client", retornarProdutosRouter);

app.use("/erp", loginErpRouter);
app.use("/erp", SignErpProductRouter);
app.use("/erp", SignErpKitRouter);

export { app };
