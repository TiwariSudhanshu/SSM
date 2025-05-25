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
} from "@mui/material"
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
    background: "linear-gradient(135deg, #fefefe 0%, #f8f6f0 50%, #f0f4f0 100%)",
    padding: { xs: 2, sm: 3 },
  }

  const paperStyle = {
    p: { xs: 2.5, sm: 3 },
    backgroundColor: "#ffffff",
    border: "2px solid #e8f5e8",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
    mb: 3,
  }

  const headingStyle = {
    color: "#2d5016",
    fontWeight: "bold",
    mb: 2,
  }

  const subHeadingStyle = {
    color: "#2d5016",
    fontWeight: 600,
    mb: 2,
    fontSize: "1.25rem",
  }

  const metricCardStyle = {
    p: 3,
    backgroundColor: "#ffffff",
    border: "2px solid #e8f5e8",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
    textAlign: "center",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  }

  const progressBarStyle = {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f3f4f6",
    "& .MuiLinearProgress-bar": {
      backgroundColor: "#22c55e",
      borderRadius: 4,
    },
  }

  const tableStyle = {
    "& .MuiTableHead-root": {
      backgroundColor: "#f8fdf8",
    },
    "& .MuiTableCell-head": {
      color: "#2d5016",
      fontWeight: 600,
      fontSize: "0.875rem",
      borderBottom: "2px solid #e8f5e8",
    },
    "& .MuiTableCell-body": {
      color: "#374151",
      fontSize: "0.875rem",
      borderBottom: "1px solid #f3f4f6",
    },
    "& .MuiTableRow-root:hover": {
      backgroundColor: "#f8fdf8",
    },
  }

  if (loading) {
    return (
      <Box sx={{ ...containerStyle, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress
          sx={{
            color: "#22c55e",
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
            "& .MuiAlert-icon": {
              color: "#dc2626",
            },
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
      <Paper sx={paperStyle}>
        <Typography variant="h3" sx={{ ...headingStyle, fontSize: { xs: "2rem", sm: "2.5rem" }, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography sx={{ color: "#6b7280", fontSize: "1.1rem", mb: 3 }}>Stock Market Simulator</Typography>

        <RoundTimer />

        {!isActive && (
          <Alert
            severity="info"
            sx={{
              mt: 2,
              borderRadius: "12px",
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              "& .MuiAlert-icon": {
                color: "#3b82f6",
              },
            }}
          >
            Trading is currently disabled. Trading will be enabled when a new round starts.
          </Alert>
        )}

        {isActive && !tradeEnabled && (
          <Alert
            severity="warning"
            sx={{
              mt: 2,
              borderRadius: "12px",
              backgroundColor: "#fffbeb",
              border: "1px solid #fed7aa",
              "& .MuiAlert-icon": {
                color: "#f59e0b",
              },
            }}
          >
            Trading has been disabled for this round.
          </Alert>
        )}
      </Paper>

      <Grid container spacing={3}>
        {/* Performance Metrics */}
        <Grid item xs={12} md={4}>
          <Paper sx={metricCardStyle}>
            <Typography sx={{ color: "#6b7280", fontSize: "0.875rem", mb: 1 }}>ESG Score</Typography>
            <Typography sx={{ color: "#2d5016", fontSize: "2.5rem", fontWeight: "bold", mb: 2 }}>
              {portfolio?.esgScore?.toFixed(1) || 0}%
            </Typography>
            <LinearProgress variant="determinate" value={portfolio?.esgScore || 0} sx={progressBarStyle} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={metricCardStyle}>
            <Typography sx={{ color: "#6b7280", fontSize: "0.875rem", mb: 1 }}>Diversity Score</Typography>
            <Typography sx={{ color: "#2d5016", fontSize: "2.5rem", fontWeight: "bold", mb: 2 }}>
              {portfolio?.sectorScore?.toFixed(1) || 0}%
            </Typography>
            <LinearProgress variant="determinate" value={portfolio?.sectorScore || 0} sx={progressBarStyle} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={metricCardStyle}>
            <Typography sx={{ color: "#6b7280", fontSize: "0.875rem", mb: 1 }}>Overall Performance</Typography>
            <Typography sx={{ color: "#2d5016", fontSize: "2.5rem", fontWeight: "bold", mb: 2 }}>
              {portfolio?.finalScore?.toFixed(1) || 0}%
            </Typography>
            <LinearProgress variant="determinate" value={portfolio?.finalScore || 0} sx={progressBarStyle} />
          </Paper>
        </Grid>

        {/* Portfolio Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={paperStyle}>
            <Typography variant="h6" sx={subHeadingStyle}>
              Portfolio Summary
            </Typography>
            <Box sx={{ "& > *": { mb: 1.5 } }}>
              <Typography sx={{ color: "#374151", fontSize: "0.95rem" }}>
                <strong style={{ color: "#2d5016" }}>Total Value:</strong> ${portfolio?.portfolioValue?.toFixed(2)}
              </Typography>
              <Typography sx={{ color: "#374151", fontSize: "0.95rem" }}>
                <strong style={{ color: "#2d5016" }}>Average ESG Score:</strong> {portfolio?.avgESGScore?.toFixed(2)}
              </Typography>
              <Typography sx={{ color: "#374151", fontSize: "0.95rem" }}>
                <strong style={{ color: "#2d5016" }}>Normalized Value:</strong> {portfolio?.normalizedValue?.toFixed(2)}
              </Typography>
              <Typography sx={{ color: "#374151", fontSize: "0.95rem" }}>
                <strong style={{ color: "#2d5016" }}>Cash Balance:</strong> ${portfolio?.cashBalance?.toFixed(2)}
              </Typography>
              <Typography sx={{ color: "#374151", fontSize: "0.95rem" }}>
                <strong style={{ color: "#2d5016" }}>Total Holdings:</strong> {portfolio?.holdings?.length || 0}
              </Typography>
            </Box>

            {portfolio?.sectorDistribution && (
              <Box sx={{ mt: 3 }}>
                <Typography sx={subHeadingStyle}>Portfolio Distribution</Typography>
                {Object.entries(portfolio.sectorDistribution).map(([sector, shares]) => (
                  <Box key={sector} sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography sx={{ color: "#374151", fontSize: "0.875rem" }}>{sector}</Typography>
                      <Typography sx={{ color: "#2d5016", fontWeight: 600, fontSize: "0.875rem" }}>
                        {((shares / portfolio.holdings.reduce((total, holding) => total + holding.shares, 0)) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(shares / portfolio.holdings.reduce((total, holding) => total + holding.shares, 0)) * 100}
                      sx={progressBarStyle}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Holdings */}
        <Grid item xs={12} md={6}>
          <Paper sx={paperStyle}>
            <Typography variant="h6" sx={subHeadingStyle}>
              Your Holdings
            </Typography>
            <TableContainer>
              <Table sx={tableStyle}>
                <TableHead>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <TableCell align="right">Shares</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell align="right">ESG Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {portfolio?.holdings.map((holding) => (
                    <TableRow key={holding.company._id}>
                      <TableCell>{holding.company.name}</TableCell>
                      <TableCell align="right">{holding.shares}</TableCell>
                      <TableCell align="right">${(holding.shares * holding.company.stockPrice).toFixed(2)}</TableCell>
                      <TableCell align="right">{holding.company.esgScore?.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Available Companies */}
        <Grid item xs={12}>
          <Paper sx={paperStyle}>
            <Typography variant="h6" sx={subHeadingStyle}>
              Available Companies
            </Typography>
            <TableContainer>
              <Table sx={tableStyle}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Sector</TableCell>
                    <TableCell align="right">Stock Price</TableCell>
                    <TableCell align="right">Available Shares</TableCell>
                    <TableCell align="right">ESG Score</TableCell>
                    <TableCell align="right">Market Cap</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company._id}>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>{company.sector}</TableCell>
                      <TableCell align="right">${company.stockPrice?.toFixed(2)}</TableCell>
                      <TableCell align="right">{company.availableShares?.toLocaleString()}</TableCell>
                      <TableCell align="right">{company.esgScore?.toFixed(1)}</TableCell>
                      <TableCell align="right">
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
