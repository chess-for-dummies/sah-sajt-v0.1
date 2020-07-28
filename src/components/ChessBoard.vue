<template>
  <div class="chess-board">
    <div v-for="(row,rowIdx) in board" :key="rowIdx" class="chess-board-row">
      <div v-for="(square,colIdx) in row" :key="colIdx">
        <ChessSquare
          :row="rowIdx"
          :col="colIdx"
          :piece="getPiece(rowIdx,colIdx)"
          v-on:clickedSquare="clickedSquare"
        ></ChessSquare>
      </div>
    </div>
  </div>
</template>

<script>
import ChessSquare from "./ChessSquare";
export default {
  name: "ChessBoard",
  components: { ChessSquare },
  created() {
    this.generateBoard();
    //console.log(this.board);
  },
  methods: {
    getIdxRow(row) {
      return Number(row) - 1;
    },
    getIdxCol(col) {
      return col.charCodeAt(0) - "a".charCodeAt(0);
    },
    getPiece(row, col) {
      //console.log(row, col);
      //console.log(this.board[row][col]);
      return this.board[row][col];
    },
    validKnightMove(prevRow, prevCol, row, col /*isWhite*/) {
      if (Math.abs(prevRow - row) + Math.abs(prevCol - col) === 3) {
        return true;
      }
      return false;
    },
    validKingMove(prevRow, prevCol, row, col /*isWhite*/) {
      if (Math.abs(prevRow - row) <= 1 && Math.abs(prevCol - col) <= 1) {
        return true;
      }
      return false;
    },
    validQueenMove(prevRow, prevCol, row, col /*isWhite*/) {
      if (
        this.validBishopMove(prevRow, prevCol, row, col /*isWhite*/) ||
        this.validRookMove(prevRow, prevCol, row, col /*isWhite*/)
      ) {
        return true;
      }
      return false;
    },
    validRookMove(prevRow, prevCol, row, col /*isWhite*/) {
      if (Math.abs(prevRow - row) === 0 || Math.abs(prevCol - col) === 0) {
        return true;
      }
      return false;
    },
    validBishopMove(prevRow, prevCol, row, col /*isWhite*/) {
      if (Math.abs(prevRow - row) === Math.abs(prevCol - col)) {
        return true;
      }
      return false;
    },
    validPawnMove(prevRow, prevCol, row, col, isWhite) {
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
          this.board[row][col] !== null &&
          this.board[row][col].isWhite !== isWhite
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
          this.board[row][col] !== null &&
          this.board[row][col].isWhite !== isWhite
        ) {
          return true;
        }
        return false;
      }
    },
    validMove(prev, row, col) {
      const prevRow = prev.row;
      const prevCol = prev.col;
      const piece = prev.piece;
      if (piece === null) return false;
      if (prev.row === row && prev.col === col) return false;
      if (
        this.board[row][col] !== null &&
        this.board[prev.row][prev.col].isWhite === this.board[row][col].isWhite
      )
        return false;
      switch (piece.type) {
        case "N":
          return this.validKnightMove(
            prevRow,
            prevCol,
            row,
            col,
            piece.isWhite
          );
        case "K":
          return this.validKingMove(prevRow, prevCol, row, col, piece.isWhite);
        case "Q":
          return this.validQueenMove(prevRow, prevCol, row, col, piece.isWhite);
        case "R":
          return this.validRookMove(prevRow, prevCol, row, col, piece.isWhite);
        case "B":
          return this.validBishopMove(
            prevRow,
            prevCol,
            row,
            col,
            piece.isWhite
          );
        case "P":
          return this.validPawnMove(prevRow, prevCol, row, col, piece.isWhite);
      }
    },
    clickedSquare(col, row) {
      if (
        this.lastClicked === null ||
        this.board[this.lastClicked.row][this.lastClicked.col] === null
      ) {
        //beginning square for move
        this.lastClicked = {
          row,
          col,
          piece: this.board[row][col]
        };
      } else {
        //ending square for move if valid
        if (this.validMove(this.lastClicked, row, col)) {
          this.board[row][col] = this.board[this.lastClicked.row][
            this.lastClicked.col
          ];
          this.board[this.lastClicked.row][this.lastClicked.col] = null;
        }
        this.lastClicked = null;
      }
      this.$forceUpdate();
    },
    generateBoard() {
      this.rows.forEach(row => {
        const rowIdx = this.getIdxRow(row);
        let rowArr = [];
        this.cols.forEach(col => {
          const colIdx = this.getIdxCol(col);
          const newPiece = this.generatePiece(rowIdx, colIdx);
          rowArr.push(newPiece);
        });
        this.board.push(rowArr);
      });
    },
    generatePiece(row, col) {
      if (row !== 0 && row !== 1 && row !== 6 && row !== 7) {
        return null;
      }
      let piece = {
        isWhite: true,
        type: "P"
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
  },
  data: function() {
    return {
      rows: ["8", "7", "6", "5", "4", "3", "2", "1"],
      cols: ["a", "b", "c", "d", "e", "f", "g", "h"],
      board: [],
      lastClicked: null
    };
  }
};
</script>

<style scoped>
.chess-board {
  margin: 0 auto;
}
.chess-board-row {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>