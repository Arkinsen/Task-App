import React, { useEffect, useState } from "react";
import { type User } from "../../types/common";
import { Button, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { fetchRequest } from "../../api/fetchRequest";

type RegisterProps = {
  onCancel: () => void;
  loginUser: (username: string, password: string) => void;
  setUser: (user: User | undefined) => void;
};

export function RegisterForm({ onCancel, loginUser }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setrepPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  //Jak handlovat errors?
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      //Asi neni nejideálnější tohle checkovat takhle jako stringy na FE
      if (password !== repPassword || !password || !repPassword) {
        console.log("Password Needs to match!");
        setError("Password Needs to match");
        return;
      }

      // const response = await fetch("http://localhost:3000/user/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     username: username.trim(),
      //     password,
      //   }),
      // });

      await fetchRequest<User>(
        "/user/",
        undefined,
        { method: "POST" },
        { username: username.trim(), password }, // ← čtvrtý parametr
      );

      // if (!response.ok) {
      //   const data = await response.json();
      //   setError(data.message || "Registration failed");
      //   return; // ← zastav, nevolej loginUser()
      // }

      await loginUser(username, password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
          }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 5,
              width: 420,
              height: 500,
              boxShadow: 1,
            }}
          >
            <Stack component="form" onSubmit={handleSubmit} spacing={4}>
              <Typography variant="h5">Register</Typography>
              {error && (
                <Typography color="error" sx={{ fontSize: 13 }}>
                  {error}
                </Typography>
              )}
              <TextField
                label="Username"
                variant="outlined"
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
              <TextField
                label="Repeat Password"
                variant="outlined"
                type="password"
                error={password !== repPassword && repPassword.length > 0}
                helperText={
                  password !== repPassword && repPassword.length > 0
                    ? "Passwords don't match"
                    : ""
                }
                onChange={(e) => setrepPassword(e.target.value)}
                fullWidth
              />

              <Button variant="contained" type="submit" fullWidth>
                Sign in
              </Button>
              <Typography
                sx={{
                  fontSize: 13,
                  textAlign: "center",
                  color: "text.secondary",
                }}
              >
                Have account already?{" "}
                <Box
                  component="span"
                  sx={{ color: "primary.main", cursor: "pointer" }}
                  onClick={onCancel}
                >
                  Log in!
                </Box>
              </Typography>
            </Stack>
          </Box>
        </Box>
      </div>
    </>
    // <form onSubmit={handleSubmit} action="submit">
    //   <h2>Register</h2>
    //   <input
    //     className="loginInputs"
    //     type="text"
    //     placeholder="username"
    //     id="username"
    //     value={username}
    //     onChange={(e) => setUsername(e.target.value)}
    //   />
    //   <input
    //     className="loginInputs"
    //     type="password"
    //     id="password"
    //     placeholder="password"
    //     value={password}
    //     onChange={(e) => setPassword(e.target.value)}
    //   />
    //   <input
    //     className="loginInputs"
    //     type="password"
    //     id="password"
    //     placeholder="repeat password"
    //     value={repPassword}
    //     onChange={(e) => setrepPassword(e.target.value)}
    //   />
    //   <button type="submit" className="loginButton">
    //     Submit
    //   </button>
    //   <div>
    //     Already have account?
    //     <span className="createAccountLink" onClick={onCancel}>
    //       Login!
    //     </span>
    //   </div>
    // </form>
  );
}
