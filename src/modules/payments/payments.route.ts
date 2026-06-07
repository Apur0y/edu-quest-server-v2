import { Router } from "express";
import { PaymentsController } from "./payments.controller";

const router = Router();

router.post("/create-ssl-payment", PaymentsController.createSSLPayment);

export default router;
