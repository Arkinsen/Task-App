import { Request, Response, NextFunction } from "express";
import { findUserByToken } from "../user/user.model.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).send({ message: "Invalid token" });
  }

  const user = findUserByToken(token);

  if (!user) {
    return res.status(403).send({ message: "User with this token not found" });
  }

  //u Dana req.user = user as Partial<User>... nějaká podobnost?
  res.locals.user = user;
  next();
};
