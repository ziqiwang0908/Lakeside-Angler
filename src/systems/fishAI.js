export class FishAiSystem {
  constructor({ fish, bobber, stateMachine, config, game }) {
    this.fish = fish;
    this.bobber = bobber;
    this.stateMachine = stateMachine;
    this.config = config;
    this.game = game;
  }

  update(dt, now, width, height) {
    const activeFishing =
      this.bobber.isActive &&
      !this.stateMachine.is("IDLE") &&
      !this.stateMachine.is("CASTING") &&
      !this.stateMachine.is("CAUGHT") &&
      !this.stateMachine.is("ESCAPED");

    for (const fish of this.fish) {
      if (!activeFishing) {
        this.updatePatrol(fish, dt, now, width);
        continue;
      }

      if (fish.state === "ESCAPE") {
        this.updateEscape(fish, dt, now, width, height);
        continue;
      }

      if (this.game.activeFish && this.game.activeFish !== fish) {
        this.updatePatrol(fish, dt, now, width);
        continue;
      }

      const dx = this.bobber.targetX - fish.x;
      const dy = this.bobber.targetY - fish.y;
      const distance = Math.hypot(dx, dy);

      if (this.stateMachine.is("WAITING") && distance < this.config.fishDetectRadius) {
        fish.setState("APPROACH");
      }

      if (fish.state === "APPROACH") {
        this.updateApproach(fish, dt, now, dx, dy);

        if (this.stateMachine.is("WAITING") && distance < this.config.fishNibbleRadius) {
          fish.setState("NIBBLE");
          this.game.setNibbleFish(fish, now);
        }
        continue;
      }

      if (fish.state === "NIBBLE") {
        this.updateNibble(fish, now);

        if (
          this.stateMachine.is("NIBBLE") &&
          this.stateMachine.timeInState(now) > this.config.nibbleDurationMs * 0.45
        ) {
          fish.setState("BITE");
          this.game.setBiteFish(fish, now);
        }
        continue;
      }

      if (fish.state === "BITE") {
        this.updateBite(fish, now);
        continue;
      }

      this.updatePatrol(fish, dt, now, width);
    }
  }

  updatePatrol(fish, dt, now, width) {
    fish.x += fish.speed * fish.direction * (dt * 0.06);
    fish.y = fish.baseY + Math.sin(now * 0.002 + fish.sineOffset) * 10;

    if (fish.x > width + 60) {
      fish.x = -60;
    }

    if (fish.x < -60) {
      fish.x = width + 60;
    }

    if (fish.state !== "PATROL") {
      fish.setState("PATROL");
    }
  }

  updateApproach(fish, dt, now, dx, dy) {
    const distance = Math.max(1, Math.hypot(dx, dy));
    fish.direction = dx >= 0 ? 1 : -1;
    fish.x += (dx / distance) * this.config.fishApproachSpeed * (dt * 0.06);
    fish.y += (dy / distance) * this.config.fishApproachSpeed * (dt * 0.04);
    fish.y += Math.sin(now * 0.006 + fish.sineOffset) * 0.45;
  }

  updateNibble(fish, now) {
    fish.direction = this.bobber.targetX >= fish.x ? 1 : -1;
    fish.x += Math.sin(now * 0.012 + fish.sineOffset) * 0.6;
    fish.y += Math.cos(now * 0.011 + fish.sineOffset) * 0.4;
  }

  updateBite(fish, now) {
    fish.direction = this.bobber.targetX >= fish.x ? 1 : -1;
    fish.x = this.bobber.targetX - fish.direction * 18;
    fish.y = this.bobber.targetY + Math.sin(now * 0.02 + fish.sineOffset) * 2;
  }

  updateEscape(fish, dt, now, width, height) {
    fish.x += this.config.fishEscapeSpeed * fish.direction * (dt * 0.08);
    fish.y = fish.baseY + Math.sin(now * 0.002 + fish.sineOffset) * 8;

    if (fish.x < -90 || fish.x > width + 90) {
      fish.randomizePosition(width, height, this.config.waterLevel);
    }
  }

  resetForNextCast() {
    for (const fish of this.fish) {
      fish.setState("PATROL");
    }
  }
}
