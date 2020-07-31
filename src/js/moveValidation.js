const validKnightMove = (board, prevRow, prevCol, row, col /*isWhite*/) => {
  if (Math.abs(prevRow - row) + Math.abs(prevCol - col) === 3) {
    return true;
  }
  return false;
};
const validKingMove = (board, prevRow, prevCol, row, col, isWhite) => {
  //check for castle
  if (isWhite && row === 7 && prevRow === 7) {
    //white castles
    if (prevCol === 4) {
      if (col === 6) {
        //kingside castle
        return true;
      }
      if (col === 2) {
        //queenside castle
        return true;
      }
    }
  }
  if (!isWhite && row === 0 && prevRow === 0) {
    //black castles
    if (prevCol === 4) {
      if (col === 6) {
        //kingside castle
        return true;
      }
      if (col === 2) {
        //queenside castle
        return true;
      }
    }
  }
  if (Math.abs(prevRow - row) <= 1 && Math.abs(prevCol - col) <= 1) {
    return true;
  }
  return false;
};
const validQueenMove = (board, prevRow, prevCol, row, col /*isWhite*/) => {
  if (Math.abs(prevRow - row) === 0 || Math.abs(prevCol - col) === 0) {
    return validRookMove(board, prevRow, prevCol, row, col /*isWhite*/);
  }
  if (Math.abs(prevRow - row) === Math.abs(prevCol - col)) {
    return validBishopMove(board, prevRow, prevCol, row, col /*isWhite*/);
  }
  return false;
};
const validRookMove = (board, prevRow, prevCol, row, col /*isWhite*/) => {
  if (Math.abs(prevRow - row) === 0 || Math.abs(prevCol - col) === 0) {
    const dx = Math.sign(row - prevRow);
    const dy = Math.sign(col - prevCol);
    for (let curri = prevRow, currj = prevCol; (curri += dx), (currj += dy); ) {
      if (curri === row && currj === col) break;
      if (
        !(curri === row && currj === col) &&
        !(curri === prevRow && currj === prevCol)
      ) {
        if (board[curri][currj] !== null) {
          //cant go through pieces
          return false;
        }
      }
    }
    return true;
  }
  return false;
};
const validBishopMove = (board, prevRow, prevCol, row, col /*isWhite*/) => {
  if (Math.abs(prevRow - row) === Math.abs(prevCol - col)) {
    const dx = Math.sign(row - prevRow);
    const dy = Math.sign(col - prevCol);
    for (let curri = prevRow, currj = prevCol; (curri += dx), (currj += dy); ) {
      if (curri === row && currj === col) break;
      if (
        !(curri === row && currj === col) &&
        !(curri === prevRow && currj === prevCol)
      ) {
        if (board[curri][currj] !== null) {
          //cant go through pieces
          return false;
        }
      }
    }
    return true;
  }
  return false;
};
const validPawnMove = (board, prevRow, prevCol, row, col, isWhite) => {
  if (isWhite) {
    if (prevRow - row === 1 && col === prevCol) {
      return true;
    }
    if (prevRow === 6 && row === 4 && col === prevCol) {
      return true;
    }
    if (
      prevRow - row === 1 &&
      Math.abs(col - prevCol) === 1 &&
      board[row][col] !== null &&
      board[row][col].isWhite !== isWhite
    ) {
      return true;
    }
    return false;
  } else {
    if (row - prevRow === 1 && col === prevCol) {
      return true;
    }
    if (row === 3 && prevRow === 1 && col === prevCol) {
      return true;
    }
    if (
      row - prevRow === 1 &&
      Math.abs(col - prevCol) === 1 &&
      board[row][col] !== null &&
      board[row][col].isWhite !== isWhite
    ) {
      return true;
    }
    return false;
  }
};

const findKingPosition = (board, isWhite) => {
  for (let i = 0; i <= 7; i++) {
    for (let j = 0; j <= 7; j++) {
      if (
        board[i][j] !== null &&
        board[i][j].isWhite === isWhite &&
        board[i][j].type === "K"
      ) {
        return { row: i, col: j };
      }
    }
  }
  return undefined;
};
const squareIsAttacked = (row, col, isWhite) => {};
const kingIsAttackedAfterMove = (board, prevMove, prev, row, col) => {
  const prevRow = prev.row;
  const prevCol = prev.col;
  const piece = prev.piece;
  const newBoard = board.map(function(arr) {
    return arr.slice();
  });
  //make move on new board
  newBoard[row][col] = board[prevRow][prevCol];
  newBoard[prevRow][prevCol] = null;
};

const validMove = (board, prevMove, prev, row, col) => {
  const prevRow = prev.row;
  const prevCol = prev.col;
  const piece = prev.piece;
  if (prevMove !== null && piece.isWhite === prevMove.isWhite) {
    return false;
  }
  if (prevMove === null && piece.isWhite === false) {
    return false;
  }
  if (piece === null || piece === undefined) return false;
  if (prev.row === row && prev.col === col) return false;
  if (
    board[row][col] !== null &&
    board[prev.row][prev.col].isWhite === board[row][col].isWhite
  )
    return false;

  kingIsAttackedAfterMove(board, prevMove, prev, row, col);
  /*if (kingIsAttackedAfterMove(board, prevMove, prev, row, col)) {
    return false;
  }*/

  switch (piece.type) {
    case "N":
      return validKnightMove(board, prevRow, prevCol, row, col, piece.isWhite);
    case "K":
      return validKingMove(board, prevRow, prevCol, row, col, piece.isWhite);
    case "Q":
      return validQueenMove(board, prevRow, prevCol, row, col, piece.isWhite);
    case "R":
      return validRookMove(board, prevRow, prevCol, row, col, piece.isWhite);
    case "B":
      return validBishopMove(board, prevRow, prevCol, row, col, piece.isWhite);
    case "P":
      return validPawnMove(board, prevRow, prevCol, row, col, piece.isWhite);
  }
};
const isPromotion = (prev, row) => {
  const piece = prev.piece;
  if (piece.type === "P" && piece.isWhite && row === 0) {
    return true;
  }
  if (piece.type === "P" && !piece.isWhite && row === 7) {
    return true;
  }
  return false;
};
const isCastle = (prev, row, col) => {
  //0 for no castle, 1 for kingside, 2 for queenside
  if (prev === null) {
    return 0;
  }
  const piece = prev.piece;
  const prevRow = prev.row;
  const prevCol = prev.col;
  if (piece.type !== "K") {
    //only kings are allowed to castle
    return 0;
  }
  let requiredRow = 7;
  if (!piece.isWhite) {
    requiredRow = 0;
  }
  if (prevRow !== requiredRow || row !== requiredRow) {
    //both previous row and new row are starting row
    return 0;
  }
  if (prevCol !== 4) {
    //king is on starting square
    return 0;
  }
  //starting square is ok, only need to check final col
  if (col === 2) {
    //queenside castle
    return 2;
  }
  if (col === 6) {
    //kingside castle
    return 1;
  }

  return 0;
};

export { isCastle, isPromotion, validMove as default };
