"use client"

import { useState, useEffect } from "react"
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material"
import { getCompanies, executeTrade } from "../services/api"
import SocketService from "../services/socket"
import useRoundStatus from "../hooks/useRoundStatus"

const Trade = () => {
  const [companies, setCompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState("")
  const [shares, setShares] = useState("")
  const [tradeType, setTradeType] = useState("BUY")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { isActive, tradeEnabled } = useRoundStatus()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesData = await getCompanies()

        // Ensure we have valid data
        if (Array.isArray(companiesData)) {
          setCompanies(companiesData)
        } else {
          console.error("Invalid companies data:", companiesData)
          setError("Failed to load companies")
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Socket.IO listeners for real-time updates
    SocketService.connect()
    SocketService.onCompanyUpdate(() => {
      fetchData()
    })

    return () => {
      SocketService.disconnect()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      await executeTrade({
        companyId: selectedCompany,
        type: tradeType,
        shares: Number.parseInt(shares),
      })
      setSuccess("Trade executed successfully")
      setSelectedCompany("")
      setShares("")
    } catch (err) {
      setError(err.message || "Failed to execute trade")
    }
  }

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
  }

  const headingStyle = {
    color: "#2d5016",
    fontWeight: "bold",
    mb: 3,
  }

  const inputStyle = {
    mb: 2.5,
    "& .MuiInputLabel-root": {
      color: "#6b7280",
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fafafa",
      "& fieldset": {
        borderColor: "#e5e7eb",
        borderWidth: "1.5px",
      },
      "&:hover fieldset": {
        borderColor: "#86efac",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#22c55e",
        borderWidth: "2px",
      },
    },
    "& .MuiInputBase-input": {
      padding: "14px 16px",
    },
  }

  const selectStyle = {
    mb: 2.5,
    "& .MuiInputLabel-root": {
      color: "#6b7280",
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fafafa",
      "& fieldset": {
        borderColor: "#e5e7eb",
        borderWidth: "1.5px",
      },
      "&:hover fieldset": {
        borderColor: "#86efac",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#22c55e",
        borderWidth: "2px",
      },
    },
  }

  const buttonStyle = {
    mt: 2,
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
  }

  if (!isActive) {
    return (
      <Box sx={containerStyle}>
        <Paper sx={paperStyle}>
          <Alert
            severity="info"
            sx={{
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
        </Paper>
      </Box>
    )
  }

  if (!tradeEnabled) {
    return (
      <Box sx={containerStyle}>
        <Paper sx={paperStyle}>
          <Alert
            severity="warning"
            sx={{
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
        </Paper>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box
        sx={{
          ...containerStyle,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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

  return (
    <Box sx={containerStyle}>
      <Paper sx={paperStyle}>
        <Typography variant="h4" sx={headingStyle}>
          Trading Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                ...paperStyle,
                border: "1px solid #e8f5e8",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  ...headingStyle,
                  fontSize: "1.25rem",
                  mb: 2,
                }}
              >
                Execute Trade
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
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

              {success && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 2,
                    borderRadius: "12px",
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    "& .MuiAlert-icon": {
                      color: "#22c55e",
                    },
                  }}
                >
                  {success}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <FormControl fullWidth sx={selectStyle}>
                  <InputLabel>Company</InputLabel>
                  <Select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} required>
                    {companies.map((company) => (
                      <MenuItem key={company._id} value={company._id}>
                        {company.name} - ${company.stockPrice}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={selectStyle}>
                  <InputLabel>Trade Type</InputLabel>
                  <Select value={tradeType} onChange={(e) => setTradeType(e.target.value)} required>
                    <MenuItem value="BUY">Buy</MenuItem>
                    <MenuItem value="SELL">Sell</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Number of Shares"
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  required
                  inputProps={{ min: 1 }}
                  sx={inputStyle}
                />

                <Button type="submit" variant="contained" fullWidth sx={buttonStyle}>
                  Execute Trade
                </Button>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                ...paperStyle,
                border: "1px solid #e8f5e8",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  ...headingStyle,
                  fontSize: "1.25rem",
                  mb: 2,
                }}
              >
                Company Details
              </Typography>

              {selectedCompany ? (
                <>
                  {companies
                    .filter((company) => company._id === selectedCompany)
                    .map((company) => (
                      <Box key={company._id} sx={{ "& > *": { mb: 1.5 } }}>
                        <Typography sx={{ color: "#374151", fontSize: "0.95rem" }}>
                          <strong style={{ color: "#2d5016" }}>Name:</strong> {company.name}
                        </Typography>
                        <Typography sx={{ color: "#374151", fontSize: "0.95rem" }}>
                          <strong style={{ color: "#2d5016" }}>Sector:</strong> {company.sector}
                        </Typography>
                        <Typography sx={{ color: "#374151", fontSize: "0.95rem" }}>
                          <strong style={{ color: "#2d5016" }}>Stock Price:</strong> ${company.stockPrice}
                        </Typography>
                        <Typography sx={{ color: "#374151", fontSize: "0.95rem" }}>
                          <strong style={{ color: "#2d5016" }}>Available Shares:</strong> {company.availableShares}
                        </Typography>
                        <Typography sx={{ color: "#374151", fontSize: "0.95rem" }}>
                          <strong style={{ color: "#2d5016" }}>ESG Score:</strong> {company.esgScore}
                        </Typography>
                        <Typography sx={{ color: "#374151", fontSize: "0.95rem" }}>
                          <strong style={{ color: "#2d5016" }}>Description:</strong> {company.description}
                        </Typography>
                      </Box>
                    ))}
                </>
              ) : (
                <Typography
                  sx={{
                    color: "#6b7280",
                    fontStyle: "italic",
                    textAlign: "center",
                    py: 4,
                  }}
                >
                  Select a company to view details
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default Trade
