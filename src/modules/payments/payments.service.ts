import axios from "axios";
import { ObjectId } from "bson";
import prisma from "../../config/db";

interface PaymentInfo {
  registrationFee: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  enrollmentId?: string;
  [key: string]: unknown;
}

interface SSLCommerzInitiate {
  store_id: string;
  store_passwd: string;
  total_amount: number;
  currency: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  shipping_method: string;
  product_name: string;
  product_category: string;
  product_profile: string;
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_city: string;
  cus_state: string;
  cus_postcode: string;
  cus_country: string;
  cus_phone: string;
  cus_fax: string;
  ship_name: string;
  ship_add1: string;
  ship_city: string;
  ship_state: string;
  ship_postcode: number;
  ship_country: string;
}

/**
 * POST /create-ssl-payment
 * Fixed version of original: now actually sends a response.
 */
const initiateSSLPayment = async (payment: PaymentInfo) => {
  const trxId = new ObjectId().toString();
  const baseUrl = process.env.SSLCOMMERZ_BASE_URL || "https://sandbox.sslcommerz.com";
  const storeId = process.env.SSLCOMMERZ_STORE_ID || "eduqu67a83aebd8483";
  const storePass = process.env.SSLCOMMERZ_STORE_PASS || "eduqu67a83aebd8483@ssl";

  const initiate: SSLCommerzInitiate = {
    store_id: storeId,
    store_passwd: storePass,
    total_amount: payment.registrationFee,
    currency: "BDT",
    tran_id: trxId,
    success_url: process.env.SSLCOMMERZ_SUCCESS_URL || "http://localhost:3000/payment/success",
    fail_url: process.env.SSLCOMMERZ_FAIL_URL || "http://localhost:3000/payment/fail",
    cancel_url: process.env.SSLCOMMERZ_CANCEL_URL || "http://localhost:3000/payment/cancel",
    ipn_url: process.env.SSLCOMMERZ_IPN_URL || "http://localhost:5000/payment/ipn",
    shipping_method: "Courier",
    product_name: "Course Registration",
    product_category: "Education",
    product_profile: "general",
    cus_name: payment.customerName || "Customer Name",
    cus_email: payment.customerEmail || "customer@example.com",
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: payment.customerPhone || "01711111111",
    cus_fax: "01711111111",
    ship_name: payment.customerName || "Customer Name",
    ship_add1: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const response = await axios.post(
    `${baseUrl}/gwprocess/v4/api.php`,
    initiate,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  // Record pending payment in DB if enrollmentId provided
  if (payment.enrollmentId) {
    await prisma.payment.upsert({
      where: { enrollmentId: payment.enrollmentId as string },
      update: { transactionId: trxId, status: "pending" },
      create: {
        enrollmentId: payment.enrollmentId as string,
        amount: payment.registrationFee,
        transactionId: trxId,
        status: "pending",
        method: "sslcommerz",
      },
    });
  }

  return {
    transactionId: trxId,
    gatewayUrl: response.data?.GatewayPageURL,
    status: response.data?.status,
    data: response.data,
  };
};

export const PaymentsService = { initiateSSLPayment };
