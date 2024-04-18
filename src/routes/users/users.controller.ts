import express from "express";
import { userService } from "./users.service";
import { token } from "middlewares/token";

export const UserRouter = express.Router();

UserRouter.post("/signup", async (req, res, next) => {
  try {
    const result = await userService.createUser(req.body);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

UserRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.send(result);
  } catch (e) {
    next(e);
  }
});

UserRouter.get(
  "/me",
  token.getUserIdFromAccessToken,
  async (req: any, res, next) => {
    try {
      const user = await userService.getUser(req.userId);
      res.send(user);
    } catch (e) {
      next(e);
    }
  }
);
