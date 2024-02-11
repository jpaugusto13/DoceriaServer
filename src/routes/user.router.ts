import { Router } from "express";
import UserControler from "../controllers/user.controller";

const usersRouter = Router();
usersRouter.post("/login", UserControler.accessEmployee);

export default usersRouter;