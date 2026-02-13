import { useState } from 'react'
import './ValentineDay.css'

function ValentineDay() {
  const [isOpen, setIsOpen] = useState(false)
  const [sparkles, setSparkles] = useState([])

  const handleCardClick = () => {
    if (!isOpen) {
      setIsOpen(true)
      // Create sparkles
      createSparkles()
    }
  }

  const createSparkles = () => {
    const newSparkles = []
    for (let i = 0; i < 30; i++) {
      newSparkles.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2
      })
    }
    setSparkles(newSparkles)
  }

  return (
    <div className="valentine-container">
      <h1 className="valentine-title"> </h1>

      <div className={`valentine-card ${isOpen ? 'open' : ''}`} onClick={handleCardClick}>
        {/* Front of card (closed) */}
        <div className="card-front">
          <div className="card-front-content">
            <h2 className="card-front-title">Happy Valentine's Day</h2>
            <p className="card-front-subtitle">💌</p>
            <p className="card-click-hint">Click to Open</p>
          </div>
        </div>

        {/* Inside of card (open) */}
        <div className="card-inside">
          <div className="card-left">
            <div className="card-heart">I Love You!</div>
          </div>
          <div className="card-right">
            <div className="card-message">
              <p className="message-line">Wishing you a life</p>
              <p className="message-line">filled with endless love,</p>
              <p className="message-line">joy, and happiness!</p>
              <p className="message-signature">Lots of Love</p>
              <p className="message-footer">Your Valentine 🫶</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sparkles */}
      {isOpen && sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="valentine-sparkle"
          style={{
            left: `${sparkle.left}%`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`
          }}
        >
          ✨
        </div>
      ))}
    </div>
  )
}

export default ValentineDay