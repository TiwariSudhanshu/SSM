"use client"

import { useNavigate } from "react-router-dom"
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem } from "@mui/material"
import { Leaf, Menu } from "lucide-react"
import React from "react"

const Navbar = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem("token"))
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("isAdmin")
    setIsAuthenticated(false)
    window.location.href = "/" 
  }

  const menuItems = [
    { text: "Dashboard", path: "/dashboard" },
    { text: "Trade", path: "/trade" },
    { text: "Logout", onClick: handleLogout }
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', pt: 2 }}>
      <List sx={{ p: 0 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            sx={{ 
              justifyContent: 'center',
              py: 1.5,
              '&:hover': {
                backgroundColor: '#f0fdf4',
              }
            }}
          >
            <Button
              onClick={item.onClick || (() => navigate(item.path))}
              sx={{
                color: "#374151",
                fontWeight: 500,
                fontSize: "1.1rem",
                textTransform: "none",
                width: '100%',
                py: 1,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  color: "#22c55e",
                  backgroundColor: 'transparent',
                },
              }}
            >
              {item.text}
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );

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
            cursor: "pointer",
          }}
          onClick={() => window.location.href=("/")}
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
          <>
            {/* Desktop Menu */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 2,
                alignItems: "center",
              }}
            >
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  onClick={item.onClick || (() => navigate(item.path))}
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
                  {item.text}
                </Button>
              ))}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { md: 'none' },
                color: "#374151"
              }}
            >
              <Menu />
            </IconButton>

            {/* Mobile Drawer */}
            <Drawer
              variant="temporary"
              anchor="right"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile
              }}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: 240,
                  background: "linear-gradient(135deg, #ffffff 0%, #f8fdf8 100%)",
                },
              }}
            >
              {drawer}
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
