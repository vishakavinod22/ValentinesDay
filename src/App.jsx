import { useState } from 'react'
import './App.css'

function App() {
  
  const days = [
    { date: 7, name: 'Feb 7', emoji: '🌹' },
    { date: 8, name: 'Feb 8', emoji: '💍' },
    { date: 9, name: 'Feb 9', emoji: '🍫' },
    { date: 10, name: 'Feb 10', emoji: '🧸' },
    { date: 11, name: 'Feb 11', emoji: '💝' },
    { date: 12, name: 'Feb 12', emoji: '🤗' },
    { date: 13, name: 'Feb 13', emoji: '💋' },
    { date: 14, name: 'Feb 14', emoji: '❤️' }
  ]

  const messages = [
    "You're amazing! 💕",
    "You light up my world! ✨",
    "You're one in a million! 🌟",
    "You make me smile! 😊",
    "You're absolutely wonderful! 🌺",
    "You're my sunshine! ☀️",
    "You're incredible! 💖",
    "You're simply the best! 🎉",
    "You're a gem! 💎",
    "You're truly special! 🌹"
  ]

  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();

  const [roses, setRoses] = useState([])
  const [showMessage, setShowMessage] = useState(null)
  const [petals] = useState(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4
    }))
  })

  const plantRose = (e) => {
    // Don't plant if clicking on a rose
    if (e.target.classList.contains('rose')) return
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    const newRose = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      message: randomMessage
    }
    setRoses([...roses, newRose])
  }

  const handleRoseClick = (e, rose) => {
    e.stopPropagation()
    setShowMessage({ text: rose.message, x: rose.x, y: rose.y })
    setTimeout(() => setShowMessage(null), 2000)
  }

  return (
    <div className="app" onClick={plantRose}>
      {/* Falling petals */}
      <div className="petals-container">
        {petals.map((petal) => (
          <div
            key={petal.id}
            className="petal"
            style={{
              left: `${petal.left}%`,
              animationDelay: `${petal.delay}s`,
              animationDuration: `${petal.duration}s`
            }}
          >
            🌸
          </div>
        ))}
      </div>

      <div className="day-selector">
        {days.map((day) => (
          <button
            key={day.date}
            className={`day-button ${currentDay === day.date ? 'active' : 'locked'}`}
            disabled={currentDay !== day.date}
          >
            <span className="day-emoji">{day.emoji}</span>
            <span className="day-name">{day.name}</span>
          </button>
        ))}
      </div>

      <h1 className="title">Rose Day 🌹</h1>
      
      <p className="instruction">Click anywhere to plant a rose! Click roses to reveal messages! 💌</p>
      <p className="counter">Roses planted: {roses.length}</p>

      {roses.map((rose) => (
        <div
          key={rose.id}
          className="rose"
          style={{ left: rose.x, top: rose.y }}
          onClick={(e) => handleRoseClick(e, rose)}
        >
          🌹
        </div>
      ))}

      {showMessage && (
        <div
          className="message-popup"
          style={{ left: showMessage.x, top: showMessage.y }}
        >
          {showMessage.text}
        </div>
      )}
    </div>
  )
}

export default App