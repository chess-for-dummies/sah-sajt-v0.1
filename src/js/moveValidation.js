const validKnightMove = (prevRow, prevCol, row, col /*isWhite*/) => {
  if (Math.abs(prevRow - row) + Math.abs(prevCol - col) === 3) {
    return true;
  }
  return false;
};
const validKingMove = (prevRow, prevCol, row, col, isWhite) => {
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
const validQueenMove = (prevRow, prevCol, row, col /*isWhite*/) => {
  if (
    validBishopMove(prevRow, prevCol, row, col /*isWhite*/) ||
    validRookMove(prevRow, prevCol, row, col /*isWhite*/)
  ) {
    return true;
  }
  return false;
};
const validRookMove = (prevRow, prevCol, row, col /*isWhite*/) => {
  if (Math.abs(prevRow - row) === 0 || Math.abs(prevCol - col) === 0) {
    return true;
  }
  return false;
};
const validBishopMove = (prevRow, prevCol, row, col /*isWhite*/) => {
  if (Math.abs(prevRow - row) === Math.abs(prevCol - col)) {
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
  if (piece === null) return false;
  if (prev.row === row && prev.col === col) return false;
  if (
    board[row][col] !== null &&
    board[prev.row][prev.col].isWhite === board[row][col].isWhite
  )
    return false;
  switch (piece.type) {
    case "N":
      return validKnightMove(prevRow, prevCol, row, col, piece.isWhite);
    case "K":
      return validKingMove(prevRow, prevCol, row, col, piece.isWhite);
    case "Q":
      return validQueenMove(prevRow, prevCol, row, col, piece.isWhite);
    case "R":
      return validRookMove(prevRow, prevCol, row, col, piece.isWhite);
    case "B":
      return validBishopMove(prevRow, prevCol, row, col, piece.isWhite);
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
