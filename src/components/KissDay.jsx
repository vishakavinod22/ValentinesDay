import { useState } from 'react'
import './KissDay.css'
import heartsImage from '../assets/hearts.jpg'

function KissDay() {
  const GRID_SIZE = 3
  const TILE_COUNT = GRID_SIZE * GRID_SIZE

  const [tiles, setTiles] = useState([])
  const [gameState, setGameState] = useState('start') // 'start', 'playing', 'solved'
  const [draggedTile, setDraggedTile] = useState(null)

  // Initialize puzzle
  const initializePuzzle = () => {
    const tileArray = []
    for (let i = 0; i < TILE_COUNT; i++) {
      tileArray.push({
        id: i,
        currentPosition: i,
        correctPosition: i,
        row: Math.floor(i / GRID_SIZE),
        col: i % GRID_SIZE
      })
    }
    return tileArray
  }

  // Shuffle tiles
  const shuffleTiles = (tileArray) => {
    const shuffled = [...tileArray]
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tempPosition = shuffled[i].currentPosition
      shuffled[i].currentPosition = shuffled[j].currentPosition
      shuffled[j].currentPosition = tempPosition
    }
    
    // Update row/col based on new positions
    shuffled.forEach(tile => {
      tile.row = Math.floor(tile.currentPosition / GRID_SIZE)
      tile.col = tile.currentPosition % GRID_SIZE
    })
    
    return shuffled
  }

  // Check if puzzle is solved
  const isPuzzleSolved = (tileArray) => {
    return tileArray.every(tile => tile.currentPosition === tile.correctPosition)
  }

  // Handle drag start
  const handleDragStart = (e, tile) => {
    setDraggedTile(tile)
    e.dataTransfer.effectAllowed = 'move'
  }

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  // Handle drop
  const handleDrop = (e, targetTile) => {
    e.preventDefault()
    
    if (!draggedTile || draggedTile.id === targetTile.id) return

    const newTiles = [...tiles]
    const draggedIndex = newTiles.findIndex(t => t.id === draggedTile.id)
    const targetIndex = newTiles.findIndex(t => t.id === targetTile.id)

    // Swap positions
    const tempPosition = newTiles[draggedIndex].currentPosition
    const tempRow = newTiles[draggedIndex].row
    const tempCol = newTiles[draggedIndex].col

    newTiles[draggedIndex].currentPosition = newTiles[targetIndex].currentPosition
    newTiles[draggedIndex].row = newTiles[targetIndex].row
    newTiles[draggedIndex].col = newTiles[targetIndex].col

    newTiles[targetIndex].currentPosition = tempPosition
    newTiles[targetIndex].row = tempRow
    newTiles[targetIndex].col = tempCol

    setTiles(newTiles)
    setDraggedTile(null)

    if (isPuzzleSolved(newTiles)) {
      setTimeout(() => setGameState('solved'), 300)
    }
  }

  const startGame = () => {
    const initialTiles = initializePuzzle()
    const shuffledTiles = shuffleTiles(initialTiles)
    setTiles(shuffledTiles)
    setGameState('playing')
  }

  // Start screen
  if (gameState === 'start') {
    return (
      <div className="kiss-container">
        <h1 className="kiss-title">Kiss Day Puzzle 💋</h1>
        <p className="kiss-instructions">
          Drag and drop tiles today! 💕
        </p>
        <button className="kiss-start-button" onClick={startGame}>
          Start Puzzle
        </button>
      </div>
    )
  }

  // Solved screen
  if (gameState === 'solved') {
    return (
      <div className="kiss-container">
        <h1 className="kiss-title win">Yaaay Unlocked All The Kisses! 💋💕</h1>
        <div className="kiss-solved-image">
          <img src={heartsImage} alt="Hearts" />
        </div>
       
        <button className="kiss-start-button win" onClick={startGame}>
          Play Again
        </button>
      </div>
    )
  }

  // Playing screen
  const tileSize = 100 / GRID_SIZE

  return (
    <div className="kiss-container">
      <h1 className="kiss-title">Kiss Day Puzzle 💋</h1>
      <p className="kiss-instructions-small">Drag and drop tiles to arrange them correctly!</p>

      <div className="kiss-puzzle-board">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className="kiss-tile"
            draggable
            onDragStart={(e) => handleDragStart(e, tile)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, tile)}
            style={{
                width: `${tileSize}%`,
                height: `${tileSize}%`,
                left: `${tile.col * tileSize}%`,
                top: `${tile.row * tileSize}%`,
                backgroundImage: `url(${heartsImage})`,
                backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                backgroundPosition: `${(tile.id % GRID_SIZE) / (GRID_SIZE - 1) * 100}% ${Math.floor(tile.id / GRID_SIZE) / (GRID_SIZE - 1) * 100}%`
              }}
          />
        ))}
      </div>
    </div>
  )
}

export default KissDay