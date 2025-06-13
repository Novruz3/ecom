import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import { User } from "../generated/prisma";

interface AuthRequest extends Request {
  user?: User;
}

const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user?.role == "ADMIN") {
    next();
  } else {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default adminMiddleware;
