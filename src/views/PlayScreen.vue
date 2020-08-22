<template>
  <div class="play">
    <h1>Single player game</h1>
    <ChessBoard></ChessBoard>
  </div>
</template>

<script>
import ChessBoard from "../components/ChessBoard";
export default {
  name: "PlayScreen",
  components: {
    ChessBoard,
  },
};
</script>
