/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let lock = false;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
	for (let row = 0; row < HEIGHT; row++) {
		let c = [];
		board.push(c);
		for (let col = 0; col < WIDTH; col++) {
			c.push(null);
		}
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	let htmlBoard = document.getElementById('board');

	// Creates a row with the id of column-top
	// Inside of the row creates cells with the id according to the lenght of WIDTH and it adds to the column-top
	let top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	for (let x = 0; x < WIDTH; x++) {
		let headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		let arrow = document.createElement('img');
		arrow.setAttribute('src', `arrow.png`);
		arrow.setAttribute('id', x);
		headCell.appendChild(arrow);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// Creates rows and cell according to lenght of WIDTH and HEIGHT
	// For each cell, an ID is given according to its location
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	let h = HEIGHT - 1;
	for (let y = h; y >= 0; y--) {
		if (!board[y][x]) {
			return y;
		}
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	let cell = document.getElementById(`${y}-${x}`);
	let newDiv = document.createElement('div');
	newDiv.setAttribute('class', `piece p${currPlayer}`);
	cell.append(newDiv);
}

/** endGame: announce game end */

function endGame(msg) {
	alert(msg);
	lock = true;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	if (lock) return;
	const x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	const y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table

	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie

	const tie = (tie) => tie.every((val) => val.every((x) => x !== null));
	if (tie(board)) {
		return endGame(`It is a TIE`);
	}

	// switch players

	currPlayer == 1 ? (currPlayer = 2) : (currPlayer = 1);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

let btn = document.getElementById('reset');
btn.addEventListener('click', function() {
	board = [];
	let table = document.getElementById('board');
	table.innerHTML = '';
	makeBoard();
	makeHtmlBoard();
	lock = false;
});

makeBoard();
makeHtmlBoard();
