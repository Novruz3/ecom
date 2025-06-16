import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrders,
} from "../controllers/order.cont";

const orderRoutes: Router = Router();

orderRoutes.post("/", [authMiddleware], errorHandler(createOrder));
orderRoutes.get("/", [authMiddleware], errorHandler(getOrders));
orderRoutes.post("/:id", [authMiddleware], errorHandler(cancelOrder));
orderRoutes.post("/:id", [authMiddleware], errorHandler(getOrderById));

export default orderRoutes;
