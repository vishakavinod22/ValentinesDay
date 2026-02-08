import { useState } from 'react'
import './ProposeDay.css'

function ProposeDay() {
    
  const [noButtonPosition, setNoButtonPosition] = useState({ top: '50%', left: '60%' })
  const [attempts, setAttempts] = useState(0)
  const [answered, setAnswered] = useState(false)

  const handleNoHover = () => {
    // Move NO button to random position
    const newTop = Math.random() * 80 + 10 // 10% to 90%
    const newLeft = Math.random() * 80 + 10
    
    setNoButtonPosition({ top: `${newTop}%`, left: `${newLeft}%` })
    setAttempts(attempts + 1)
  }

  const handleYesClick = () => {
    setAnswered(true)
  }

  if (answered) {
    return (
      <div className="propose-container">
        <div className="success-message">
          <h1 className="celebration-title">I knew you'd say yes! 💕</h1>
          <p className="celebration-text">Yipeeeeeeee! ✨</p>
          <div className="hearts-animation">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="floating-heart" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }}>
                💕
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="propose-container">
      <h1 className="propose-title">Will You Be My Valentine? 💍</h1>
      
      {/* {attempts > 0 && (
        <p className="attempts-counter">Attempts to say no: {attempts} 😄</p>
      )} */}

        <div className="buttons-container">
            <div className="yes-wrapper">
            <button
                className="yes-button"
                onClick={handleYesClick}
            >
                YES ✨
            </button>
            </div>

            <button
            className="no-button"
            onMouseEnter={handleNoHover}
            onClick={handleNoHover}
            style={{ 
                position: 'absolute',
                top: noButtonPosition.top,
                left: noButtonPosition.left,
                transform: 'translate(-50%, -50%)'
            }}
            >
            No
            </button>
        </div>
    </div>
  )
}

export default ProposeDay