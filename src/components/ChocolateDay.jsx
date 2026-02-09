import { useState, useEffect, useRef } from 'react'
import './ChocolateDay.css'

function ChocolateDay() {
  const [gameState, setGameState] = useState('start') // 'start', 'playing', 'ended'
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [chocolates, setChocolates] = useState([])
  const [basketPosition, setBasketPosition] = useState(50) // percentage from left
  const gameAreaRef = useRef(null)
  const nextId = useRef(0)

  const chocolateTypes = [
    { emoji: '🍫', points: 1, rarity: 0.4 },
    { emoji: '🍬', points: 1, rarity: 0.3 },
    { emoji: '🍭', points: 1, rarity: 0.2 },
    { emoji: '🧁', points: 1, rarity: 0.1 }
  ]

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('ended')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState])

  // Mouse movement for basket
  useEffect(() => {
    if (gameState !== 'playing') return

    const handleMouseMove = (e) => {
      if (!gameAreaRef.current) return
      const rect = gameAreaRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = (x / rect.width) * 100
      setBasketPosition(Math.max(5, Math.min(95, percentage)))
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [gameState])

  // Spawn chocolates
  useEffect(() => {
    if (gameState !== 'playing') return

    const spawnInterval = setInterval(() => {
      const random = Math.random()
      let selectedType = chocolateTypes[0]
      let cumulative = 0

      for (const type of chocolateTypes) {
        cumulative += type.rarity
        if (random <= cumulative) {
          selectedType = type
          break
        }
      }

      const newChocolate = {
        id: nextId.current++,
        emoji: selectedType.emoji,
        points: selectedType.points,
        x: Math.random() * 90 + 5, // 5% to 95%
        spawnTime: Date.now()
      }

      setChocolates((prev) => [...prev, newChocolate])
    }, 3000) // Spawn every 1000ms

    return () => clearInterval(spawnInterval)
  }, [gameState])

  // Check collisions and clean up chocolates
  useEffect(() => {
    if (gameState !== 'playing') return

    const checkInterval = setInterval(() => {
      const now = Date.now()
      
      setChocolates((prev) => {
        return prev.filter((choc) => {
          const elapsed = now - choc.spawnTime
          const chocolateY = (elapsed / 15) // Y position based on time elapsed
          
          // Check if caught
          const distance = Math.abs(choc.x - basketPosition)
          if (chocolateY >= 340 && chocolateY <= 380 && distance < 10) {
            setScore((s) => s + choc.points)
            return false // Remove caught chocolate
          }

          // Check if missed (fell off screen)
          if (chocolateY > 420) {
            return false // Remove missed chocolate
          }

          return true // Keep chocolate
        })
      })
    }, 50) // Check every 50ms

    return () => clearInterval(checkInterval)
  }, [gameState, basketPosition])

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setTimeLeft(60)
    setChocolates([])
    nextId.current = 0
  }

  const playAgain = () => {
    startGame()
  }

  const getEndMessage = () => {
    if (score >= 50) return "Chocolate master! 🏆"
    if (score >= 25) return "Chocolate lover! ✨"
    if (score >= 10) return "You're doing great! 🍫"
    return "Sweet effort! 💕"
  }

  // Start screen
  if (gameState === 'start') {
    return (
      <div className="chocolate-container">
        <h1 className="chocolate-title">Chocolate Catcher 🍫</h1>
        <p className="chocolate-instructions">
          Move your mouse to catch falling chocolates!<br/>
          You have 60 seconds. Good luck! 💕
        </p>
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      </div>
    )
  }

  // End screen
  if (gameState === 'ended') {
    return (
      <div className="chocolate-container">
        <h1 className="chocolate-title">Game Over! 🍫</h1>
        <p className="final-score">Final Score: {score}</p>
        <p className="end-message">{getEndMessage()}</p>
        <button className="start-button" onClick={playAgain}>
          Play Again
        </button>
      </div>
    )
  }

  // Calculate Y position for each chocolate based on time
  const getChocolateY = (choc) => {
    const elapsed = Date.now() - choc.spawnTime
    return (elapsed / 15)  // Faster fall speed
  }

  // Playing screen
  return (
    <div className="chocolate-container">
      <div className="game-header">
        <div className="timer">⏱️ {timeLeft}s</div>
        <div className="score">Score: {score}</div>
      </div>

      <div className="game-area" ref={gameAreaRef}>
        {/* Falling chocolates */}
        {chocolates.map((choc) => (
          <div
            key={choc.id}
            className="chocolate"
            style={{ 
              left: `${choc.x}%`, 
              top: `${getChocolateY(choc)}px`,
              transition: 'top 0.05s linear'
            }}
          >
            {choc.emoji}
          </div>
        ))}
        
        {/* Basket */}
        <div 
          className="basket"
          style={{ left: `${basketPosition}%` }}
        >
          🧺
        </div>
      </div>
    </div>
  )
}

export default ChocolateDay