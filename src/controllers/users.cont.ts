import { Request, Response } from "express";
import {
  AddressSchema,
  ChangeUserRoleSchema,
  UpdateUserSchema,
} from "../schema/users";
import { prismaClient } from "..";
import { Address, User } from "../generated/prisma";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-requests";

interface AuthenticatedRequest extends Request {
  user?: User;
}

export const addAddress = async (req: AuthenticatedRequest, res: Response) => {
  AddressSchema.parse(req.body);
  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: req.user?.id,
    },
  });
  res.json(address);
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.json({ success: true });
  } catch (error) {
    throw new NotFoundException(
      "Address not found",
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }
};

export const getAllAddresses = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const addresses = await prismaClient.address.findMany({
    where: {
      userId: req.user?.id,
    },
  });
  res.json(addresses);
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const validData: any = UpdateUserSchema.parse(req.body);
  let shippingAddress: Address;
  let billingAddress: Address;
  if (validData.defaultBilliningAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validData.defaultBilliningAddress,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        "Address not found",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
    if (billingAddress.userId != req.user?.id) {
      throw new BadRequestsException(
        "Address does not belong",
        ErrorCode.ADDRESS_DOES_NOT_BELONG
      );
    }
  }
  if (validData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validData.defaultShippingAddress,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        "Address not found",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
    if (shippingAddress.userId != req.user?.id) {
      throw new BadRequestsException(
        "Address does not belong",
        ErrorCode.ADDRESS_DOES_NOT_BELONG
      );
    }
  }
  const updatedUser = await prismaClient.user.update({
    where: {
      id: req.user?.id,
    },
    data: validData,
  });
  res.json(updatedUser);
};

export const getAllUsers = async (req: Request, res: Response) => {
  const skip = parseInt(req.query.skip as string) || 0;
  const take = parseInt(req.query.take as string) || 10;
  const [users, count] = await Promise.all([
    prismaClient.user.findMany({
      skip,
      take,
    }),
    prismaClient.user.count(),
  ]);
  res.json({ count, data: users });
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: parseInt(req.params.id),
      },
      include: { addresses: true },
    });
    res.json(user);
  } catch (error) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  ChangeUserRoleSchema.parse(req.body);
  try {
    const user = await prismaClient.user.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        role: req.body.role,
      },
    });
    res.json(user);
  } catch (error) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
};
