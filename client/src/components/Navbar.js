"use client"

import { useNavigate } from "react-router-dom"
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material"
import { Leaf } from "lucide-react"
import React from "react"

const Navbar = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem("token"))

  React.useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("isAdmin")
    setIsAuthenticated(false)
    navigate("/login", { replace: true })
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fdf8 100%)",
        borderBottom: "2px solid #e8f5e8",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
      }}
    >
      <Toolbar
        sx={{
          py: { xs: 1, sm: 1.5 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              backgroundColor: "#22c55e",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
            }}
          >
            <Leaf size={20} color="white" />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: "#2d5016",
              fontWeight: "bold",
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              letterSpacing: "0.02em",
            }}
          >
            imprenditore
          </Typography>
        </Box>

        {isAuthenticated && (
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 2 },
              alignItems: "center",
            }}
          >
            <Button
              onClick={() => navigate("/dashboard")}
              sx={{
                color: "#374151",
                fontWeight: 600,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                textTransform: "none",
                px: { xs: 2, sm: 3 },
                py: 1,
                borderRadius: "10px",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#f0fdf4",
                  color: "#22c55e",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Dashboard
            </Button>
            <Button
              onClick={() => navigate("/trade")}
              sx={{
                color: "#374151",
                fontWeight: 600,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                textTransform: "none",
                px: { xs: 2, sm: 3 },
                py: 1,
                borderRadius: "10px",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#f0fdf4",
                  color: "#22c55e",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Trade
            </Button>
            <Button
              onClick={handleLogout}
              sx={{
                color: "#374151",
                fontWeight: 600,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                textTransform: "none",
                px: { xs: 2, sm: 3 },
                py: 1,
                borderRadius: "10px",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#f0fdf4",
                  color: "#22c55e",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
