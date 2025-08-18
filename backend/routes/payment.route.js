import express from "express";
import isAuth from "../middleware/isAuth.js";
import { RazorpayOrder, verifyPayment } from "../controller/order.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/razorpay-order",isAuth,RazorpayOrder)
paymentRouter.post("/verify-payment",isAuth,verifyPayment)

export default paymentRouter;