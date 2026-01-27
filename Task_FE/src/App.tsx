import { useState } from "react";

import "./App.css";
import { Login } from "./components/Login/Login";

type User = {
  username: string
  role: "admin" | "user";
}

function App() {
  const [token, setToken] = useState<string | null>(() => {

    return localStorage.getItem("AuthToken");
  });

  const [user, setUser] = useState<User | undefined>(() =>{
    const loadedUser = localStorage.getItem("User");
    if (!loadedUser) {
      return undefined;
    }
    return JSON.parse(loadedUser);
  });

  return (
    <>
      
      {token ? <h1>Vítejte, {user?.username}
        </h1>
        :
        <Login setToken={setToken} setUser={setUser} />}

    </>
  );
}

export default App;
