import { GAME_CONFIG } from "./config.js";
import { FishingStateMachine } from "./stateMachine.js";
import { Renderer } from "./systems/renderer.js";
import { InputSystem } from "./systems/input.js";
import { UiSystem } from "./systems/ui.js";
import { Bobber } from "./entities/bobber.js";
import { Fish } from "./entities/fish.js";
import { Rod } from "./entities/rod.js";
import { FishAiSystem } from "./systems/fishAI.js";

export class Game {
  constructor({ canvas, statusEl, hintEl, debugEl }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = 0;
    this.height = 0;
    this.lastFrameTime = 0;
    this.time = 0;
    this.caughtCount = 0;
    this.fps = GAME_CONFIG.targetFps;
    this.debugEnabled = GAME_CONFIG.debugEnabledByDefault;

    this.stateMachine = new FishingStateMachine();
    this.bobber = new Bobber();
    this.rod = new Rod();
    this.fish = [];
    this.activeFish = null;

    this.renderer = new Renderer({
      canvas: this.canvas,
      ctx: this.ctx,
      config: GAME_CONFIG,
    });

    this.ui = new UiSystem({
      stateMachine: this.stateMachine,
      statusEl,
      hintEl,
      debugEl,
      game: this,
    });

    this.input = new InputSystem({
      canvas: this.canvas,
      game: this,
    });

    this.fishAI = new FishAiSystem({
      fish: this.fish,
      bobber: this.bobber,
      stateMachine: this.stateMachine,
      config: GAME_CONFIG,
      game: this,
    });
  }

  start() {
    this.resize();
    this.initializeFish();
    this.ui.render();
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("keydown", this.input.handleKeyDown);
    this.canvas.addEventListener("pointerdown", this.input.handlePointerDown);
    requestAnimationFrame(this.frame);
  }

  destroy() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("keydown", this.input.handleKeyDown);
    this.canvas.removeEventListener("pointerdown", this.input.handlePointerDown);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.rod.updateLayout(this.width, this.height);
    this.layoutFish();
  }

  update(dt, now) {
    this.time += dt;
    this.fps = this.fps * 0.9 + (1000 / Math.max(dt, 1)) * 0.1;
    this.bobber.update({
      dt,
      now,
      stateMachine: this.stateMachine,
      rod: this.rod,
      config: GAME_CONFIG,
    });
    this.fishAI.update(dt, now, this.width, this.height);
    this.advanceStateTimers(now);
    this.ui.render(now);
  }

  render() {
    this.renderer.render({
      width: this.width,
      height: this.height,
      time: this.time,
      stateMachine: this.stateMachine,
      rod: this.rod,
      bobber: this.bobber,
      fish: this.fish,
      caughtCount: this.caughtCount,
    });
  }

  onPointerDown(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const waterline = this.height * GAME_CONFIG.waterLevel;

    if (y < waterline) {
      return;
    }

    if (this.stateMachine.is("IDLE")) {
      this.bobber.cast({
        startX: this.rod.tipX,
        startY: this.rod.tipY,
        targetX: x,
        targetY: y,
      });
      this.stateMachine.setState("CASTING", performance.now());
      this.ui.render();
      return;
    }

    if (this.stateMachine.is("BITE")) {
      this.caughtCount += 1;
      if (this.activeFish) {
        this.activeFish.onCaught();
        this.activeFish = null;
      }
      this.stateMachine.setState("CAUGHT", performance.now());
      this.ui.render();
      return;
    }

    if (this.stateMachine.is("CAUGHT") || this.stateMachine.is("ESCAPED")) {
      this.resetRound();
    }
  }

  advanceStateTimers(now) {
    if (this.stateMachine.is("CASTING") && this.bobber.hasReachedTarget()) {
      this.stateMachine.setState("WAITING", now);
      return;
    }

    if (
      this.stateMachine.is("NIBBLE") &&
      this.stateMachine.timeInState(now) >= GAME_CONFIG.nibbleDurationMs
    ) {
      this.stateMachine.setState("BITE", now);
      return;
    }

    if (
      this.stateMachine.is("BITE") &&
      this.stateMachine.timeInState(now) >= GAME_CONFIG.biteDurationMs
    ) {
      if (this.activeFish) {
        this.activeFish.onEscape();
        this.activeFish = null;
      }
      this.stateMachine.setState("ESCAPED", now);
      return;
    }

    if (
      this.stateMachine.is("CAUGHT") &&
      this.stateMachine.timeInState(now) >= GAME_CONFIG.catchDurationMs
    ) {
      this.bobber.reset();
      this.activeFish = null;
      this.fishAI.resetForNextCast();
      this.stateMachine.setState("IDLE", now);
    }
  }

  initializeFish() {
    this.fish.length = 0;
    for (let i = 0; i < GAME_CONFIG.initialFishCount; i += 1) {
      this.fish.push(new Fish(i));
    }
    this.layoutFish();
  }

  layoutFish() {
    if (this.width === 0 || this.height === 0) {
      return;
    }

    for (const fish of this.fish) {
      if (fish.x === 0 && fish.y === 0) {
        fish.randomizePosition(this.width, this.height, GAME_CONFIG.waterLevel);
      }
    }
  }

  setNibbleFish(fish, now) {
    if (!this.stateMachine.is("WAITING")) {
      return;
    }
    this.activeFish = fish;
    this.stateMachine.setState("NIBBLE", now);
  }

  setBiteFish(fish, now) {
    if (!this.stateMachine.is("NIBBLE")) {
      return;
    }
    this.activeFish = fish;
    this.stateMachine.setState("BITE", now);
  }

  adjustFishCount(delta) {
    if (delta === 0) {
      return;
    }

    const nextCount = Math.min(
      GAME_CONFIG.maxFishCount,
      Math.max(GAME_CONFIG.minFishCount, this.fish.length + delta)
    );

    if (nextCount === this.fish.length) {
      return;
    }

    if (nextCount > this.fish.length) {
      for (let i = this.fish.length; i < nextCount; i += 1) {
        const fish = new Fish(i);
        fish.randomizePosition(this.width, this.height, GAME_CONFIG.waterLevel);
        this.fish.push(fish);
      }
      return;
    }

    if (this.activeFish && this.activeFish.id >= nextCount) {
      this.activeFish = null;
      if (this.stateMachine.is("NIBBLE") || this.stateMachine.is("BITE")) {
        this.stateMachine.setState("WAITING", performance.now());
      }
    }

    this.fish.length = nextCount;
  }

  toggleDebug() {
    this.debugEnabled = !this.debugEnabled;
    this.ui.render();
  }

  resetRound() {
    this.bobber.reset();
    this.activeFish = null;
    this.fishAI.resetForNextCast();
    this.stateMachine.setState("IDLE", performance.now());
    this.ui.render();
  }

  frame = (now) => {
    const dt = this.lastFrameTime === 0 ? 16.67 : now - this.lastFrameTime;
    this.lastFrameTime = now;
    this.update(dt, now);
    this.render();
    requestAnimationFrame(this.frame);
  };

  handleResize = () => {
    this.resize();
    this.render();
  };
}
