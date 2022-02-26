import {
  generateRandomBoard,
  NUM_BOMBS,
  BOARD_COLUMNS,
  BOARD_ROWS,
  generateBlankBoard,
  LEVEL,
} from "./board.js"

import { addTime } from "./store.js"

const gameBoardElem = document.getElementById("game-board")
const resetBtn = document.getElementById("reset-btn")
const header = document.getElementById("game-over")
const timerElem = document.getElementById("timer")
let GAMEOVER = false
let PROCESSED_ENDGAME = false
let USER_WIN = false
let START_TIME = 0
let curBoard, bombCoords

function gameLoop() {
  PROCESSED_ENDGAME = false
  USER_WIN = false
  showUserData()
  fillBoard()
  showStartTiles()
  startGame()
  START_TIME = Date.now()

  setInterval(() => {
    checkWin()
    if (GAMEOVER) {
      if (PROCESSED_ENDGAME) return
      endGame()
      PROCESSED_ENDGAME = true
    } else timerElem.innerHTML = formatTime(Date.now() - START_TIME)
  }, 100)
}

window.addEventListener("load", (event) => {
  gameLoop()
})

resetBtn.addEventListener("click", () => {
  gameLoop()
  GAMEOVER = false
})

function fillBoard() {
  document.documentElement.style.setProperty("--num-columns", BOARD_COLUMNS)
  document.documentElement.style.setProperty("--num-rows", BOARD_ROWS)
  ;[curBoard, bombCoords] = generateRandomBoard()

  gameBoardElem.innerHTML = ""
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLUMNS; col++) {
      let tileElem = document.createElement("button")
      tileElem.classList.add("board-tile", "unselected")

      if (curBoard[row][col] === 1) {
        let icon = document.createElement("i")
        tileElem.appendChild(icon)
        tileElem.classList.add("flag")
        tileElem.setAttribute("flag", 1)
      } else {
        tileElem.setAttribute("numFlagsAround", numFlagsAround(row, col))
      }

      gameBoardElem.appendChild(tileElem)
    }
  }
}

function showStartTiles() {
  let startTiles = getRandomStart()
  startTiles.forEach((tile) => {
    showTile(tile)
  })
}

function getTileElement(row, col) {
  const children = gameBoardElem.children
  let index = row * BOARD_COLUMNS + col
  return children[index]
}

function startGame() {
  gameBoardElem.addEventListener("click", onClick)
  gameBoardElem.addEventListener("contextmenu", onRightClick)
  header.innerHTML = "MINESWEEPER"
  resetBtn.innerHTML = "RESET"
}

function onClick(e) {
  let tileElemSelected = e.target

  if (tileElemSelected.nodeName === "I") {
    tileElemSelected = tileElemSelected.parentElement
  }
  if (
    tileElemSelected.nodeName === "DIV" ||
    tileElemSelected.classList.contains("marked")
  ) {
    return
  }

  let num = tileElemSelected.getAttribute("numFlagsAround")
  if (num === "0") {
    visited = generateBlankBoard()
    tilesReached = [tileElemSelected]
    let index = 0
    while (gameBoardElem.children[index] !== tileElemSelected) {
      index++
    }
    let col = index % BOARD_COLUMNS
    let row = (index - col) / BOARD_COLUMNS
    dfs(row, col, true)
    tilesReached.forEach((tile) => {
      showTile(tile)
    })
  }

  tileElemSelected.classList.remove("unselected")
  showTile(tileElemSelected)
}

function onRightClick(e) {
  e.preventDefault()
  let tileElemSelected = e.target
  if (tileElemSelected.nodeName === "DIV") {
    return
  }
  if (tileElemSelected.nodeName === "I") {
    tileElemSelected = tileElemSelected.parentElement
  }
  if (tileElemSelected.classList.contains("number")) {
    return
  }

  tileElemSelected.classList.remove("unselected")
  if (tileElemSelected.classList.contains("marked")) {
    tileElemSelected.classList.remove("marked", "fa-solid", "fa-flag")
    tileElemSelected.classList.add("unselected")
    if (tileElemSelected.classList.contains("number")) {
      tileElemSelected.classList.remove("number")
    }
  } else {
    tileElemSelected.classList.add("marked", "fa-solid", "fa-flag")
  }
}

