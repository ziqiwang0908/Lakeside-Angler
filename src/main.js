import { Game } from "./game.js";

const canvas = document.getElementById("game-canvas");
const statusEl = document.getElementById("status-text");
const hintEl = document.getElementById("hint-text");
const debugEl = document.getElementById("debug-text");

const game = new Game({
  canvas,
  statusEl,
  hintEl,
  debugEl,
});

game.start();
