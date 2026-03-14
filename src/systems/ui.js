export class UiSystem {
  constructor({ stateMachine, statusEl, hintEl, debugEl, game }) {
    this.stateMachine = stateMachine;
    this.statusEl = statusEl;
    this.hintEl = hintEl;
    this.debugEl = debugEl;
    this.game = game;
  }

  render(now = performance.now()) {
    const uiState = this.stateMachine.getUiState();
    this.statusEl.textContent = uiState.status;
    this.hintEl.textContent = `${uiState.hint} | D: debug | +/-: fish count | R: reset`;

    if (!this.game.debugEnabled) {
      this.debugEl.textContent = "";
      return;
    }

    this.debugEl.textContent =
      `State: ${this.stateMachine.current} | ` +
      `Time: ${Math.round(this.stateMachine.timeInState(now))} ms | ` +
      `Fish: ${this.game.fish.length} | ` +
      `FPS: ${this.game.fps.toFixed(1)}`;
  }
}
