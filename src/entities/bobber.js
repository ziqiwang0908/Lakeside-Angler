export class Bobber {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.startX = 0;
    this.startY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.isActive = false;
    this.castProgress = 0;
    this.phase = 0;
  }

  cast({ startX, startY, targetX, targetY }) {
    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.x = startX;
    this.y = startY;
    this.isActive = true;
    this.castProgress = 0;
    this.phase = 0;
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.startX = 0;
    this.startY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.isActive = false;
    this.castProgress = 0;
    this.phase = 0;
  }

  update({ dt, now, stateMachine, config }) {
    if (!this.isActive) {
      return;
    }

    this.phase += dt;

    if (stateMachine.is("CASTING")) {
      this.castProgress = Math.min(1, this.castProgress + config.castingLerp);
      const arc = Math.sin(this.castProgress * Math.PI) * 70;
      this.x = this.lerp(this.startX, this.targetX, this.castProgress);
      this.y = this.lerp(this.startY, this.targetY, this.castProgress) - arc;
      return;
    }

    const idleBob =
      Math.sin(now * config.idleBobSpeed) * config.idleBobAmplitude;
    const nibbleBob =
      Math.sin(now * config.nibbleBobSpeed) * config.nibbleBobAmplitude;

    if (stateMachine.is("WAITING")) {
      this.x = this.targetX;
      this.y = this.targetY + idleBob;
      return;
    }

    if (stateMachine.is("NIBBLE")) {
      this.x = this.targetX;
      this.y = this.targetY + nibbleBob;
      return;
    }

    if (stateMachine.is("BITE")) {
      this.x = this.targetX;
      this.y = this.targetY + config.biteSinkDepth;
      return;
    }

    if (stateMachine.is("CAUGHT")) {
      this.x = this.lerp(this.x, this.startX, 0.14);
      this.y = this.lerp(this.y, this.startY, 0.14);
      return;
    }

    if (stateMachine.is("ESCAPED")) {
      this.x = this.targetX;
      this.y = this.targetY + idleBob * 0.5;
    }
  }

  hasReachedTarget() {
    return this.castProgress >= 0.999;
  }

  lerp(start, end, t) {
    return start + (end - start) * t;
  }
}
