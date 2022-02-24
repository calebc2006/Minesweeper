export function addTime(size, time) {
  let curData = localStorage.getItem(`size${size}Data`)

  if (curData === null) {
    let sizeData = {
      bestTime: time,
      average: time,
      numPlays: 1,
      last5: [time, null, null, null, null],
    }
    localStorage.setItem(`size${size}Data`, JSON.stringify(sizeData))
    return
  }

  curData = JSON.parse(curData)
  if (curData.bestTime > time) {
    curData.bestTime = time
  }
  curData.average =
    (curData.average * curData.numPlays + time) / (curData.numPlays + 1)
  curData.numPlays++
  curData.last5 = [time, ...curData.last5.slice(0, 4)]
  localStorage.setItem(`size${size}Data`, JSON.stringify(curData))
}
