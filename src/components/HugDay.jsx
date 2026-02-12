import { useState } from 'react'
import { hugQuizQuestions } from '../constants'
import './HugDay.css'

function HugDay() {
  const [gameState, setGameState] = useState('start') // 'start', 'playing', 'ended'
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState([]) 

  // Distance calculation: start at 10 steps apart
  // Each correct = -1 step (closer), each wrong = +1 step (further)
  // But don't let distance go above 10 (starting position)
  const distance = Math.max(0, 10 - score)

  // Helper function to shuffle and pick 10 random questions
  const getRandomQuestions = () => {
    const shuffled = [...hugQuizQuestions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 10)
  }

  const startGame = () => {
    setGameState('playing')
    setCurrentQuestion(0)
    setScore(0)
    setWrongAnswers(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setQuizQuestions(getRandomQuestions()) 
  }

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    setShowFeedback(true)

    const isCorrect = answerIndex === quizQuestions[currentQuestion].correctAnswer

    if (isCorrect) {
      setScore(score + 1)
    } else {
      setWrongAnswers(wrongAnswers + 1)
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < 9) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      } else {
        // Game over after question 10
        setGameState('ended')
      }
    }, 1000)
  }

  const playAgain = () => {
    startGame()
  }

  const getEndMessage = () => {
    if (score === 10) {
      return {
        title: 'Perfect Hug! 🧸🤗🧸',
        emoji: '🧸🤗🧸',
        message: 'A perfect 10/10! They hugged with all their love! 💕',
        won: true
      }
    } else if (score >= 8) {
      return {
        title: 'So Close! 🧸🤝🧸',
        emoji: '🧸🤝🧸',
        message: 'Just close enough for a handshake!',
        won: false
      }
    } else if (score >= 7) {
      return {
        title: 'They See Each Other! 🧸👀🧸',
        emoji: '🧸 👀 🧸',
        message: 'Just close enough to see each other! ',
        won: false
      }
    } else {
      return {
        title: 'So Far Apart! 🧸😢🧸',
        emoji: '🧸 😢 🧸',
        message: 'Might as well do long distance! 💔',
        won: false
      }
    }
  }

  // Start screen
  if (gameState === 'start') {
    return (
      <div className="hug-container">
        <h1 className="hug-title">Hug Day Quiz 🧸💕</h1>
        <p className="hug-instructions">
          Answer questions to bring the teddies together! 🤗
        </p>
        <button className="hug-start-button" onClick={startGame}>
          Start Quiz
        </button>
      </div>
    )
  }

  // End screen
  if (gameState === 'ended') {
    const endResult = getEndMessage()

    return (
      <div className="hug-container">
        <h1 className="hug-title">{endResult.title}</h1>
        <p className="hug-final-score">
          Final Score: {score}/10 correct
        </p>
        {endResult.won ? (
          <>
            <div className="hug-success">
              <div className="hug-teddies-final">{endResult.emoji}</div>
              <p className="hug-success-message">{endResult.message}</p>
            </div>
          </>
        ) : (
          <>
            <div className="hug-fail">
              <div className="hug-teddies-final-apart-text">{endResult.emoji}</div>
              <p className="hug-fail-message">{endResult.message}</p>
            </div>
          </>
        )}
        <button className="hug-start-button" onClick={playAgain}>
          Play Again
        </button>
      </div>
    )
  }

  // Playing screen
  const question = quizQuestions[currentQuestion]
  const progressPercent = ((10 - distance) / 10) * 100

  return (
    <div className="hug-container">
      <h1 className="hug-title">Hug Day Quiz 🧸💕</h1>

      <div className="hug-progress-info">
        <div>Question {currentQuestion + 1}/10</div>
        <div>✅ {score} correct | ❌ {wrongAnswers} wrong</div>
      </div>

      {/* Progress bar with teddies (no fill) */}
      <div className="hug-progress-container">
        <div className="hug-progress-bar">
          <div className="hug-teddy-left" style={{ left: `${progressPercent / 2}%` }}>🧸</div>
          <div className="hug-teddy-right" style={{ right: `${progressPercent / 2}%` }}>🧸</div>
        </div>
      </div>

      <div className="hug-need-info">Get 10/10 for a perfect hug! 💕</div>

      {/* Question */}
      <div className="hug-question-box">
        <h2 className="hug-question">{question.question}</h2>

        <div className="hug-options">
          {question.options.map((option, index) => {
            let buttonClass = 'hug-option-button'
            
            if (showFeedback) {
              if (index === question.correctAnswer) {
                buttonClass += ' correct'
              } else if (index === selectedAnswer) {
                buttonClass += ' wrong'
              }
            }

            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleAnswer(index)}
                disabled={showFeedback}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default HugDay