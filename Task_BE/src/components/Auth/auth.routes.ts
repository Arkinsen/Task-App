import { Router } from "express";
import { login } from "./auth.service.js";

export const authRouter = Router();

authRouter.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log(username + " " + password);

  const logUser = login(username, password);

  console.log(logUser);

  if (!logUser) {
    //Má tu být return nebo ne
    return res.status(401).json({ message: "Wrong credentials" });
  }

  res.status(200).json(logUser);
});
