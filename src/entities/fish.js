export class Fish {
  constructor(id) {
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.baseY = 0;
    this.speed = 0;
    this.direction = 1;
    this.size = 20;
    this.sineOffset = Math.random() * Math.PI * 2;
    this.state = "PATROL";
    this.focused = false;
  }

  randomizePosition(width, height, waterLevel) {
    const waterTop = height * waterLevel + 36;
    const waterHeight = Math.max(120, height - waterTop - 32);
    this.x = Math.random() * width;
    this.baseY = waterTop + Math.random() * waterHeight;
    this.y = this.baseY;
    this.speed = 0.35 + Math.random() * 0.75;
    this.direction = Math.random() > 0.5 ? 1 : -1;
    this.size = 18 + Math.random() * 16;
    this.sineOffset = Math.random() * Math.PI * 2;
    this.state = "PATROL";
    this.focused = false;
  }

  setState(nextState) {
    this.state = nextState;
    this.focused = nextState !== "PATROL";
  }

  onCaught() {
    this.setState("ESCAPE");
  }

  onEscape() {
    this.direction *= -1;
    this.setState("ESCAPE");
  }
}
