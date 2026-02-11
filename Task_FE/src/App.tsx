import { useState } from "react";

import "./App.css";
import { Login } from "./components/Login/Login";

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

function App() {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("AuthToken");
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
      console.warn("Chyba při načítání uživatele, mažu poškozená data.");
      localStorage.removeItem("User");
      return undefined;
    }
  });

  const [dropDown, setDropDown] = useState<boolean>(false);

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
              <h3>Seznam úkolů</h3>
              {/* Tady později bude seznam */}
            </div>

            <div className="task-detail-panel">
              <h3>Detail úkolu</h3>
              {/* Tady později bude detail */}
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
