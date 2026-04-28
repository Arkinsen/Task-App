import { useState } from "react";
import { type User } from "../../types/common";
import { RegisterForm } from "../RegisterForm/RegisterForm";
import { Button, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

type AuthProps = {
  setUser: (user: User | undefined) => void;
  setToken: (token: string | undefined) => void;
};

export function Login({ setUser, setToken }: AuthProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [registerForm, setRegisterForm] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    requestLogin(username, password);
  };

  const requestLogin = async (username: string, password: string) => {
    try {
      // Stopne obnovení stránky...prej
      setError(null);

      const response = await fetch("http://localhost:3000/auth/login", {
        credentials: "include",
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

      if (!userToken) {
        console.log("userToken neni");
      }

      localStorage.setItem("User", JSON.stringify(user));
      localStorage.setItem("userToken", userToken);

      setUser(user);
      setToken(userToken);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {registerForm ? (
        <>
          <RegisterForm
            onCancel={() => setRegisterForm(false)}
            loginUser={requestLogin}
            setUser={setUser}
          />
        </>
      ) : (
        <>
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
                height: 400,
                boxShadow: 1,
              }}
            >
              <Stack component="form" onSubmit={handleSubmit} spacing={4}>
                <Typography variant="h5">Login</Typography>
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
                {error && (
                  <Typography color="error" sx={{ fontSize: 13 }}>
                    {error}
                  </Typography>
                )}
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
                  Don't have an account?{" "}
                  <Box
                    component="span"
                    sx={{ color: "primary.main", cursor: "pointer" }}
                    onClick={() => setRegisterForm(true)}
                  >
                    Sign up
                  </Box>
                </Typography>
              </Stack>
            </Box>
          </Box>
        </>
      )}
    </div>
  );
}
