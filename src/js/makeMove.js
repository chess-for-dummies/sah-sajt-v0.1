import { isCastle, isPromotion } from "./moveValidation";

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
  //console.log(isCastle(chessBoard.lastClicked, row, col));
  //check for special moves (castle, promotion)
  if (isPromotion(chessBoard.lastClicked, row)) {
    //auto-queen on promotion
    chessBoard.board[row][col] =
      chessBoard.board[chessBoard.lastClicked.row][chessBoard.lastClicked.col];
    chessBoard.board[row][col].type = "Q";
    chessBoard.board[chessBoard.lastClicked.row][
      chessBoard.lastClicked.col
    ] = null;
  } else if (isCastle(chessBoard.lastClicked, row, col)) {
    //king already moves to correct square
    chessBoard.board[row][col] =
      chessBoard.board[chessBoard.lastClicked.row][chessBoard.lastClicked.col];
    chessBoard.board[chessBoard.lastClicked.row][
      chessBoard.lastClicked.col
    ] = null;
    //moving the rook
    let rookRow, rookColPrev, rookColNew;
    if (chessBoard.lastClicked.piece.isWhite) {
      rookRow = 7;
    } else {
      rookRow = 0;
    }
    if (isCastle(chessBoard.lastClicked, row, col) === 1) {
      //kingside castling
      rookColPrev = 7;
      rookColNew = 5;
    } else {
      //queenside castling
      rookColPrev = 0;
      rookColNew = 3;
    }
    //move rook to correct square
    chessBoard.board[rookRow][rookColNew] =
      chessBoard.board[rookRow][rookColPrev];
    chessBoard.board[rookRow][rookColPrev] = null;
  } else {
    //update the board for regular moves
    chessBoard.board[row][col] =
      chessBoard.board[chessBoard.lastClicked.row][chessBoard.lastClicked.col];
    chessBoard.board[chessBoard.lastClicked.row][
      chessBoard.lastClicked.col
    ] = null;
  }
}

export default makeMove;
