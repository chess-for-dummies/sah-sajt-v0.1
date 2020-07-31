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
import validMove, { isCastle, isPromotion } from "../js/moveValidation";
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

    clickedSquare(col, row) {
      //if previous square doesn't exist, this is the beggining sqaure of a move
      if (
        this.lastClicked === null ||
        this.board[this.lastClicked.row][this.lastClicked.col] === null
      ) {
        this.lastClicked = {
          row,
          col,
          piece: this.board[row][col]
        };
      } else {
        //this is the ending move for the square if it's valid
        if (validMove(this.board, this.prevMove, this.lastClicked, row, col)) {
          //set the previous move to the one just played
          this.prevMove = {
            row,
            col,
            prevRow: this.lastClicked.row,
            prevCol: this.lastClicked.col,
            isWhite: this.lastClicked.piece.isWhite,
            type: this.lastClicked.piece.type
          };
          console.log(isCastle(this.lastClicked, row, col));
          //check for special moves (castle, promotion)
          if (isPromotion(this.lastClicked, row)) {
            //auto-queen on promotion
            this.board[row][col] = this.board[this.lastClicked.row][
              this.lastClicked.col
            ];
            this.board[row][col].type = "Q";
            this.board[this.lastClicked.row][this.lastClicked.col] = null;
          } else if (isCastle(this.lastClicked, row, col)) {
            //king already moves to correct square
            this.board[row][col] = this.board[this.lastClicked.row][
              this.lastClicked.col
            ];
            this.board[this.lastClicked.row][this.lastClicked.col] = null;
            //moving the rook
            let rookRow, rookColPrev, rookColNew;
            if (this.lastClicked.piece.isWhite) {
              rookRow = 7;
            } else {
              rookRow = 0;
            }
            if (isCastle(this.lastClicked, row, col) === 1) {
              //kingside castling
              rookColPrev = 7;
              rookColNew = 5;
            } else {
              //queenside castling
              rookColPrev = 0;
              rookColNew = 3;
            }
            //move rook to correct square
            this.board[rookRow][rookColNew] = this.board[rookRow][rookColPrev];
            this.board[rookRow][rookColPrev] = null;
          } else {
            //update the board for regular moves
            this.board[row][col] = this.board[this.lastClicked.row][
              this.lastClicked.col
            ];
            this.board[this.lastClicked.row][this.lastClicked.col] = null;
          }
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
      lastClicked: null,
      prevMove: null
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