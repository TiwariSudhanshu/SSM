"use client"

import { useState, useEffect } from "react"
import { Paper, Typography } from "@mui/material"
import SocketService from "../services/socket"
import api from "../services/api"

const RoundTimer = () => {
  const [timeLeft, setTimeLeft] = useState(null)
  const [isRoundActive, setIsRoundActive] = useState(false)

  useEffect(() => {
    // Fetch initial round status
    const fetchRoundStatus = async () => {
      try {
        const response = await api.get("/admin/rounds/status")
        if (response.data.isActive && response.data.round) {
          setIsRoundActive(true)
          const endTime = new Date(response.data.round.endTime).getTime()
          updateTimer(endTime)
        }
      } catch (error) {
        console.error("Error fetching round status:", error)
      }
    }

    fetchRoundStatus()

    const handleRoundUpdate = (data) => {
      if (data.type === "start") {
        setIsRoundActive(true)
        const endTime = new Date(data.round.endTime).getTime()
        updateTimer(endTime)
      } else if (data.type === "end") {
        setIsRoundActive(false)
        setTimeLeft(null)
      }
    }

    SocketService.onRoundUpdate(handleRoundUpdate)

    return () => {
      SocketService.offRoundUpdate(handleRoundUpdate)
    }
  }, [])

  const updateTimer = (endTime) => {
    // Clear any existing timer
    if (window.timerInterval) {
      clearInterval(window.timerInterval)
    }

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = endTime - now

      if (distance <= 0) {
        clearInterval(timer)
        setTimeLeft(null)
        setIsRoundActive(false)
        return
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)
      setTimeLeft({ minutes, seconds })
    }, 1000)

    // Store timer reference globally to prevent memory leaks
    window.timerInterval = timer

    return () => clearInterval(timer)
  }

  if (!isRoundActive || !timeLeft) {
    return null
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        backgroundColor: "transparent",
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        border: "1px solid #16a34a",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(34, 197, 94, 0.2)",
        textAlign: "center",
        color: "white",
        position: "relative",
        overflow: "hidden",
        minWidth: "80px",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          borderRadius: "7px",
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.65rem",
          fontWeight: 500,
          opacity: 0.9,
          position: "relative",
          zIndex: 1,
          lineHeight: 1,
        }}
      >
        Round Active
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontSize: "1.1rem",
          fontWeight: "bold",
          letterSpacing: "0.02em",
          position: "relative",
          zIndex: 1,
          textShadow: "0 1px 2px rgba(0,0,0,0.1)",
          lineHeight: 1.2,
          mt: 0.25,
        }}
      >
        {timeLeft.minutes.toString().padStart(2, "0")}:{timeLeft.seconds.toString().padStart(2, "0")}
      </Typography>
    </Paper>
  )
}

export default RoundTimer