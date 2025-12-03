import type { Task } from "./components/task/task.model.js";
import type { User } from "./components/user/user.model.js";
import fs from "fs";
import path from "path";

type Store = { tasks: Task[]; users: User[] };

//export const store: Store = { tasks: [] };

// export const store: { tasks: Task[] } = { tasks: [] };

const storeFilePath = path.join(process.cwd(), "storage", "store.json");

export const storeData = {
  tasks: [] as Task[],
  users: [] as User[],

  setState(patch: Partial<Store>) {
    //this is storeData
    //assign(target, source)
    Object.assign(this, patch);
    this.saveToFile();
  },
  saveToFile() {
    const { setState, saveToFile, loadFromFile, ...data } = this;
    fs.writeFileSync(storeFilePath, JSON.stringify(data, null, 2), "utf-8");
  },
  loadFromFile() {
    if (fs.existsSync(storeFilePath)) {
      const fsData = fs.readFileSync(storeFilePath, "utf-8");
      if (fsData.trim().length === 0) {
        return;
      }
      const data = JSON.parse(fsData);

      Object.assign(this, data);
    }
  },
};
// store.loadFromFile();
// store.setState({ tasks: [...store.tasks, newTask] });
