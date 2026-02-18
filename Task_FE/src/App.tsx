import { useState, useEffect } from "react";

import "./App.css";
import { Login } from "./components/Login/Login";
import { TaskForm } from "./components/TaskForm/TaskForm";

export type User = {
  username: string;
  role: "admin" | "user";
};

export type Task = {
  id: number;
  name: string;
  details: string;
  done: boolean;
};

export const EmptyTask: Task = {
  id: -1,
  name: "",
  done: false,
  details: "",
};

function App() {
  {
    /* UseStates */
  }
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("AuthToken");
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [dropDown, setDropDown] = useState<boolean>(false);

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
      console.warn("Chyba při načítání uživatele, mažu poškozená data.");
      localStorage.removeItem("User");
    }
  });

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserTasks = async () => {
      //Asi pak lepší řešit přes cookies?
      const response = await fetch("http://localhost:3000/task/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          /*To je chujovina, takhle psát bearer růčo...*/
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        console.log(response.statusText);
        return;
      }

      const data = await response.json();

      setTasks(data);
    };
    fetchUserTasks();
  }, [token]);

  const setTaskDone = async (idTask: number) => {
    console.log("1. Začínám fetch...");

    try {
      const response = await fetch(
        `http://localhost:3000/task/toggle/${idTask}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        },
      );
      setTasks(
        tasks.map((task) => {
          return task.id === idTask ? { ...task, done: !task.done } : task;
        }),
      );
      console.log("2. Fetch dokončen!", response.status); // <--- Dostaneme se sem?
    } catch (error) {
      console.error("3. CHYBA při fetchi:", error); // <--- Nebo skončíme tady?
    }
  };

  const deleteTask = async (idTask: number) => {
    const response = await fetch(`http://localhost:3000/task/${idTask}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      return;
    }

    if (activeTask?.id === idTask) {
      setActiveTask(null);
    }

    setTasks(
      tasks.filter((task) => {
        return task.id !== idTask;
      }),
    );
  };

  const handleSaveTask = async (newTask: Task) => {
    if (activeTask?.id === undefined) {
      return;
    }

    if (activeTask?.id <= 0) {
      const response = await fetch(`http://localhost:3000/task/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        console.log("Failed Creating task");
        return;
      }

      const createdTask = await response.json();

      setTasks([...tasks, createdTask]);
    } else {
      //POZOR jsem si jistý co je tady task id? Musím to nastavit při kliknutí na tlačítko!

      const response = await fetch(
        `http://localhost:3000/task/${activeTask.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(newTask),
        },
      );
      if (!response.ok) {
        console.log("Failed updating task");
        return;
      }
      setTasks(
        tasks.map((task) => {
          return task.id === activeTask.id ? { ...newTask, id: task.id } : task;
        }),
      );
      setActiveTask(newTask);
    }

    setIsFormOpen(false);
  };

  const toggleDropdown = () => {
    setDropDown(!dropDown);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(undefined);
    localStorage.removeItem("AuthToken");
    localStorage.removeItem("User");
  };

  return (
    <div className="app-container">
      {/* 
        posílám referenci na funci, když jen chci, aby jí zavolal s vlastními daty
        posílám ()=> když chci, aby child udělal specificky, co já chci
      */}
      {isFormOpen && activeTask !== null ? (
        <TaskForm
          activeTask={activeTask}
          onSave={handleSaveTask}
          onCancel={() => setIsFormOpen(false)}
        />
      ) : null}
      {token ? (
        <>
          {/* navbar */}
          <nav className="navbar">
            <button onClick={toggleDropdown} className="menu-trigger">
              Menu ☰
            </button>

            {/*Stejný jako dropdown ? <></> : null*/}
            {dropDown && (
              <div className="dropdown-menu">
                <span className="user-info">
                  Profil: {user?.username || "Host"}
                </span>

                {/* Tady bude to tvoje TODO: Detaily profilu */}
                <button onClick={() => console.log("Profil kliknut")}>
                  Můj profil (todo)
                </button>

                <button onClick={handleLogout} className="logout-btn">
                  Log out
                </button>
              </div>
            )}
          </nav>

          {/* Hlavní nadpis */}
          <h1>Vítejte, {user?.username}!</h1>

          {/* Hlavní část rozdělená na dva sloupce */}
          <div className="dashboard">
            <div className="task-list-panel">
              {/* Prní sloupec*/}
              <h3>Seznam úkolů</h3>
              {tasks.length !== 0 ? (
                <>
                  <div>
                    {tasks.map((task) => (
                      <div key={task.id}>
                        <input
                          type="checkbox"
                          onChange={() => setTaskDone(task.id)}
                          checked={task.done}
                        />
                        <span
                          onClick={() => setActiveTask(task)}
                          style={{ cursor: "pointer" }}
                        >
                          {task.name}
                        </span>
                        <button onClick={() => deleteTask(task.id)}>X</button>
                        <button
                          onClick={() => {
                            (setActiveTask(task), setIsFormOpen(true));
                          }}
                        >
                          E
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      (setActiveTask(EmptyTask), setIsFormOpen(true));
                    }}
                  >
                    +
                  </button>
                </>
              ) : (
                <p>You have no task yet!</p>
              )}
            </div>

            {/* Druhý sloupec*/}
            <div className="task-detail-panel">
              <h3>Detail úkolu</h3>
              {activeTask && <p>{activeTask.details}</p>}
            </div>
          </div>
        </>
      ) : (
        <Login setToken={setToken} setUser={setUser} />
      )}
    </div>
  );
}

export default App;
