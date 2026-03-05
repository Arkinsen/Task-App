import React, { useEffect, useState } from "react";
import "./RegisterForm.css";
import { type User } from "../../App";

type RegisterProps = {
  onCancel: () => void;
  loginUser: (username: string, password: string) => void;
  setToken: (token: string | null) => void;
  setUser: (user: User | undefined) => void;
};

export function RegisterForm({
  onCancel,
  loginUser,
  setToken,
  setUser,
}: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setrepPassword] = useState("");

  //Jak handlovat errors?
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      //Asi neni nejideálnější tohle checkovat takhle jako stringy na FE
      if (password !== repPassword) {
        console.log("Password Needs to match!");
        return;
      }

      const response = await fetch("http://localhost:3000/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      if (!response.ok) {
        console.log(response.statusText);
      }

      await loginUser(username, password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} action="submit">
      <h2>Register</h2>
      <input
        className="loginInputs"
        type="text"
        placeholder="username"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="loginInputs"
        type="password"
        id="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="loginInputs"
        type="password"
        id="password"
        placeholder="repeat password"
        value={repPassword}
        onChange={(e) => setrepPassword(e.target.value)}
      />
      <button type="submit" className="loginButton">
        Submit
      </button>
      <div>
        Already have account?
        <span className="createAccountLink" onClick={onCancel}>
          Login!
        </span>
      </div>
    </form>
  );
}
