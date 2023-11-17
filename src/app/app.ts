import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import GetCategoryRouter from "../routes/category.router";

// Rotas ERP
import productRouter from "../routes/product.router";
import categoryRouter from "../routes/category.router";
import schedulingRouter from "../routes/scheduling.router";
import saleRouter from "../routes/sale.router";

import GetErpQRcodeRouter from "../routes/GetQRcodeRouter";
import iniciarChatBotRouter from "../routes/ChatBotRouter";
import usersRouter from "../routes/users.router";

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET","HEAD","PUT","PATCH","POST","DELETE"],
  credentials: true,
  optionsSuccessStatus: 204,
}));

app.use("/users", usersRouter);
app.use("/category", GetCategoryRouter);

app.use("/product", productRouter);
app.use("/erp", categoryRouter);
app.use("/scheduling", schedulingRouter);
app.use("/sales", saleRouter);

app.use("/erp", GetErpQRcodeRouter);
app.use("/erp", iniciarChatBotRouter);

export { app };
