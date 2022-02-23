const SIZES = [
  [9, 9, 15],
  [16, 9, 26],
  [24, 16, 70],
  [32, 22, 120],
]

export let BOARD_COLUMNS = 16
export let BOARD_ROWS = 9
export let NUM_BOMBS = 9

window.onload = function () {
  let url = document.location.href,
    params = url.split("?")[1].split("&"),
    data = {},
    tmp
  for (var i = 0, l = params.length; i < l; i++) {
    tmp = params[i].split("=")
    data[tmp[0]] = tmp[1]
  }

  ;[BOARD_COLUMNS, BOARD_ROWS, NUM_BOMBS] = SIZES[parseInt(data.size) - 1]
}

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
