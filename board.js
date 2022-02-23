export const BOARD_COLUMNS = 16
export const BOARD_ROWS = 9
export const NUM_BOMBS = Math.floor((BOARD_COLUMNS * BOARD_ROWS) / 5)

const dir = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
]

let visited = generateBlankBoard()

function dfs(row, col) {
  if (visited[row][col] === 1) return
  visited[row][col] = 1

  dir.forEach(([x, y]) => {
    let [newRow, newCol] = [row + x, col + y]
    if (
      newRow < 0 ||
      newRow >= BOARD_ROWS ||
      newCol < 0 ||
      newCol >= BOARD_COLUMNS
    ) {
      return
    }

    dfs(newRow, newCol)
  })
}

export function generateBlankBoard() {
  const blankBoard = []

  for (let i = 0; i < BOARD_ROWS; i++) {
    let curRow = []
    for (let j = 0; j < BOARD_ROWS; j++) {
      curRow.push(0)
    }
    blankBoard.push(curRow)
  }
  return blankBoard
}

export function generateRandomBoard() {
  let board = generateBlankBoard()
  let bombCoords = []

  while (bombCoords.length < NUM_BOMBS) {
    let newBomb = [randomNumBelow(BOARD_ROWS), randomNumBelow(BOARD_COLUMNS)]
    if (!bombCoords.includes(newBomb)) {
      bombCoords.push(newBomb)
    }
  }

  for (let i = 0; i < NUM_BOMBS; i++) {
    board[bombCoords[i][0]][bombCoords[i][1]] = 1
  }
  return [board, bombCoords]
}

function randomNumBelow(x) {
  return Math.floor(Math.random() * x)
}
