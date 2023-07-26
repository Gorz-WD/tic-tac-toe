const gb = (function () {
  let board = new Array(9).fill('')

  const reset = () => board = board.fill('')

  return{board, reset}
})()

const dc = (function () {
  const gbFrame = document.getElementById('gb-frame')
  let wincells = []

  const render = (gb) => {
    gb.forEach((cell , index) => {
      const div = document.createElement('div')
      div.textContent = cell
      div.classList.add('cell')
      div.id = `${index}`
      gbFrame.appendChild(div)
    });
  }

  const paintCells = () => {
    const cells = document.getElementsByClassName('cell')

    Array.from(cells).forEach(cell => {
      if (wincells.includes(Number(cell.id))) {
        cell.classList.add('win-cell')
      }
    })
  }

  const setWinCells = (wincon) => {
    wincells = wincon
  }

  const reset = () => {
    gbFrame.textContent = ''
  }
  
  return {render, reset, setWinCells, paintCells}
})()

const Player = (name, mark) => {
  let cells = []
  
  const getName = () => name
  const getMark = () => mark
  const getCells = () => cells
  const addCell = (x) => cells.push(x)
  const reset = () => cells = []

  return {getName, getMark, getCells, addCell, reset}
}

function game() {

  dc.render(gb.board);
  const restart = document.getElementById('restart')
  const cells = document.getElementsByClassName('cell');
  const playerOne = Player('P1', 'X');
  const playerTwo = Player('P2', 'O');
  let currentPlayer = playerOne;

  function checkWinner(p) {
    let arr = p.getCells()
    const wincons = [
      [0, 1, 2], [0, 4, 8], [0, 3, 6],
      [3, 4, 5], [2, 4, 6], [2, 5, 8],
      [1, 4, 7], [6, 7, 8]
    ];
  
    for (const wincon of wincons) {
      const foundWincon = wincon.every(index => arr.includes(index));
      if (foundWincon) {
        dc.setWinCells(wincon)
        return true;
      }
    } 
  }

  const gameOver = (p) => {
    dc.paintCells()
    Array.from(cells).forEach(cell => {
      cell.removeEventListener('click', cellClickHandler);
    });
  }

  function resetGame() {
    playerOne.reset()
    playerTwo.reset()
    gb.reset()
    dc.reset()
    dc.render(gb.board);
    currentPlayer = playerOne;
    Array.from(cells).forEach(cell => {
      cell.addEventListener('click', cellClickHandler);
    });
  }

  restart.addEventListener('click', () => resetGame())

  function cellClickHandler() {
    const cell = this;
    cell.textContent = currentPlayer.getMark();
    currentPlayer.addCell(Number(cell.id));
    currentPlayer === playerOne ? cell.classList.add('player-one-mark') : cell.classList.add('player-two-mark')
    if (checkWinner(currentPlayer)) {
      gameOver(currentPlayer);
    } else {
      currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    }
    cell.removeEventListener('click', cellClickHandler);
  }

  Array.from(cells).forEach(cell => {
    cell.addEventListener('click', cellClickHandler);
  });
}

game();