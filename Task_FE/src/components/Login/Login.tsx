import { useState } from "react";
import "./login.css";

type AuthProps = {
  setToken: any
  setUser: any
}

export function Login({setToken, setUser}: AuthProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [submitProcces, setSubmitProcces] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault(); // Stopne obnovení stránky...prej ZEPTAT SE 

      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      console.log(data);

      const { userToken, user } = data


      localStorage.setItem("AuthToken", userToken);
      localStorage.setItem("AuthToken", JSON.stringify(user));

      setToken(userToken);
      setUser(user);
      

    } catch (error) {
      console.log(error);

    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>login</h2>
      <input
        type="text"
        placeholder="username"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        id="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">
        {submitProcces ? "Checking credetials" : "submit"}
      </button>
    </form>
  );
}
