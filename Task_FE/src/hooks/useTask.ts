import { useCallback } from "react";
import { fetchRequest } from "../api/fetchRequest";
import { useAppContext } from "../store/appStore";
import type { Task } from "../types/common";

export const useTask = () => {
  const { tasks, setTasks, token, activeTask, setActiveTask } = useAppContext();

  const fetchUserTasks = useCallback(async () => {
    try {
      const data = await fetchRequest<Task[]>("/task/", token, {
        method: "GET",
      });

      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  }, [token]); //TODO proč nejde token? Takže říkám, že se token změní jen když

  const setTaskDone = async (idTask: number) => {
    try {
      const data = await fetchRequest<Task[]>(`/task/toggle/${idTask}`, token, {
        method: "PATCH",
      });

      setTasks(
        tasks.map((task) => {
          return task.id === idTask ? { ...task, done: !task.done } : task;
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (idTask: number) => {
    try {
      const data = await fetchRequest<Task[]>(`/task/${idTask}`, token, {
        method: "DELETE",
      });

      if (activeTask?.id === idTask) {
        setActiveTask(null);
      }

      setTasks(
        tasks.filter((task) => {
          return task.id !== idTask;
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const createTask = async (task: Task) => {
    try {
      const createdTask = await fetchRequest<Task>(
        `/task/`,
        token,
        {
          method: "POST",
        },
        task,
      );

      setTasks([...tasks, createdTask]);

      return createdTask;
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (task: Task) => {
    try {
      const newTask = await fetchRequest<Task>(
        `/task/${task.id}`,
        token,
        {
          method: "PATCH",
        },
        task,
      );

      setTasks(
        tasks.map((task) => {
          return task.id === activeTask?.id
            ? { ...newTask, id: task.id }
            : task;
        }),
      );

      // This should probably be in business logic (in the app.tsx)
      setActiveTask(newTask);

      return newTask;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    fetchUserTasks,
    setTaskDone,
    deleteTask,
    createTask,
    updateTask,
  };
};
