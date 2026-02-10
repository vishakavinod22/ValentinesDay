import { useState, useEffect } from 'react'
import './TeddyDay.css'

function TeddyDay() {
  const [gameState, setGameState] = useState('start') // 'start', 'playing', 'ended'
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [teddies, setTeddies] = useState([])

  const teddyTypes = [
    { emoji: '🧸', points: 2, rarity: 0.5 },    // Brown teddy - common
    { emoji: '💝', points: 4, rarity: 0.25 },   // Pink teddy - uncommon
    { emoji: '💣', points: -3, rarity: 0.15 },   // Bomb - reduces score!
    { emoji: '💔', points: -5, rarity: 0.1 },    // Broken Heart - Bbig penalty
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

  // Spawn teddies
  useEffect(() => {
    if (gameState !== 'playing') return

    const spawnInterval = setInterval(() => {
      const random = Math.random()
      let selectedType = teddyTypes[0]
      let cumulative = 0

      for (const type of teddyTypes) {
        cumulative += type.rarity
        if (random <= cumulative) {
          selectedType = type
          break
        }
      }

      const newTeddy = {
        id: Date.now() + Math.random(),
        emoji: selectedType.emoji,
        points: selectedType.points,
        x: Math.random() * 80 + 10, // 10% to 90%
        y: Math.random() * 70 + 15  // 15% to 85%
      }

      setTeddies((prev) => [...prev, newTeddy])

      // Remove teddy after 1.5 seconds if not clicked
      setTimeout(() => {
        setTeddies((prev) => prev.filter((t) => t.id !== newTeddy.id))
      }, 1500)
    }, 800) // Spawn every 800ms

    return () => clearInterval(spawnInterval)
  }, [gameState])

  const handleTeddyClick = (teddy) => {
    setScore((prev) => Math.max(0, prev + teddy.points)) // Don't go below 0
    setTeddies((prev) => prev.filter((t) => t.id !== teddy.id))
  }

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setTimeLeft(60)
    setTeddies([])
  }

  const playAgain = () => {
    startGame()
  }

  const getCoupons = () => {
    if (score >= 61) return 20
    if (score >= 41) return 15
    if (score >= 21) return 10
    return 5
  }

//   const getCouponMessage = () => {
//     if (score >= 61) return "20 Hug Coupons + Bonus Forever Hugs! 🎟️✨"
//     if (score >= 41) return "15 Hug Coupons! 🎟️🎟️🎟️"
//     if (score >= 21) return "10 Hug Coupons! 🎟️🎟️"
//     return "5 Hug Coupons! 🎟️"
//   }

  // Start screen
  if (gameState === 'start') {
    return (
      <div className="teddy-container">
        <h1 className="teddy-title">Teddy Rush 🧸</h1>
        <p className="teddy-instructions">
          Click the teddies before they disappear!<br/>
          🧸 Brown = +2 | 💝 Pink = +4<br/>
          💣 Bomb = -3 | 💔 Broken Heart = -5<br/>
          Earn hug coupons based on your score! 💕
        </p>
        <button className="teddy-start-button" onClick={startGame}>
          Start Game
        </button>
      </div>
    )
  }

  // End screen
  if (gameState === 'ended') {
    return (
      <div className="teddy-container">
        <h1 className="teddy-title">Game Over! 🧸</h1>
        {/* <p className="teddy-final-score">Your Score: {score} points</p> */}
        <p className="teddy-coupons">You earned: {score} Hug Coupons 🎟️</p>
        <p className="teddy-redeem">Redeem anytime for cuddles and love! 💕</p>
        <button className="teddy-start-button" onClick={playAgain}>
          Play Again
        </button>
      </div>
    )
  }

  // Playing screen
  return (
    <div className="teddy-container">
      <div className="teddy-game-header">
        <div className="teddy-timer">⏱️ {timeLeft}s</div>
        <div className="teddy-score">Score: {score}</div>
      </div>

      <div className="teddy-game-area">
        {teddies.map((teddy) => (
          <div
            key={teddy.id}
            className="teddy-item"
            style={{ left: `${teddy.x}%`, top: `${teddy.y}%` }}
            onClick={() => handleTeddyClick(teddy)}
          >
            {teddy.emoji}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeddyDay