import { Router } from "express";
import { UserController } from "../controllers/user.js";

export const createRouter = ({ userModel }) => {
  const contactRouter = Router();
  const userController = new UserController({ userModel });

  contactRouter.post("/register", userController.register);
  contactRouter.get("/get", userController.getAll);
  contactRouter.post("/login", userController.login);
  contactRouter.get("/protected", userController.protected);
  contactRouter.post("/logout", userController.logOut);

  return contactRouter;
};
