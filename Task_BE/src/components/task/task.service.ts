import {
  createNewTask,
  deleteTaskByID,
  getAll,
  getAllUsersTasks,
  getById,
  Task,
  toggleDone,
  updateTaskByID,
} from "./task.model.js";

export const taskService = {
  getAllTasks(role: string, userId: number) {
    if (role === "admin") {
      return getAll();
    }

    if (role === "user") {
      return getAllUsersTasks(userId);
    }

    //tohle by nikdy nemělo nastat.. i tak radši xd
    throw new Error("Unknown user role");
  },

  getTaskById(taskId: number, userId: number, role: string) {
    const task = getById(taskId);

    if (!task) {
      throw new Error("Task with such id could not be found");
    }

    if (role === "admin") {
      return task;
    }

    if (role === "user") {
      if (task.userId === userId) {
        return task;
      }
    }
    //Nejsem si jistej jestli vyhazovat vyjimku takhle na konci je zrovna geniální
    throw new Error("User has no permission to acces this task");
  },

  createTask(name: string, userId: number, done = false, details?: string) {
    if (name.length <= 3) {
      throw new Error("Task name needs to have at least 3 letters");
    }

    return createNewTask(name, userId, done, details);
  },

  deleteTaskByID(id: number, userId: number, role: string): boolean {
    //Tohle je asi trochu retardovaný?
    //Najdu task, protože potřebuji jeho user_id
    //Hlídá mi to i jestli existuje
    const task = this.getTaskById(id, userId, role);

    if (role === "admin") {
      return deleteTaskByID(task.id);
    }

    if (role === "user") {
      if (task.userId === userId) {
        return deleteTaskByID(task.id);
      }
    }

    return false;
  },

  updateTaskById(
    taskId: number,
    userId: number,
    role: string,
    taskUpadte: Partial<Task>
  ) {
    console.log("hmm");

    const task = this.getTaskById(taskId, userId, role);

    console.log("hmmmmmmm");

    if (role === "admin") {
      return updateTaskByID({ ...taskUpadte, id: taskId });
    }

    if (role === "user") {
      if (task.userId === userId) {
        return updateTaskByID({ ...taskUpadte, id: taskId });
      }
    }
    return false;
  },

  toggleDone(id: number, userId: number, role: string) {
    const task = this.getTaskById(id, userId, role);

    if (role === "admin") {
      return toggleDone(id);
    }

    if (role === "user") {
      if (task.userId === userId) {
        return toggleDone(id);
      }
    }
  },
};
