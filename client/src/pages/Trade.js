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
  Chip,
  Divider,
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
                        {company.name} - ₹{company.stockPrice}
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
                minHeight: "500px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  ...headingStyle,
                  fontSize: "1.25rem",
                  mb: 3,
                }}
              >
                Company Details
              </Typography>

              {selectedCompany ? (
                <>
                  {companies
                    .filter((company) => company._id === selectedCompany)
                    .map((company) => (
                      <Box key={company._id}>
                        {/* Company Header */}
                        <Box sx={{ mb: 4 }}>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              color: "#2d5016", 
                              fontWeight: 700,
                              mb: 1,
                              fontSize: "1.5rem"
                            }}
                          >
                            {company.name}
                          </Typography>
                          <Chip 
                            label={company.sector}
                            sx={{
                              backgroundColor: "#f0fdf4",
                              color: "#16a34a",
                              fontWeight: 600,
                              border: "1px solid #bbf7d0",
                              borderRadius: "8px",
                              fontSize: "0.8rem"
                            }}
                          />
                        </Box>

                        <Divider sx={{ mb: 3, borderColor: "#e8f5e8" }} />

                        {/* Key Metrics */}
                        <Box sx={{ mb: 4 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: "#2d5016", 
                              fontWeight: 600,
                              mb: 2.5,
                              fontSize: "1.1rem"
                            }}
                          >
                            Key Metrics
                          </Typography>
                          
                          <Grid container spacing={2.5}>
                            <Grid item xs={6}>
                              <Paper 
                                elevation={0}
                                sx={{
                                  p: 2,
                                  backgroundColor: "#f8fffe",
                                  border: "1px solid #d1fae5",
                                  borderRadius: "12px",
                                  textAlign: "center"
                                }}
                              >
                                <Typography 
                                  sx={{ 
                                    color: "#6b7280", 
                                    fontSize: "0.8rem",
                                    fontWeight: 500,
                                    mb: 0.5
                                  }}
                                >
                                  Stock Price
                                </Typography>
                                <Typography 
                                  sx={{ 
                                    color: "#16a34a", 
                                    fontSize: "1.25rem",
                                    fontWeight: 700
                                  }}
                                >
                                  ₹{company.stockPrice}
                                </Typography>
                              </Paper>
                            </Grid>
                            
                            <Grid item xs={6}>
                              <Paper 
                                elevation={0}
                                sx={{
                                  p: 2,
                                  backgroundColor: "#f8fffe",
                                  border: "1px solid #d1fae5",
                                  borderRadius: "12px",
                                  textAlign: "center"
                                }}
                              >
                                <Typography 
                                  sx={{ 
                                    color: "#6b7280", 
                                    fontSize: "0.8rem",
                                    fontWeight: 500,
                                    mb: 0.5
                                  }}
                                >
                                  ESG Score
                                </Typography>
                                <Typography 
                                  sx={{ 
                                    color: "#16a34a", 
                                    fontSize: "1.25rem",
                                    fontWeight: 700
                                  }}
                                >
                                  {company.esgScore}
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Additional Information */}
                        <Box sx={{ mb: 4 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: "#2d5016", 
                              fontWeight: 600,
                              mb: 2.5,
                              fontSize: "1.1rem"
                            }}
                          >
                            Additional Information
                          </Typography>
                          
                          <Box 
                            sx={{ 
                              p: 2.5,
                              backgroundColor: "#fafafa",
                              border: "1px solid #e5e7eb",
                              borderRadius: "12px",
                              mb: 2
                            }}
                          >
                            <Typography 
                              sx={{ 
                                color: "#6b7280", 
                                fontSize: "0.8rem",
                                fontWeight: 500,
                                mb: 0.5,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                              }}
                            >
                              Available Shares
                            </Typography>
                            <Typography 
                              sx={{ 
                                color: "#374151", 
                                fontSize: "1.1rem",
                                fontWeight: 600
                              }}
                            >
                              {company.availableShares?.toLocaleString() || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Company Description */}
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: "#2d5016", 
                              fontWeight: 600,
                              mb: 2,
                              fontSize: "1.1rem"
                            }}
                          >
                            About Company
                          </Typography>
                          
                          <Box 
                            sx={{ 
                              p: 2.5,
                              backgroundColor: "#f9fafb",
                              border: "1px solid #e5e7eb",
                              borderRadius: "12px"
                            }}
                          >
                            <Typography 
                              sx={{ 
                                color: "#4b5563", 
                                fontSize: "0.95rem",
                                lineHeight: 1.6,
                                fontWeight: 400
                              }}
                            >
                              {company.description || 'No description available.'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                </>
              ) : (
                <Box 
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "400px",
                    textAlign: "center"
                  }}
                >
                  <Box 
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: "#f3f4f6",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2
                    }}
                  >
                    <Typography 
                      sx={{ 
                        fontSize: "2rem",
                        color: "#9ca3af"
                      }}
                    >
                      📊
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      color: "#6b7280",
                      fontWeight: 500,
                      fontSize: "1.1rem",
                      mb: 1
                    }}
                  >
                    No Company Selected
                  </Typography>
                  <Typography
                    sx={{
                      color: "#9ca3af",
                      fontSize: "0.9rem",
                      maxWidth: "280px"
                    }}
                  >
                    Choose a company from the dropdown above to view detailed information
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default Trade