import { useState, useEffect } from "react";

import "./App.css";
import { Login } from "./components/Login/Login";
import { TaskForm } from "./components/TaskForm/TaskForm";
import { useTask } from "./hooks/useTask";
import { EmptyTask, useAppContext } from "./store/appStore";
import type { Task } from "./types/common";

function App() {
  const {
    user,
    setDropDown,
    dropDown,
    setUser,
    activeTask,
    setActiveTask,
    setIsFormOpen,
    isFormOpen,
    tasks,
  } = useAppContext();
  const { fetchUserTasks, deleteTask, setTaskDone, createTask, updateTask } =
    useTask();

  useEffect(() => {
    fetchUserTasks();
  }, [fetchUserTasks, user]);

  const toggleDropdown = () => {
    setDropDown(!dropDown);
  };

  const handleLogout = () => {
    setUser(undefined);
    localStorage.removeItem("AuthToken");
    localStorage.removeItem("User");
  };

  const handleSaveTask = async () => {
    if (activeTask?.id === undefined) {
      return;
    }

    if (activeTask?.id <= 0) {
      createTask(activeTask);
    } else {
      //POZOR nejsem si jistý jestli je tady task id? Musím to nastavit při kliknutí na tlačítko.
      updateTask(activeTask);
    }

    setIsFormOpen(false);
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
      {user ? (
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
                    /*  onClick={() => {
                      (setActiveTask(EmptyTask), setIsFormOpen(true));
                    }}*/
                    //Prý radši takhle
                    onClick={() => {
                      setActiveTask(EmptyTask);
                      setIsFormOpen(true);
                    }}
                  >
                    +
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      (setActiveTask(EmptyTask), setIsFormOpen(true));
                    }}
                  >
                    +
                  </button>
                  <p>You have no task yet!</p>
                </>
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
        <Login setUser={setUser} />
      )}
    </div>
  );
}

export default App;
