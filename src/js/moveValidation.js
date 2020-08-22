import { getNewBoard } from "./makeMove";

const validKnightMove = (board, prevRow, prevCol, row, col /*isWhite*/) => {
  if (
    Math.abs(prevRow - row) + Math.abs(prevCol - col) === 3 &&
    Math.abs(prevRow - row) < 3 &&
    Math.abs(prevCol - col) < 3
  ) {
    return true;
  }
  return false;
};
const validKingMoveBasic = (board, prevRow, prevCol, row, col, isWhite) => {
  return Math.abs(prevRow - row) <= 1 && Math.abs(prevCol - col) <= 1;
};

const validKingMove = (board, prevRow, prevCol, row, col, isWhite, moved) => {
  //check for castle
  if (isWhite && row === 7 && prevRow === 7) {
    //white castles
    if (prevCol === 4) {
      if (moved.white.king) {
        return false;
      }
      if (col === 6) {
        if (moved.white.hRook) {
          return false;
        }
        if (squareIsAttacked(board, row, prevCol, isWhite)) {
          return false;
        }
        if (
          squareIsAttacked(board, row, 5, isWhite) ||
          board[row][5] !== null
        ) {
          return false;
        }
        //kingside castle
        return true;
      }
      if (col === 2) {
        //queenside castle
        if (moved.white.aRook) {
          return false;
        }
        if (squareIsAttacked(board, row, prevCol, isWhite)) {
          return false;
        }
        if (squareIsAttacked(board, row, 3, isWhite)) {
          return false;
        }
        if (
          board[row][1] !== null ||
          board[row][2] !== null ||
          board[row][3] !== null
        ) {
          return false;
        }
        return true;
      }
    }
  }
  if (!isWhite && row === 0 && prevRow === 0) {
    //black castles
    if (moved.black.king) {
      return false;
    }
    if (prevCol === 4) {
      if (col === 6) {
        if (moved.black.hRook) {
          return false;
        }
        if (squareIsAttacked(board, row, prevCol, isWhite)) {
          return false;
        }
        if (
          squareIsAttacked(board, row, 5, isWhite) ||
          board[row][5] !== null
        ) {
          return false;
        }
        //kingside castle
        return true;
      }
      if (col === 2) {
        if (moved.black.aRook) {
          return false;
        }
        if (squareIsAttacked(board, row, prevCol, isWhite)) {
          return false;
        }
        if (squareIsAttacked(board, row, 3, isWhite)) {
          return false;
        }
        if (
          board[row][1] !== null ||
          board[row][2] !== null ||
          board[row][3] !== null
        ) {
          return false;
        }
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
const validPawnMove = (
  board,
  prevRow,
  prevCol,
  row,
  col,
  isWhite,
  lastMove
) => {
  if (isWhite) {
    if (prevRow - row === 1 && col === prevCol && board[row][col] === null) {
      return true;
    }
    if (
      prevRow === 6 &&
      row === 4 &&
      col === prevCol &&
      board[row][col] === null
    ) {
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
    if (
      lastMove.type === "P" &&
      lastMove.row - lastMove.prevRow === 2 &&
      lastMove.row === row &&
      col === lastMove.col &&
      Math.abs(col - prevCol) === 1 &&
      prevRow - row === 1 //en peassant
    ) {
      return true;
    }

    return false;
  } else {
    if (row - prevRow === 1 && col === prevCol && board[row][col] === null) {
      return true;
    }
    if (
      row === 3 &&
      prevRow === 1 &&
      col === prevCol &&
      board[row][col] === null
    ) {
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
    if (
      //en peassant
      lastMove.type == "P" &&
      lastMove.prevRow - lastMove.row === 2 &&
      lastMove.row === row &&
      col === lastMove.col &&
      Math.abs(col - prevCol) === 1 &&
      row - prevRow === 1
    ) {
      return true;
    }

    return false;
  }
};
const validPawnMoveCapture = (board, prevRow, prevCol, row, col, isWhite) => {
  if (isWhite) {
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
  return null;
};
const canGetTo = (board, prevRow, prevCol, row, col) => {
  const piece = board[prevRow][prevCol];
  if (!piece) return false;
  switch (piece.type) {
    case "K":
      return validKingMoveBasic(
        board,
        prevRow,
        prevCol,
        row,
        col,
        piece.isWhite
      );
    case "B":
      return validBishopMove(board, prevRow, prevCol, row, col, piece.isWhite);
    case "R":
      return validRookMove(board, prevRow, prevCol, row, col, piece.isWhite);
    case "N":
      return validKnightMove(board, prevRow, prevCol, row, col, piece.isWhite);
    case "Q":
      return validQueenMove(board, prevRow, prevCol, row, col, piece.isWhite);
    case "P":
      return validPawnMoveCapture(
        board,
        prevRow,
        prevCol,
        row,
        col,
        piece.isWhite
      );
  }
};
const squareIsAttacked = (board, row, col, isWhite) => {
  for (let i = 0; i <= 7; i++) {
    for (let j = 0; j <= 7; j++) {
      const prev = { row: i, col: j, piece: board[i][j] };
      if (
        board[i][j] !== null &&
        board[i][j].isWhite !== isWhite &&
        canGetTo(board, i, j, row, col)
      ) {
        return true;
      }
    }
  }
  return false;
};
const kingIsAttackedAfterMove = (board, prevMove, isWhite) => {
  const kingPos = findKingPosition(board, isWhite);
  if (kingPos === null) {
    return true;
  }
  if (squareIsAttacked(board, kingPos.row, kingPos.col, isWhite)) {
    return true;
  }
  return false;
};

const allValidMoves = (board, prevMove, prev, move, lastMove) => {
  if (board[prev.row][prev.col] === null) {
    return [];
  }
  const res = [];
  for (let row = 0; row <= 7; row++) {
    for (let col = 0; col <= 7; col++) {
      if (
        board[prev.row][prev.col].type === "P" &&
        Math.abs(row - prev.row) + Math.abs(col - prev.col) > 2
      ) {
        continue;
      }
      if (
        //board[row][col] === null &&
        validMove(board, prevMove, prev, row, col, move, lastMove)
      ) {
        res.push({ row, col });
      }
    }
  }
  return res;
};

const validMove = (board, prevMove, prev, row, col, moved, lastMove) => {
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

  switch (piece.type) {
    case "N":
      if (!validKnightMove(board, prevRow, prevCol, row, col, piece.isWhite)) {
        return false;
      }
      break;
    case "K":
      if (
        !validKingMove(board, prevRow, prevCol, row, col, piece.isWhite, moved)
      ) {
        return false;
      }
      break;
    case "Q":
      if (!validQueenMove(board, prevRow, prevCol, row, col, piece.isWhite)) {
        return false;
      }
      break;
    case "R":
      if (!validRookMove(board, prevRow, prevCol, row, col, piece.isWhite)) {
        return false;
      }
      break;

    case "B":
      if (!validBishopMove(board, prevRow, prevCol, row, col, piece.isWhite)) {
        return false;
      }
      break;
    case "P":
      if (
        !validPawnMove(
          board,
          prevRow,
          prevCol,
          row,
          col,
          piece.isWhite,
          lastMove
        )
      ) {
        return false;
      }
      break;
  }

  const boardAfterMove = getNewBoard(board, prev, row, col);
  const newPrevMove = {
    row,
    col,
    prevRow: prev.row,
    prevCol: prev.col,
    isWhite: prev.piece.isWhite,
    type: prev.piece.type,
  };
  if (
    kingIsAttackedAfterMove(boardAfterMove, newPrevMove, prev.piece.isWhite)
  ) {
    return false;
  }
  return true;
};
const isEnPeassant = (board, prevRow, prevCol, row, col, isWhite, lastMove) => {
  if (board[prevRow][prevCol].type !== "P") {
    return false;
  }
  if (board[row][col] !== null) {
    return false;
  }
  if (Math.abs(col - prevCol) !== 1) {
    return false;
  }
  return true;
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

export {
  isCastle,
  isPromotion,
  isEnPeassant,
  allValidMoves,
  validMove as default,
};
