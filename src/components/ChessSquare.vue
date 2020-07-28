<template>
  <div
    class="chess-square"
    v-bind:class="{'chess-square-light':isLight(),'chess-square-dark':!isLight()}"
    v-on:click="clickedSquare"
  >
    <img :src="piecePicture" class="chess-piece-image" />
  </div>
</template>

<script>
export default {
  name: "ChessSquare",
  props: ["row", "col", "piece"],
  methods: {
    isLight() {
      const par = this.row + this.col;
      return par % 2 === 1;
    },
    clickedSquare() {
      // console.log("clicked", this.col, this.row);
      this.$emit("clickedSquare", this.col, this.row);
    }
  },
  created() {
    //console.log(this.row, this.col, this.piece);
  },
  updated() {
    //console.log("upda:" + this.row, this.col, this.piece);
  },
  computed: {
    piecePicture() {
      if (this.piece === null) {
        return "";
      }
      return require(`../assets/chessSet/Chess_${this.piece.type.toLowerCase()}${
        this.piece.isWhite ? "l" : "d"
      }t60.png`);
    }
  }
};
</script>

<style scoped>
.chess-square {
  display: block;
  height: 50px;
  width: 50px;
  margin: 0 auto;
  position: relative;
}
.chess-square-dark {
  background: rgb(83, 52, 11);
}
.chess-square-light {
  background: rgb(238, 184, 113);
}
.chess-piece-image {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
</style>