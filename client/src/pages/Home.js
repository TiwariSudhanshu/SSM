"use client"
import { useNavigate } from "react-router-dom"
import { Box, Button, Typography, Container, Grid, Card, CardContent } from "@mui/material"
import { PlayArrow, PersonAdd } from "@mui/icons-material"
import { TrendingUp, Building2, Target, Trophy, Leaf } from "lucide-react"

const Home = () => {
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem("token")

  const handleStartSimulation = () => {
    if (isAuthenticated) {
      navigate("/dashboard")
    } else {
      navigate("/login")
    }
  }

  const handleRegister = () => {
    navigate("/register")
  }

  const steps = [
    {
      number: 1,
      title: "Discover & Invest",
      description: "Explore virtual eco-friendly companies and invest wisely.",
      icon: <TrendingUp size={24} color="white" />,
    },
    {
      number: 2,
      title: "Cultivate Your Portfolio",
      description: "Build a portfolio balancing growth and ESG impact.",
      icon: <Building2 size={24} color="white" />,
    },
    {
      number: 3,
      title: "Strategize for Diversification",
      description: "Diversify across green sectors to boost scores and stability.",
      icon: <Target size={24} color="white" />,
    },
    {
      number: 4,
      title: "Ascend the Leaderboard",
      description: "Compete with players  and climb the rankings.",
      icon: <Trophy size={24} color="white" />,
    },
  ]

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fefefe 0%, #f8f6f0 50%, #f0f4f0 100%)",
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 6, md: 8 },
          }}
        >
          {/* Logo and Title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                backgroundColor: "#7cb342",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(124, 179, 66, 0.3)",
              }}
            >
              <Leaf size={32} color="white" />
            </Box>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: "#7cb342",
                fontWeight: 700,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                lineHeight: 1.2,
              }}
            >
              Stock Market Simulator
            </Typography>
          </Box>

          {/* Subtitle */}
          <Typography
            variant="h5"
            sx={{
              color: "#6c757d",
              mb: 6,
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6,
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              px: { xs: 2, md: 0 },
            }}
          >
            Learn sustainable investing by trading virtual stocks of green companies and competing globally.
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              mb: 8,
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleStartSimulation}
              startIcon={<PlayArrow />}
              sx={{
                backgroundColor: "#7cb342",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "1.1rem",
                padding: "12px 32px",
                borderRadius: "12px",
                minWidth: { xs: "200px", sm: "auto" },
                "&:hover": {
                  backgroundColor: "#689f38",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(124, 179, 66, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Start Simulation
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={handleRegister}
              startIcon={<PersonAdd />}
              sx={{
                borderColor: "#7cb342",
                color: "#7cb342",
                fontWeight: 600,
                fontSize: "1.1rem",
                padding: "12px 32px",
                borderRadius: "12px",
                minWidth: { xs: "200px", sm: "auto" },
                borderWidth: "2px",
                "&:hover": {
                  borderColor: "#689f38",
                  backgroundColor: "rgba(124, 179, 66, 0.05)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(124, 179, 66, 0.2)",
                  borderWidth: "2px",
                },
                transition: "all 0.3s ease",
              }}
            >
              Register
            </Button>
          </Box>
        </Box>

        {/* How It Works Section */}
        <Box
          sx={{
            mb: 8,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 6,
              pl: { xs: 2, md: 0 },
            }}
          >
            <Box
              sx={{
                width: 4,
                height: 40,
                backgroundColor: "#7cb342",
                borderRadius: 2,
                mr: 3,
              }}
            />
            <Typography
              variant="h3"
              sx={{
                color: "#7cb342",
                fontWeight: 700,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              How It Works
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={step.number}>
                <Card
                  sx={{
                    height: "100%",
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #e9ecef",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 4,
                      textAlign: "left",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Step Number and Icon */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: "#7cb342",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                        }}
                      >
                        {step.number}
                      </Box>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: "#7cb342",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {step.icon}
                      </Box>
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#7cb342",
                        fontWeight: 600,
                        mb: 2,
                        fontSize: "1.25rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {step.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      sx={{
                        color: "#6c757d",
                        lineHeight: 1.6,
                        fontSize: "0.95rem",
                        flexGrow: 1,
                      }}
                    >
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

      
      </Container>
    </Box>
  )
}

export default Home
