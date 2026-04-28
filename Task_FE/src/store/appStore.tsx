import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { Task, User } from "../types/common";

type AppStore = {
  tasks: Task[];
  user: User | undefined;
  activeTask: Task | null;
  dropDown: boolean;
  isFormOpen: boolean;
  token: string | undefined;

  setTasks: Dispatch<SetStateAction<Task[]>>;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  setActiveTask: Dispatch<SetStateAction<Task | null>>;
  setDropDown: Dispatch<SetStateAction<boolean>>;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
  setToken: Dispatch<SetStateAction<string | undefined>>;
};

export const EmptyTask: Task = {
  id: -1,
  name: "",
  done: false,
  details: "",
};

export const AppContext = createContext<AppStore | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within TaskProvider");
  }

  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [token, setToken] = useState<string | undefined>(() => {
    try {
      const loadedToken = localStorage.getItem("userToken");

      if (!loadedToken) {
        return undefined;
      }

      return loadedToken;
    } catch (error) {
      console.warn("Chyba při načítání tokenu, smažu poškozená data.");
      localStorage.removeItem("userToken");
    }
  });

  //bez tohodle se někdy všechno rozbije a vyskočí error,
  //že tahá něco z local storage, i když je prázdný a neměl by
  const [user, setUser] = useState<User | undefined>(() => {
    try {
      const loadedUser = localStorage.getItem("User");

      if (!loadedUser) {
        return undefined;
      }

      return JSON.parse(loadedUser);
    } catch (error) {
      console.warn("Chyba při načítání uživatele, smažu poškozená data.");
      localStorage.removeItem("User");
    }
  });

  return (
    <AppContext.Provider
      value={{
        dropDown,
        setDropDown,
        user,
        setUser,
        tasks,
        setTasks,
        activeTask,
        setActiveTask,
        isFormOpen,
        setIsFormOpen,
        token,
        setToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
