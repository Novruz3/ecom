import { Request, Response } from "express";
import { prismaClient } from "..";
import { User } from "../generated/prisma";

interface AuthenticatedRequest extends Request {
  user: User;
}

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });
    if (cartItems.length == 0) {
      return res.json({ message: "Cart is empty" });
    }
    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);
    const address = await tx.address.findFirst({
      where : {
        id : req.user.defaultShippingAddress
      }
    })
  });
};
export const getOrders = async (req: Request, res: Response) => {};
export const cancelOrder = async (req: Request, res: Response) => {};
export const getOrderById = async (req: Request, res: Response) => {};
