import { Router } from "express";
import {
  getAll,
  getById,
  deleteTaskByID,
  updateTaskByID,
  toggleDone,
} from "./task.model.js";
import { taskService } from "./task.service.js";
import { error } from "console";

export const taskRouter = Router();

taskRouter.get("/", (req, res) => {
  try {
    //Můžu nějak jednoduše zjistit, co v tom userovi je?
    const { role, id } = res.locals.user;

    return res.json(taskService.getAllTasks(role, id));
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

taskRouter.get("/:id", (req, res) => {
  const taskId = req.params.id;
  const { role, id } = res.locals.user;

  try {
    const task = taskService.getTaskById(parseInt(taskId), id, role);

    if (!task) {
      return res.status(404).json({ message: `Task wth id=${id} not found` });
    }

    return res.json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

taskRouter.post("/", async (req, res) => {
  try {
    //const reqTask = req.body;
    const { name, done, details } = req.body;
    const user = res.locals.user;

    const newTask = taskService.createTask(name, user.id, done, details);
    return res.status(201).json(newTask);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    console.log("Error when creating new task");
  }
});

taskRouter.delete("/:id", async (req, res) => {
  let taskId = req.params.id;
  const { role, id } = res.locals.user;

  //Teda kontrola id spíše tady, než v modelu?
  //Unary + dovoluje zkontrolovat, Not a number... proč? xd
  if (!taskId || isNaN(+taskId)) {
    return res
      .status(400)
      .json({ message: "id not specified or not a number" });
  }

  try {
    const filteredTasks = taskService.deleteTaskByID(
      parseInt(taskId),
      id,
      role
    );
    return res.status(201).json();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    console.log("Error when creating new task");
  }
});

taskRouter.patch("/:id", async (req, res) => {
  const taskId = Number(req.params.id);
  const { role, id } = res.locals.user;

  if (!taskId || isNaN(taskId)) {
    return res
      .status(400)
      .json({ message: "id not specified or not a number" });
  }
  try {
    taskService.updateTaskById(taskId, id, role, {
      ...req.body,
      taskId,
    });

    return res.status(204);
    //const patchedTask = updateTaskByID({ ...req.body, taskId });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

//TODO přidat udpateTaskById ze service a dodělat toggle
taskRouter.patch("/toggle/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { id: userId } = res.locals.user;

  if (!id || isNaN(id)) {
    res.status(400).json({ message: "id not specified or not a number" });
    return;
  }
  try {
    // ZMĚNA: Posíláme ID uživatele.
    toggleDone(id);

    console.log("v toggle pŕepínám task")

    return res.status(204).send();
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});
