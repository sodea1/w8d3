// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  const grid = Array.from(Array(8), () => new Array(8));
  grid[3][4] = new Piece('black');
  grid[4][3] = new Piece('black');
  grid[3][3] = new Piece('white');
  grid[4][4] = new Piece('white');
  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let [x, y] = [pos[0], pos[1]];

  if (x < 0 || y < 0) {
    return false;
  } else if(x > 7 || y > 7) {
    return false;
  } else {
    return true;
  }
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  let [x, y] = [pos[0], pos[1]];

  if (this.isValidPos(pos)) {
    return this.grid[x][y];
  } else {
    throw new Error('Not valid pos!');
  }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if (!this.getPiece(pos)) {
    return 0;
  }
  return this.getPiece(pos).color === color;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  if (!this.getPiece(pos)) {
    return false;
  } else {
    return true;
  }
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip) {
  if (!piecesToFlip) {
    piecesToFlip = [];
  }
  else {
    piecesToFlip.push(pos);
  }
  let [x, y] = [pos[0], pos[1]];
  let [dx, dy] = [dir[0], dir[1]];
  x = x + dx;
  y = y + dy;
  pos = [x, y];
  if (this.isValidPos(pos) === false) {
    return [];
  } 
  else if (this.isOccupied(pos) === false) {
    return [];
  }
  else if (this.isMine(pos, color) === true) {
    return (piecesToFlip.length === 0 ? [] : piecesToFlip);
  }
  else {
    return this._positionsToFlip(pos, color, dir, piecesToFlip);
  }
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) {
    return false;
  }

  for(let i = 0; i < Board.DIRS.length; i++) {
    if (this._positionsToFlip(pos, color, Board.DIRS[i]).length >= 1) {
      return true;
    }
  }
  return false;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (this.validMove(pos, color)) {
    let moves = [];
    for(let i = 0; i < Board.DIRS.length; i++) {
      moves.push(this._positionsToFlip(pos, color, Board.DIRS[i]));
    }
    moves = moves.flat(1);
    for(let i = 0; i < moves.length; i++) {
      let [x, y] = [moves[i][0], moves[i][1]];
      this.grid[x][y].flip();
    }
    this.grid[pos[0]][pos[1]] = new Piece(color);
  } 
  else {
    throw new Error("Invalid move!");
  }
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  const moves = [];
  for(let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid.length; j++) {
      let pos = [i, j];
      if (this.validMove(pos, color)) {
        moves.push(pos);
      }
    }
  }
  return moves;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length > 0 ? true : false;
  
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return !(this.hasMove('white') && this.hasMove('black'))
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE