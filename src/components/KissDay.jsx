import { useState, useEffect } from 'react'
import heartsImage from '/src/images/hearts.jpg'
import './KissDay.css'

function KissDay() {
  const GRID_SIZE = 3
  const TILE_COUNT = GRID_SIZE * GRID_SIZE
  const IMAGE_PATH = heartsImage

  const [tiles, setTiles] = useState([])
  const [gameState, setGameState] = useState('start') // 'start', 'playing', 'solved'
  const [moves, setMoves] = useState(0)

  // Initialize puzzle
  const initializePuzzle = () => {
    const tileArray = []
    for (let i = 0; i < TILE_COUNT - 1; i++) {
      tileArray.push({
        id: i,
        position: i,
        row: Math.floor(i / GRID_SIZE),
        col: i % GRID_SIZE
      })
    }
    // Add empty tile at the end
    tileArray.push({
      id: TILE_COUNT - 1,
      position: TILE_COUNT - 1,
      row: GRID_SIZE - 1,
      col: GRID_SIZE - 1,
      isEmpty: true
    })
    return tileArray
  }

  // Shuffle tiles
  const shuffleTiles = (tileArray) => {
    const shuffled = [...tileArray]
    // Perform random valid moves to ensure solvability
    for (let i = 0; i < 200; i++) {
      const emptyTile = shuffled.find(t => t.isEmpty)
      const movableTiles = getMovableTiles(shuffled, emptyTile)
      if (movableTiles.length > 0) {
        const randomTile = movableTiles[Math.floor(Math.random() * movableTiles.length)]
        swapTiles(shuffled, randomTile, emptyTile)
      }
    }
    return shuffled
  }

  // Get tiles that can move into empty space
  const getMovableTiles = (tileArray, emptyTile) => {
    return tileArray.filter(tile => {
      if (tile.isEmpty) return false
      const rowDiff = Math.abs(tile.row - emptyTile.row)
      const colDiff = Math.abs(tile.col - emptyTile.col)
      return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
    })
  }

  // Swap two tiles
  const swapTiles = (tileArray, tile1, tile2) => {
    const temp = { row: tile1.row, col: tile1.col, position: tile1.position }
    tile1.row = tile2.row
    tile1.col = tile2.col
    tile1.position = tile2.position
    tile2.row = temp.row
    tile2.col = temp.col
    tile2.position = temp.position
  }

  // Check if puzzle is solved
  const isPuzzleSolved = (tileArray) => {
    return tileArray.every(tile => tile.id === tile.position)
  }

  // Handle tile click
  const handleTileClick = (clickedTile) => {
    if (clickedTile.isEmpty || gameState !== 'playing') return

    const emptyTile = tiles.find(t => t.isEmpty)
    const movableTiles = getMovableTiles(tiles, emptyTile)

    if (movableTiles.includes(clickedTile)) {
      const newTiles = [...tiles]
      const clickedIndex = newTiles.findIndex(t => t.id === clickedTile.id)
      const emptyIndex = newTiles.findIndex(t => t.isEmpty)
      
      swapTiles(newTiles, newTiles[clickedIndex], newTiles[emptyIndex])
      setTiles(newTiles)
      setMoves(moves + 1)

      if (isPuzzleSolved(newTiles)) {
        setTimeout(() => setGameState('solved'), 300)
      }
    }
  }

  const startGame = () => {
    const initialTiles = initializePuzzle()
    const shuffledTiles = shuffleTiles(initialTiles)
    setTiles(shuffledTiles)
    setMoves(0)
    setGameState('playing')
  }

  // Start screen
  if (gameState === 'start') {
    return (
      <div className="kiss-container">
        <h1 className="kiss-title">Kiss Day Puzzle 💋</h1>
        <p className="kiss-instructions">
          Slide the tiles to reveal the hearts! 💕<br/>
          Click tiles next to the empty space to move them.
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
        <h1 className="kiss-title">You Unlocked All The Kisses! 💋💕</h1>
        <div className="kiss-solved-image">
          <img src={IMAGE_PATH} alt="Hearts" />
        </div>
        <p className="kiss-success">Completed in {moves} moves! ✨</p>
        <button className="kiss-start-button" onClick={startGame}>
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
      <p className="kiss-moves">Moves: {moves}</p>

      <div className="kiss-puzzle-board">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className={`kiss-tile ${tile.isEmpty ? 'empty' : ''}`}
            style={{
              width: `${tileSize}%`,
              height: `${tileSize}%`,
              left: `${tile.col * tileSize}%`,
              top: `${tile.row * tileSize}%`,
              backgroundImage: tile.isEmpty ? 'none' : `url(${IMAGE_PATH})`,
              backgroundSize: `${GRID_SIZE * 100}%`,
              backgroundPosition: `${(tile.id % GRID_SIZE) * (100 / (GRID_SIZE - 1))}% ${Math.floor(tile.id / GRID_SIZE) * (100 / (GRID_SIZE - 1))}%`
            }}
            onClick={() => handleTileClick(tile)}
          />
        ))}
      </div>
    </div>
  )
}

export default KissDay