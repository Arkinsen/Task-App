import { useState } from "react";
import "./login.css";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [submitProcces, setSubmitProcces] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stopne obnovení stránky

    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: setUsername, password: setPassword }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>login</h2>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
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
