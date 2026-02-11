import { useState, useEffect } from 'react'
import './PromiseDay.css'

function PromiseDay() {
  const [ringPosition, setRingPosition] = useState({ x: 50, y: 50 })
  const [sparkles, setSparkles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [loveMessages, setLoveMessages] = useState([])

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Ring follows mouse directly 
  useEffect(() => {
    setRingPosition(mousePosition)
  }, [mousePosition])

  // Create sparkle trail
  useEffect(() => {
    const sparkleInterval = setInterval(() => {
      const newSparkle = {
        id: Date.now() + Math.random(),
        x: ringPosition.x,
        y: ringPosition.y
      }
      
      setSparkles((prev) => [...prev, newSparkle])

      // Remove sparkle after 1 second
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id))
      }, 1000)
    }, 100) // Create sparkle every 100ms

    return () => clearInterval(sparkleInterval)
  }, [ringPosition])

  // Handle clicks to create "I love you" messages
  const handleClick = (e) => {
    const x = (e.clientX / window.innerWidth) * 100
    const y = (e.clientY / window.innerHeight) * 100
    
    const newMessage = {
      id: Date.now() + Math.random(),
      x,
      y
    }
    
    setLoveMessages((prev) => [...prev, newMessage])
    
    // Remove message after 2 seconds
    setTimeout(() => {
      setLoveMessages((prev) => prev.filter((m) => m.id !== newMessage.id))
    }, 2000)
  }

  useEffect(() => {
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="promise-container">
      <h1 className="promise-title">Promise Day</h1>
      <p className="promise-message">Its a simple one today, move the ring with your mouse and click for sparkles ✨</p>
      <p className="promise-message-mini">A simple promise to love you ♥️</p>

      {/* Sparkle trail */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
        >
          ✨
        </div>
      ))}
      
      {/* I love you messages */}
      {loveMessages.map((msg) => (
        <div
          key={msg.id}
          className="love-message"
          style={{ left: `${msg.x}%`, top: `${msg.y}%` }}
        >
          I love you 💕
        </div>
      ))}

      {/* Promise ring */}
      <div
        className="promise-ring"
        style={{ left: `${ringPosition.x}%`, top: `${ringPosition.y}%` }}
      >
        💍
      </div>
    </div>
  )
}

export default PromiseDay