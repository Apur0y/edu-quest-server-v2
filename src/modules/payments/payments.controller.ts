import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { PaymentsService } from "./payments.service";

/**
 * POST /create-ssl-payment
 * Fixed: original code never sent a response — this does.
 */
const createSSLPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentsService.initiateSSLPayment(req.body);
  res.send(result);
});

export const PaymentsController = { createSSLPayment };
