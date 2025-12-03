import express from "express";
import { taskRouter } from "./components/task/task.routes.js";
import { authRouter } from "./components/Auth/auth.routes.js";
import { userRouter } from "./components/user/user.routes.js";
import { authMiddleware } from "./components/Auth/auth.middleware.js";

export const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.send("OK"));
app.use("/task", authMiddleware, taskRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
