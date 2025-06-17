import { Request, Response } from "express";
import { CreateCartSchema, UpdateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Product } from "../generated/prisma";
import { prismaClient } from "..";

export const addItemToCart = async (req: Request, res: Response) => {
  const validData = CreateCartSchema.parse(req.body);
  let product: Product;
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validData.productId,
      },
    });
  } catch (error) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
  const cart = await prismaClient.cartItem.create({
    data: {
      userId: req.user?.id!,
      productId: product.id,
      quantity: validData.quantity,
    },
  });

  res.json(cart);
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  try {
    const cart = await prismaClient.cartItem.findFirstOrThrow({
      where: {
        id: parseInt(req.params.id),
      },
    });
    await prismaClient.cartItem.delete({
      where: {
        id: cart.id,
      },
    });
    res.json({ success: true });
  } catch (error) {
    throw new NotFoundException("Cart not found", ErrorCode.CART_NOT_FOUND);
  }
};

export const changeQuantity = async (req: Request, res: Response) => {
  const validData = UpdateCartSchema.parse(req.body);
  try {
    const cart = await prismaClient.cartItem.findFirstOrThrow({
      where: {
        id: parseInt(req.params.id),
      },
    });
    await prismaClient.cartItem.update({
      where: {
        id: cart.id,
      },
      data: validData,
    });
    res.json({ success: true });
  } catch (error) {
    throw new NotFoundException("Cart not found", ErrorCode.CART_NOT_FOUND);
  }
};

export const getCart = async (req: Request, res: Response) => {
  const carts = await prismaClient.cartItem.findMany({
    where: {
      id: req.user?.id,
    },
    include: {
      product: true,
    },
  });
  res.json(carts);
};
