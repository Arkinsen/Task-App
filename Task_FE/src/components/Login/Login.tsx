import { useState } from "react";
import "./login.css";
import { type User } from "../../App";

type AuthProps = {
  setToken: (token: string | null) => void;
  setUser: (user: User | undefined) => void;
};

export function Login({ setToken, setUser }: AuthProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [submitProcces, setSubmitProcces] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault(); // Stopne obnovení stránky...prej
      setError(null);

      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.toLowerCase().trim(),
          password,
        }),
      });

      if (!response.ok) {
        setError(response.statusText);
        return;
      }

      const data = await response.json();

      console.log(data);

      const { userToken, user } = data;

      localStorage.setItem("AuthToken", userToken);
      localStorage.setItem("User", JSON.stringify(user));

      setToken(userToken);
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div className="error-div ">{error ? <>{error}</> : null}</div>
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
      <button type="submit" className="loginButton">
        {submitProcces ? "Checking credetials" : "submit"}
      </button>
    </form>
  );
}
