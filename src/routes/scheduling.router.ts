import { Router } from "express";

import SchedulingController from "../controllers/scheduling.controller";
import AuthMidleware from "../middlewares/auth.middleware";

const schedulingRouter = Router();
schedulingRouter.post("/scheduling", AuthMidleware.authAdmin, SchedulingController.createScheduling);

export default schedulingRouter;
