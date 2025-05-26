import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Container,
  useMediaQuery,
} from "@mui/material";
import { login } from "../services/api";

// Create a custom green theme
const greenTheme = createTheme({
  palette: {
    primary: {
      main: "#6B8E23", 
      light: "#8FBC8F",
      dark: "#556B2F",
    },
    secondary: {
      main: "#90EE90",
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
          padding: "14px 24px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          border: "2px solid #8FBC8F",
        },
      },
    },
  },
});

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const isDesktop = useMediaQuery('(min-width:1200px)');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await login(formData.email, formData.password);
      localStorage.setItem("token", response.token);
      if (response.isAdmin) {
        localStorage.setItem("isAdmin", "true");
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic sizing based on screen size
  const getContainerWidth = () => {
    if (isMobile) return "100%";
    if (isTablet) return "70%";
    if (isDesktop) return "70%";
    return "60%";
  };

  const getMaxWidth = () => {
    if (isMobile) return 400;
    if (isTablet) return 600;
    if (isDesktop) return 900;
    return 700;
  };

  const getPadding = () => {
    if (isMobile) return 4;
    if (isTablet) return 6;
    return 8;
  };

  const getTitleSize = () => {
    if (isMobile) return "h5";
    if (isTablet) return "h4";
    return "h3";
  };

  return (
    <ThemeProvider theme={greenTheme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #FAF7F0 0%, #F5F5DC 100%)",
          padding: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            width: getContainerWidth(),
            maxWidth: getMaxWidth(),
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={12}
            sx={{
              p: getPadding(),
              width: "100%",
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "2px solid rgba(143, 188, 143, 0.6)",
              borderRadius: "24px",
              boxShadow: {
                xs: "0 8px 24px rgba(107, 142, 35, 0.2)",
                sm: "0 12px 32px rgba(107, 142, 35, 0.25)",
                md: "0 16px 40px rgba(107, 142, 35, 0.3)",
              },
              minHeight: { xs: "auto", sm: "500px", md: "600px" },
            }}
          >
            <Typography
              variant={getTitleSize()}
              component="h1"
              gutterBottom
              sx={{
                color: "#556B2F",
                fontWeight: 700,
                textAlign: "center",
                mb: { xs: 2, sm: 3, md: 1 },
                fontSize: {
                  xs: "24px",
                  sm: "32px",
                  md: "40px",
                  lg: "48px",
                },
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#6B8E23",
                textAlign: "center",
                mb: { xs: 3, sm: 4, md: 5 },
                fontSize: {
                  xs: "14px",
                  sm: "16px",
                  md: "18px",
                },
                fontWeight: 500,
              }}
            >
              Sign in to your account to continue
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: { xs: 2, sm: 3, md: 4 },
                  borderRadius: "12px",
                  backgroundColor: "#FFE6E6",
                  color: "#D32F2F",
                  border: "1px solid #FFCDD2",
                  fontSize: { xs: "14px", sm: "16px" },
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
                sx={{
                  mb: { xs: 2, sm: 3 },
                  "& .MuiOutlinedInput-root": {
                    height: { xs: "48px", sm: "56px", md: "64px" },
                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                  },
                }}
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
                sx={{
                  mb: { xs: 2, sm: 3, md: 4 },
                  "& .MuiOutlinedInput-root": {
                    height: { xs: "48px", sm: "56px", md: "64px" },
                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                  },
                }}
              />


              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: { xs: 1, sm: 2 },
                  mb: { xs: 3, sm: 4 },
                  backgroundColor: "#6B8E23",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: { xs: "16px", sm: "18px", md: "20px" },
                  padding: { xs: "12px", sm: "16px", md: "20px" },
                  borderRadius: "12px",
                  height: { xs: "48px", sm: "56px", md: "64px" },
                  "&:hover": {
                    backgroundColor: "#556B2F",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(107, 142, 35, 0.4)",
                  },
                  "&:disabled": {
                    backgroundColor: "#8FBC8F",
                    color: "#FFFFFF",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6B8E23",
                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                    fontWeight: 500,
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
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;