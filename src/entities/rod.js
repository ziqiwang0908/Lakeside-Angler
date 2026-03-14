export class Rod {
  constructor() {
    this.baseX = 0;
    this.baseY = 0;
    this.tipX = 0;
    this.tipY = 0;
  }

  updateLayout(width, height) {
    this.baseX = width + 40;
    this.baseY = height + 40;
    this.tipX = width * 0.84;
    this.tipY = height * 0.44;
  }
}