function endGame() {
  gameBoardElem.removeEventListener("click", onClick)
  resetBtn.innerHTML = "PLAY AGAIN"
  showAnswer()

  if (!USER_WIN) header.innerHTML = "GAME OVER!"
  else {
    header.innerHTML = "PUZZLE COMPLETED!"
    let curTime = Date.now() - START_TIME
    setTimeout(
      () => {
        if (
          confirm(
            `Would you like to store your time of ${formatTime(curTime)}?`
          )
        ) {
          addTime(LEVEL, curTime)
          showUserData()
        } else {
          return
        }
      },
      500,
      { once: true }
    )
  }
}

function numFlagsAround(row, col) {
  let directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]
  let numFlags = 0

  directions.forEach((i) => {
    let dx = i[0]
    let dy = i[1]
    if (
      row + dx < 0 ||
      row + dx >= BOARD_ROWS ||
      col + dy < 0 ||
      col + dy >= BOARD_COLUMNS
    ) {
      numFlags = numFlags
    } else if (curBoard[row + dx][col + dy] === 1) {
      numFlags++
    }
  })

  return numFlags
}

function showAnswer() {
  let childList = gameBoardElem.children
  for (let i = 0; i < BOARD_COLUMNS * BOARD_ROWS; i++) {
    let tileElemSelected = childList[i]
    if (tileElemSelected.classList.contains("unselected")) {
      tileElemSelected.classList.remove("unselected")
    }
    showTile(tileElemSelected)
  }
}

function showTile(tileElemSelected) {
  if (tileElemSelected.classList.contains("marked")) {
    tileElemSelected.classList.remove("marked", "fa-solid", "fa-flag")
  }

  if (tileElemSelected.hasAttribute("flag")) {
    tileElemSelected.firstChild.classList.add("fa-solid", "fa-bomb")
    GAMEOVER = true
  } else {
    let num = tileElemSelected.getAttribute("numFlagsAround")
    if (num === "0") num = ""
    tileElemSelected.innerHTML = num
    tileElemSelected.classList.add("number")
    if (tileElemSelected.classList.contains("unselected")) {
      tileElemSelected.classList.remove("unselected")
    }
  }
}

function formatTime(time) {
  time = Math.floor(time / 1000)
  let secs = time % 60
  if (secs < 10) {
    secs = "0" + secs.toString()
  }
  let mins = (time - secs) / 60
  mins = mins.toString()
  return mins + ":" + secs
}

function getRandomStart() {
  let blankSquares = []
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLUMNS; col++) {
      if (curBoard[row][col] === 0 && numFlagsAround(row, col) === 0) {
        blankSquares.push([row, col])
      }
    }
  }
  let startTile = blankSquares[Math.floor(blankSquares.length / 2)]
  tilesReached = [getTileElement(startTile[0], startTile[1])]
  visited = generateBlankBoard()
  dfs(startTile[0], startTile[1], true)

  return tilesReached
}

let visited = generateBlankBoard()
let tilesReached = []
const dir = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

function dfs(row, col, first) {
  if (first) {
    first = false
    visited = generateBlankBoard()
  }
  if (visited[row][col] === 1) return
  if (curBoard[row][col] === 1) return
  visited[row][col] = 1
  tilesReached.push(getTileElement(row, col))
  if (numFlagsAround(row, col) > 0) return

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

    dfs(newRow, newCol, false)
  })
}

function checkWin() {
  if (GAMEOVER) return
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLUMNS; col++) {
      if (bombCoords.includes([row, col])) continue
      if (getTileElement(row, col).classList.contains("flag")) continue
      if (getTileElement(row, col).classList.contains("unselected"))
        return false
    }
  }
  GAMEOVER = true
  USER_WIN = true
}

function showUserData() {
  const best = document.getElementById("best")
  const average = document.getElementById("average")
  const plays = document.getElementById("plays")
  const first = document.getElementById("first")
  const second = document.getElementById("second")
  const third = document.getElementById("third")
  const fourth = document.getElementById("fourth")
  const fifth = document.getElementById("fifth")

  let curData = localStorage.getItem(`size${LEVEL}Data`)
  if (curData === null) return

  curData = JSON.parse(curData)
  best.innerHTML = `Best Time: ${formatTime(curData.bestTime)}`
  average.innerHTML = `Average Time: ${formatTime(curData.average)}`
  plays.innerHTML = `Number of Solves: ${curData.numPlays}`
  first.innerHTML = formatTime(curData.last5[0])
  second.innerHTML = formatTime(curData.last5[1])
  third.innerHTML = formatTime(curData.last5[2])
  fourth.innerHTML = formatTime(curData.last5[3])
  fifth.innerHTML = formatTime(curData.last5[4])
}
