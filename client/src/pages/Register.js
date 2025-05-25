
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Box, Paper, TextField, Button, Typography, Alert, Link as MuiLink } from "@mui/material"
import { register } from "../services/api"

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      const response = await register(formData.name, formData.email, formData.password)
      localStorage.setItem("token", response.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    }
  }

  const textFieldStyles = {
    mb: 2.5,
    "& .MuiInputLabel-root": {
      color: "#6b7280",
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      "& fieldset": {
        borderColor: "#e5e7eb",
        borderWidth: "1.5px",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#22c55e",
        borderWidth: "2px",
      },
      "& input": {
        color: "#000000", // black text
      },
    },
    "& .MuiInputBase-input": {
      padding: "14px 16px",
    },
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fefefe 0%, #f8f6f0 50%, #f0f4f0 100%)",
        padding: { xs: 2, sm: 3 },
      }}
    >
      <Paper
          elevation={8}
          sx={{
            p: 5,
            width: "100%",
            maxWidth: 600,
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "2px solid rgba(143, 188, 143, 0.5)",
            borderRadius: "20px",
            boxShadow: "0 12px 32px rgba(107, 142, 35, 0.3)",
          }}
        >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 3,
            textAlign: "center",
            color: "#2d5016",
            fontWeight: "bold",
            fontSize: { xs: "1.75rem", sm: "2rem" },
          }}
        >
          Create Account
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "12px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              "& .MuiAlert-icon": {
                color: "#dc2626",
              },
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            sx={textFieldStyles}
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
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ ...textFieldStyles, mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 3,
              py: 1.5,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: "0 4px 16px rgba(34, 197, 94, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                boxShadow: "0 6px 20px rgba(34, 197, 94, 0.4)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Create Account
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{
                color: "#6b7280",
                fontSize: "0.875rem",
              }}
            >
              Already have an account?{" "}
              <MuiLink
                component={Link}
                to="/login"
                sx={{
                  color: "#22c55e",
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": {
                    color: "#16a34a",
                    textDecoration: "underline",
                  },
                }}
              >
                Sign in here
              </MuiLink>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}

export default Register
