const button1 = document.getElementById("1")
const button2 = document.getElementById("2")
const button3 = document.getElementById("3")
const button4 = document.getElementById("4")

function handleClick(id) {
  document.location.href = "game.html"
}

button1.addEventListener("click", () => {
  handleClick("1")
})
button2.addEventListener("click", () => {
  handleClick("2")
})
button3.addEventListener("click", () => {
  handleClick("3")
})
button4.addEventListener("click", () => {
  handleClick("4")
})
