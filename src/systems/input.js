export class InputSystem {
  constructor({ canvas, game }) {
    this.canvas = canvas;
    this.game = game;
  }

  handlePointerDown = (event) => {
    this.game.onPointerDown(event);
  };

  handleKeyDown = (event) => {
    if (event.key === "d" || event.key === "D") {
      this.game.toggleDebug();
      return;
    }

    if (event.key === "=" || event.key === "+") {
      this.game.adjustFishCount(1);
      return;
    }

    if (event.key === "-" || event.key === "_") {
      this.game.adjustFishCount(-1);
      return;
    }

    if (event.key === "r" || event.key === "R") {
      this.game.resetRound();
    }
  };
}
