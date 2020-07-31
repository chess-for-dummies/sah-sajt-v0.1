import { isCastle, isPromotion } from "./moveValidation";

function getNewBoard(board, prev, row, col) {
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
    col
  );
}

export { makeMove as default, getNewBoard };
