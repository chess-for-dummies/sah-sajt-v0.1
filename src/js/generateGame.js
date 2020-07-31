function generateBoard(chessBoard) {
  chessBoard.rows.forEach((row) => {
    const rowIdx = chessBoard.getIdxRow(row);
    let rowArr = [];
    chessBoard.cols.forEach((col) => {
      const colIdx = chessBoard.getIdxCol(col);
      const newPiece = generatePiece(rowIdx, colIdx);
      rowArr.push(newPiece);
    });
    chessBoard.board.push(rowArr);
  });
}
function generatePiece(row, col) {
  if (row !== 0 && row !== 1 && row !== 6 && row !== 7) {
    return null;
  }
  let piece = {
    isWhite: true,
    type: "P",
  };
  if (row === 6 || row === 7) {
    piece.isWhite = false;
  }
  if (row === 0 || row === 7) {
    switch (col) {
      case 0:
        piece.type = "R";
        break;
      case 1:
        piece.type = "N";
        break;
      case 2:
        piece.type = "B";
        break;
      case 3:
        piece.type = "Q";
        break;
      case 4:
        piece.type = "K";
        break;
      case 5:
        piece.type = "B";
        break;
      case 6:
        piece.type = "N";
        break;
      case 7:
        piece.type = "R";
        break;
    }
  }
  //console.log(row, col, piece);
  return piece;
}
export { generateBoard as default };
