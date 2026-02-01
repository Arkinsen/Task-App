import { useState } from "react";

import "./App.css";
import { Login } from "./components/Login/Login";

export type User = {
  username: string;
  role: "admin" | "user";
};

function App() {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("AuthToken");
  });

  const [user, setUser] = useState<User | undefined>(() => {
    const loadedUser = localStorage.getItem("User");
    if (!loadedUser) {
      return undefined;
    }
    return JSON.parse(loadedUser);
  });

  const handleLogout = () => {
    setToken(null);
    setUser(undefined);
    localStorage.removeItem("AuthToken");
    localStorage.removeItem("User");
  };

  return (
    <>
      {token ? (
        <>
          <h1>Vítejte, {user?.username}</h1>
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <Login setToken={setToken} setUser={setUser} />
      )}
    </>
  );
}

export default App;
