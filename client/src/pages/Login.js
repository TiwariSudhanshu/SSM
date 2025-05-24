"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
  createTheme,
  ThemeProvider,
} from "@mui/material"
import { login } from "../services/api"

// Create a custom green theme
const greenTheme = createTheme({
  palette: {
    primary: {
      main: "#6B8E23", // Dark green
      light: "#8FBC8F",
      dark: "#556B2F",
    },
    secondary: {
      main: "#90EE90", // Light green
    },
    background: {
      default: "linear-gradient(135deg, #FAF7F0 0%, #F5F5DC 100%)",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            "& fieldset": {
              borderColor: "#8FBC8F",
              borderWidth: "2px",
            },
            "&:hover fieldset": {
              borderColor: "#6B8E23",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#6B8E23",
              borderWidth: "2px",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#6B8E23",
            fontWeight: 500,
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#6B8E23",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "16px",
          padding: "12px 24px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          border: "2px solid #8FBC8F",
        },
      },
    },
  },
})

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await login(formData.email, formData.password)
      localStorage.setItem("token", response.token)
      if (response.isAdmin) {
        localStorage.setItem("isAdmin", "true")
        window.location.href = "/admin"
      } else {
        window.location.href = "/dashboard"
      }
    } catch (err) {
      setError(err.message || "Login failed")
    }
  }

  return (
    <ThemeProvider theme={greenTheme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #FAF7F0 0%, #F5F5DC 100%)",
          padding: 2,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 5,
            width: "100%",
            maxWidth: 420,
            backgroundColor: "#FFFFFF",
            border: "2px solid #8FBC8F",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(107, 142, 35, 0.15)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              color: "#556B2F",
              fontWeight: 700,
              textAlign: "center",
              mb: 3,
              fontSize: "28px",
            }}
          >
            Welcome Back
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: "12px",
                backgroundColor: "#FFE6E6",
                color: "#D32F2F",
                border: "1px solid #FFCDD2",
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 3,
                backgroundColor: "#6B8E23",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "16px",
                padding: "14px",
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "#556B2F",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 20px rgba(107, 142, 35, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Sign In
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#6B8E23",
                  fontSize: "14px",
                }}
              >
                Don't have an account?{" "}
                <MuiLink
                  component={Link}
                  to="/register"
                  sx={{
                    color: "#556B2F",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      color: "#6B8E23",
                    },
                  }}
                >
                  Create Account
                </MuiLink>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </ThemeProvider>
  )
}

export default Login
