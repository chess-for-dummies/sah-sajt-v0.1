import { isCastle, isPromotion, isEnPeassant } from "./moveValidation";

function getNewBoard(board, prev, row, col, lastMove) {
  const newBoard = board.map(function(arr) {
    return arr.slice();
  });

  if (isPromotion(prev, row)) {
    //auto-queen on promotion
    newBoard[row][col] = board[prev.row][prev.col];
    newBoard[row][col].type = "Q";
    newBoard[prev.row][prev.col] = null;
  } else if (isCastle(prev, row, col)) {
    //king already moves to correct square
    newBoard[row][col] = board[prev.row][prev.col];
    newBoard[prev.row][prev.col] = null;
    //moving the rook
    let rookRow, rookColPrev, rookColNew;
    if (prev.piece.isWhite) {
      rookRow = 7;
    } else {
      rookRow = 0;
    }
    if (isCastle(prev, row, col) === 1) {
      //kingside castling
      rookColPrev = 7;
      rookColNew = 5;
    } else {
      //queenside castling
      rookColPrev = 0;
      rookColNew = 3;
    }
    //move rook to correct square
    newBoard[rookRow][rookColNew] = newBoard[rookRow][rookColPrev];
    newBoard[rookRow][rookColPrev] = null;
  } else if (
    isEnPeassant(
      board,
      prev.row,
      prev.col,
      row,
      col,
      prev.piece.isWhite,
      lastMove
    )
  ) {
    const enpSquare = { row: prev.piece.isWhite ? row + 1 : row - 1, col: col };
    newBoard[row][col] = newBoard[prev.row][prev.col];
    newBoard[prev.row][prev.col] = null;
    newBoard[enpSquare.row][enpSquare.col] = null;
  } else {
    //update the board for regular moves
    newBoard[row][col] = board[prev.row][prev.col];
    newBoard[prev.row][prev.col] = null;
  }
  return newBoard;
}

function makeMove(chessBoard, row, col) {
  //set the previous move to the one just played
  chessBoard.prevMove = {
    row,
    col,
    prevRow: chessBoard.lastClicked.row,
    prevCol: chessBoard.lastClicked.col,
    isWhite: chessBoard.lastClicked.piece.isWhite,
    type: chessBoard.lastClicked.piece.type,
  };
  chessBoard.board = getNewBoard(
    chessBoard.board,
    chessBoard.lastClicked,
    row,
    col,
    chessBoard.prevMove
  );
  const prevMove = chessBoard.prevMove;
  if (prevMove.type === "K") {
    if (prevMove.isWhite) {
      chessBoard.moved.white.king = true;
    } else {
      chessBoard.moved.black.king = true;
    }
  }
  if (prevMove.type === "R") {
    if (prevMove.isWhite) {
      if (prevMove.prevRow === 7 && prevMove.prevCol === 0) {
        chessBoard.moved.white.aRook = true;
      }
      if (prevMove.prevRow === 7 && prevMove.prevCol === 7) {
        chessBoard.moved.white.hRook = true;
      }
    } else {
      if (prevMove.prevRow === 0 && prevMove.prevCol === 0) {
        chessBoard.moved.black.aRook = true;
      }
      if (prevMove.prevRow === 0 && prevMove.prevCol === 7) {
        chessBoard.moved.black.hRook = true;
      }
    }
  }
}

export { makeMove as default, getNewBoard };
