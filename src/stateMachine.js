import { FISHING_STATES, UI_COPY } from "./config.js";

export class FishingStateMachine {
  constructor(initialState = FISHING_STATES.IDLE) {
    this.current = initialState;
    this.previous = null;
    this.enteredAt = 0;
  }

  setState(nextState, now = performance.now()) {
    if (!UI_COPY[nextState]) {
      throw new Error(`Unknown fishing state: ${nextState}`);
    }

    if (this.current === nextState) {
      return false;
    }

    this.previous = this.current;
    this.current = nextState;
    this.enteredAt = now;
    return true;
  }

  is(state) {
    return this.current === state;
  }

  getUiState() {
    return UI_COPY[this.current];
  }

  timeInState(now = performance.now()) {
    return now - this.enteredAt;
  }
}
