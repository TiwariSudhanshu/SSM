"use client"

import { useState, useEffect } from "react"
import {
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Alert,
  LinearProgress,
  Card,
  CardContent,
} from "@mui/material"
import { TrendingUp, RecycleIcon as Eco, BarChart3, Clock, DollarSign, PieChart, Building2 } from "lucide-react"
import { getPortfolio, getCompanies } from "../services/api"
import SocketService from "../services/socket"
import RoundTimer from "../components/RoundTimer"
import useRoundStatus from "../hooks/useRoundStatus"

const Dashboard = () => {
  const [portfolio, setPortfolio] = useState(null)
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { isActive, tradeEnabled } = useRoundStatus()

  const fetchData = async () => {
    try {
      const [portfolioData, companiesData] = await Promise.all([getPortfolio(), getCompanies()])
      setPortfolio(portfolioData)
      setCompanies(companiesData)
    } catch (err) {
      setError("Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Socket.IO listeners
    console.log("Attempting to connect socket...")

    try {
      SocketService.connect()
    } catch (error) {
      console.error("Socket connection failed:", error)
      setError("Socket connection failed")
      return
    }

    // Listen for trade updates
    SocketService.onTradeUpdate((data) => {
      if (data.userId === portfolio?._id) {
        fetchData()
      }
    })

    // Listen for company updates
    SocketService.onCompanyUpdate(() => {
      fetchData()
    })

    // Listen for round status updates
    SocketService.onRoundUpdate(() => {
      fetchData()
    })

    return () => {
      SocketService.disconnect()
    }
  }, [])

  const containerStyle = {
    minHeight: "100vh",
    background: "#f8f9fa",
    padding: { xs: 2, sm: 3, md: 4 },
  }

  const headerCardStyle = {
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    borderRadius: "20px",
    border: "1px solid #e9ecef",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    mb: 4,
    p: { xs: 3, sm: 4 },
  }

  const metricCardStyle = {
    background: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e9ecef",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
    p: 3,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  }

  const portfolioCardStyle = {
    background: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e9ecef",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
    p: { xs: 3, sm: 4 },
    height: "100%",
  }

  const progressBarStyle = {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f1f3f4",
    "& .MuiLinearProgress-bar": {
      backgroundColor: "#7cb342",
      borderRadius: 4,
    },
  }

  const iconStyle = {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    backgroundColor: "#7cb342",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  }

  if (loading) {
    return (
      <Box sx={{ ...containerStyle, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress
          sx={{
            color: "#7cb342",
            width: "48px !important",
            height: "48px !important",
          }}
        />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={containerStyle}>
        <Alert
          severity="error"
          sx={{
            borderRadius: "12px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={containerStyle}>
      {/* Header Section */}
      <Paper sx={headerCardStyle}>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{
                color: "#7cb342",
                fontWeight: "bold",
                fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                mb: 1,
                lineHeight: 1.2,
              }}
            >
              Dashboard
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <Building2 size={24} color="#7cb342" />
              <Typography sx={{ color: "#6c757d", fontSize: "1.25rem", fontWeight: 500 }}>
                Stock Market Simulator
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              background: "#7cb342",
              borderRadius: "12px",
              p: 2,
              color: "white",
              minWidth: { xs: "100%", sm: "auto" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Clock size={20} />
            </Box>
            <RoundTimer />
          </Box>
        </Box>

        {!isActive && (
          <Alert
            severity="info"
            sx={{
              mt: 3,
              borderRadius: "12px",
              backgroundColor: "#e3f2fd",
              border: "1px solid #90caf9",
            }}
          >
            Trading is currently disabled. Trading will be enabled when a new round starts.
          </Alert>
        )}

        {isActive && !tradeEnabled && (
          <Alert
            severity="warning"
            sx={{
              mt: 3,
              borderRadius: "12px",
              backgroundColor: "#fff3e0",
              border: "1px solid #ffcc02",
            }}
          >
            Trading has been disabled for this round.
          </Alert>
        )}
      </Paper>

      <Grid container spacing={3}>
        {/* Performance Metrics */}
        <Grid item xs={12} md={4}>
          <Card sx={metricCardStyle}>
            <Box sx={iconStyle}>
              <TrendingUp size={20} />
            </Box>
            <CardContent sx={{ p: 0 }}>
              <Typography sx={{ color: "#6c757d", fontSize: "0.875rem", mb: 1, fontWeight: 500 }}>ESG Score</Typography>
              <Typography
                sx={{
                  color: "#7cb342",
                  fontSize: "3rem",
                  fontWeight: "bold",
                  mb: 2,
                  lineHeight: 1,
                }}
              >
                {portfolio?.esgScore?.toFixed(0) || 0}%
              </Typography>
              <LinearProgress variant="determinate" value={portfolio?.esgScore || 0} sx={progressBarStyle} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={metricCardStyle}>
            <Box sx={iconStyle}>
              <PieChart size={20} />
            </Box>
            <CardContent sx={{ p: 0 }}>
              <Typography sx={{ color: "#6c757d", fontSize: "0.875rem", mb: 1, fontWeight: 500 }}>
                Diversity Score
              </Typography>
              <Typography
                sx={{
                  color: "#7cb342",
                  fontSize: "3rem",
                  fontWeight: "bold",
                  mb: 2,
                  lineHeight: 1,
                }}
              >
                {portfolio?.sectorScore?.toFixed(0) || 0}%
              </Typography>
              <LinearProgress variant="determinate" value={portfolio?.sectorScore || 0} sx={progressBarStyle} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={metricCardStyle}>
            <Box sx={iconStyle}>
              <BarChart3 size={20} />
            </Box>
            <CardContent sx={{ p: 0 }}>
              <Typography sx={{ color: "#6c757d", fontSize: "0.875rem", mb: 1, fontWeight: 500 }}>
               Final Score
              </Typography>
              <Typography
                sx={{
                  color: "#7cb342",
                  fontSize: "3rem",
                  fontWeight: "bold",
                  mb: 2,
                  lineHeight: 1,
                }}
              >
                {portfolio?.finalScore?.toFixed(0) || 0}%
              </Typography>
              <LinearProgress variant="determinate" value={portfolio?.finalScore || 0} sx={progressBarStyle} />
            </CardContent>
          </Card>
        </Grid>

        {/* Portfolio Summary - Enhanced */}
        <Grid item xs={12} lg={8}>
          <Paper sx={portfolioCardStyle}>
            <Typography
              variant="h4"
              sx={{
                color: "#7cb342",
                fontWeight: "bold",
                mb: 4,
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              Portfolio Summary
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                    borderRadius: "12px",
                    p: 3,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <DollarSign size={24} color="#7cb342" />
                    <Typography sx={{ color: "#495057", fontWeight: 600, fontSize: "1.1rem" }}>
                      Financial Overview
                    </Typography>
                  </Box>
                  <Box sx={{ "& > *": { mb: 2 } }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ color: "#6c757d", fontSize: "0.95rem" }}>Total Value:</Typography>
                      <Typography sx={{ color: "#495057", fontWeight: 600 }}>
                        ${portfolio?.portfolioValue?.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ color: "#6c757d", fontSize: "0.95rem" }}>Cash Balance:</Typography>
                      <Typography sx={{ color: "#495057", fontWeight: 600 }}>
                        ${portfolio?.cashBalance?.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ color: "#6c757d", fontSize: "0.95rem" }}>Normalized Value:</Typography>
                      <Typography sx={{ color: "#495057", fontWeight: 600 }}>
                        {portfolio?.normalizedValue?.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                    borderRadius: "12px",
                    p: 3,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Eco size={24} color="#7cb342" />
                    <Typography sx={{ color: "#495057", fontWeight: 600, fontSize: "1.1rem" }}>ESG Metrics</Typography>
                  </Box>
                  <Box sx={{ "& > *": { mb: 2 } }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ color: "#6c757d", fontSize: "0.95rem" }}>Average ESG Score:</Typography>
                      <Typography sx={{ color: "#495057", fontWeight: 600 }}>
                        {portfolio?.avgESGScore?.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ color: "#6c757d", fontSize: "0.95rem" }}>Total Holdings:</Typography>
                      <Typography sx={{ color: "#495057", fontWeight: 600 }}>
                        {portfolio?.holdings?.length || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Portfolio Distribution */}
            {portfolio?.sectorDistribution && (
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#7cb342",
                    fontWeight: "bold",
                    mb: 3,
                    fontSize: "1.5rem",
                  }}
                >
                  Portfolio Distribution
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(portfolio.sectorDistribution).map(([sector, shares]) => {
                    const percentage =
                      (shares / portfolio.holdings.reduce((total, holding) => total + holding.shares, 0)) * 100
                    return (
                      <Grid item xs={12} sm={6} key={sector}>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography sx={{ color: "#495057", fontSize: "1rem", fontWeight: 500 }}>
                              {sector}
                            </Typography>
                            <Typography sx={{ color: "#7cb342", fontWeight: 700, fontSize: "1rem" }}>
                              {percentage.toFixed(1)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              ...progressBarStyle,
                              height: 10,
                            }}
                          />
                        </Box>
                      </Grid>
                    )
                  })}
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Holdings */}
        <Grid item xs={12} lg={4}>
          <Paper sx={portfolioCardStyle}>
            <Typography
              variant="h5"
              sx={{
                color: "#7cb342",
                fontWeight: "bold",
                mb: 3,
                fontSize: "1.5rem",
              }}
            >
              Your Holdings
            </Typography>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: "#f8f9fa", color: "#495057", fontWeight: 600 }}>
                      Company
                    </TableCell>
                    <TableCell align="right" sx={{ backgroundColor: "#f8f9fa", color: "#495057", fontWeight: 600 }}>
                      Shares
                    </TableCell>
                    <TableCell align="right" sx={{ backgroundColor: "#f8f9fa", color: "#495057", fontWeight: 600 }}>
                      Value
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {portfolio?.holdings.map((holding) => (
                    <TableRow key={holding.company._id} sx={{ "&:hover": { backgroundColor: "#f8f9fa" } }}>
                      <TableCell sx={{ color: "#495057" }}>{holding.company.name}</TableCell>
                      <TableCell align="right" sx={{ color: "#495057" }}>
                        {holding.shares}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#7cb342", fontWeight: 600 }}>
                        ${(holding.shares * holding.company.stockPrice).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Available Companies */}
        <Grid item xs={12}>
          <Paper sx={portfolioCardStyle}>
            <Typography
              variant="h5"
              sx={{
                color: "#7cb342",
                fontWeight: "bold",
                mb: 3,
                fontSize: "1.5rem",
              }}
            >
              Available Companies
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: "#f8f9fa", color: "#495057", fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ backgroundColor: "#f8f9fa", color: "#495057", fontWeight: 600 }}>Sector</TableCell>
                    <TableCell align="right" sx={{ backgroundColor: "#f8f9fa", color: "#495057", fontWeight: 600 }}>
                      Stock Price
                    </TableCell>
                    <TableCell align="right" sx={{ backgroundColor: "#f8f9fa", color: "#495057", fontWeight: 600 }}>
                      Available Shares
                    </TableCell>
                    <TableCell align="right" sx={{ backgroundColor: "#f8f9fa", color: "#495057", fontWeight: 600 }}>
                      ESG Score
                    </TableCell>
                    <TableCell align="right" sx={{ backgroundColor: "#f8f9fa", color: "#495057", fontWeight: 600 }}>
                      Market Cap
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company._id} sx={{ "&:hover": { backgroundColor: "#f8f9fa" } }}>
                      <TableCell sx={{ color: "#495057", fontWeight: 500 }}>{company.name}</TableCell>
                      <TableCell sx={{ color: "#6c757d" }}>{company.sector}</TableCell>
                      <TableCell align="right" sx={{ color: "#7cb342", fontWeight: 600 }}>
                        ${company.stockPrice?.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#495057" }}>
                        {company.availableShares?.toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#495057" }}>
                        {company.esgScore?.toFixed(1)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#495057" }}>
                        ${(company.stockPrice * company.availableShares)?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
