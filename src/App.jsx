import { useState } from 'react'
import {days, messages} from './constants'
import ChocolateDay from './components/ChocolateDay'
import ProposeDay from './components/ProposeDay'
import TeddyDay from './components/TeddyDay'
import './App.css'

function App() {

  // Get today's date
  const today = new Date()
  const month = today.getMonth() 
  const date = today.getDate()
  const year = today.getFullYear()
  // const month = 1; const date = 10; const year = 2026; 

  // Check if we're in the Valentine week period
  const isAfterValentineWeek = year > 2026 || (year === 2026 && (month > 1 || (month === 1 && date > 14)))
  const isDuringValentineWeek = !isAfterValentineWeek

  // Determine current day (during Feb 7-14, 2026)
  let currentDay = null
  if (isDuringValentineWeek && month === 1) { // February
    currentDay = date
  }

  const [roses, setRoses] = useState([])
  const [showMessage, setShowMessage] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null) 

  const [petals] = useState(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4
    }))
  })

  const plantRose = (e) => {
    if (e.target.classList.contains('rose')) return
    
    // Don't plant roses if clicking on buttons or their children
    if (e.target.closest('.day-selector') || 
        e.target.closest('.day-button') ||
        e.target.tagName === 'BUTTON') {
      return
    }
    
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

  // Check if a day should be unlocked
  const isDayUnlocked = (dayDate) => {
    if (isAfterValentineWeek) return true // All days unlocked after Feb 14
    if (currentDay === null) return false // Nothing unlocked before Feb 7
    return dayDate <= currentDay // Unlock days up to current date
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
            className={`day-button ${selectedDay === day.date ? 'active' : isDayUnlocked(day.date) ? 'active' : ''} ${!isDayUnlocked(day.date) ? 'locked' : ''}`}
            disabled={!isDayUnlocked(day.date)}
            onClick={() => setSelectedDay(day.date)}
          >
            <span className="day-emoji">{day.emoji}</span>
            <span className="day-name">{day.name}</span>
          </button>
        ))}
      </div>

      {/* Show different content based on selected day */}
      {(!selectedDay || selectedDay === 7) && (
        <>
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
        </>
      )}

      {selectedDay === 8 && <ProposeDay />}
      {selectedDay === 9 && <ChocolateDay />}  
      {selectedDay === 10 && <TeddyDay />}  
    </div>
  )
}

export default App
