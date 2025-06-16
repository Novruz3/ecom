import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import {
  addAddress,
  changeUserRole,
  deleteAddress,
  getAllAddresses,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/users.cont";
import adminMiddleware from "../middlewares/admin";

const usersRoutes: Router = Router();

usersRoutes.post("/address", [authMiddleware], errorHandler(addAddress));
usersRoutes.delete(
  "/address/:id",
  [authMiddleware],
  errorHandler(deleteAddress)
);
usersRoutes.get("/address", [authMiddleware], errorHandler(getAllAddresses));
usersRoutes.put("/", [authMiddleware], errorHandler(updateUser));
usersRoutes.put(
  "/:id/role",
  [authMiddleware, adminMiddleware],
  errorHandler(changeUserRole)
);
usersRoutes.get(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(getAllUsers)
);
usersRoutes.get(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getUserById)
);

export default usersRoutes;
