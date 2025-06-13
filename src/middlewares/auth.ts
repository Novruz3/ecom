import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { User } from "../generated/prisma";

interface AuthRequest extends Request {
  user?: User;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization!;
  if (!token) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }
    req.user = user!;

    next();
  } catch (error) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;
