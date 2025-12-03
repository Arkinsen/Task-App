import { storeData } from "../../store.js";

export type Task = {
  id: number;
  userId: number;
  name: string;
  done: boolean;
  details?: string;
};

let nextId = 1;

function assignID(): number {
  if (storeData.tasks.length === 0) {
    return nextId;
  }
  nextId = Math.max(...storeData.tasks.map((task) => task.id)) + 1;
  return nextId;
}

// const tasks: Task[] = [];

export function getAll(): Task[] {
  return storeData.tasks;
}

export function getAllUsersTasks(userId: number): Task[] {
  return storeData.tasks.filter((tasks) => tasks.userId === userId);
}

export function getById(id: number): Task | undefined {
  const task = storeData.tasks.find((task) => {
    return task.id === id;
  });

  if (!task) {
    return;
  }

  return task;
}

export function createNewTask(
  name: string,
  userId: number,
  done: boolean,
  details?: string
): Task {
  let newtask: Task = {
    id: assignID(),
    userId: userId,
    name: name,
    done: done,
    details: details,
  };

  storeData.setState({ tasks: [...storeData.tasks, newtask] });

  return newtask;
}

//Musím vrátit task do deleteTaskById
export function deleteTaskByID(id: number): boolean {
  const before = storeData.tasks.length;

  const afterdelete = storeData.tasks.filter((task) => {
    return task.id !== id;
  });

  if (afterdelete.length === before) return false;

  storeData.setState({ tasks: afterdelete });
  return true;
}

export function updateTaskByID(taskUpadte: Partial<Task>): boolean {
  if (!taskUpadte.id) return false;

  let udpated = false;

  const afterUpdate = storeData.tasks.map((storeTask) => {
    if (storeTask.id === taskUpadte.id) {
      udpated = true;
      return { ...storeTask, ...taskUpadte };
    }
    return storeTask;
  });

  if (udpated) {
    storeData.setState({ tasks: afterUpdate });
  }
  return udpated;
}

export function toggleDone(id: number): boolean {
  let udpated = false;
  const afterToggle = storeData.tasks.map((task) => {
    if (task.id === id) {
      udpated = true;
      return { ...task, done: !task.done };
    }
    return task;
  });

  storeData.setState({ tasks: afterToggle });
  return udpated;
}
