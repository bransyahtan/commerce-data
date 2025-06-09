import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../store/slices/authSlice";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await axios.get(
        `http://localhost:3000/users?username=${username}`
      );
      const user = response.data[0];

      if (user && user.password === password) {
        const { password: _, ...userWithoutPassword } = user;
        dispatch(loginSuccess(userWithoutPassword));
        Swal.fire({
          icon: "success",
          title: "Login Berhasil!",
          text: `Selamat datang, ${userWithoutPassword.name}!`,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/dashboard");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: "Username atau password salah",
        });
        dispatch(loginFailure("Username atau password salah"));
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Terjadi kesalahan saat login",
      });
      dispatch(loginFailure("Terjadi kesalahan saat login"));
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
        padding: { xs: 0, sm: 2 },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: { xs: 2, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "400px",
          borderRadius: 2,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: { xs: "none", sm: "translateY(-5px)" },
          },
          mx: { xs: 2, sm: "auto" },
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: { xs: 2, sm: 3 },
            textAlign: "center",
            fontSize: { xs: "1.75rem", sm: "2.125rem" },
          }}
        >
          Selamat Datang
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: { xs: 2, sm: 3 },
              mb: { xs: 1, sm: 2 },
              py: { xs: 1, sm: 1.5 },
              borderRadius: 2,
              textTransform: "none",
              fontSize: { xs: "1rem", sm: "1.1rem" },
              fontWeight: 600,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: { xs: "none", sm: "translateY(-2px)" },
                boxShadow: "0 5px 8px 2px rgba(33, 203, 243, .4)",
              },
            }}
          >
            Masuk
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
