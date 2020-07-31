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
import validMove from "../js/moveValidation";
import makeMove from "../js/makeMove";
import generateBoard from "../js/generateGame";
export default {
  name: "ChessBoard",
  components: { ChessSquare },
  created() {
    generateBoard(this);
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
        //make the move if it's valid
        if (validMove(this.board, this.prevMove, this.lastClicked, row, col)) {
          makeMove(this, row, col);
        }
        this.lastClicked = null;
      }
      this.$forceUpdate();
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