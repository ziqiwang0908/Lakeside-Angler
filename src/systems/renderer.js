export class Renderer {
  constructor({ canvas, ctx, config }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.config = config;
  }

  render({ width, height, time, stateMachine, rod, bobber, fish, caughtCount }) {
    const waterline = height * this.config.waterLevel;

    this.drawSky(width, waterline);
    this.drawWater(width, height, waterline);
    this.drawFish(fish, time);
    this.drawWaves(width, waterline, time);
    this.drawShore(width, height, waterline);
    this.drawRod(rod);
    this.drawLine(rod, bobber, stateMachine);
    this.drawBobberRipples(bobber, stateMachine, time);
    this.drawBobber(bobber);
    this.drawCatchCounter(caughtCount);
  }

  drawSky(width, waterline) {
    const sky = this.ctx.createLinearGradient(0, 0, 0, waterline);
    sky.addColorStop(0, "#8ad9df");
    sky.addColorStop(1, "#e0ebee");
    this.ctx.fillStyle = sky;
    this.ctx.fillRect(0, 0, width, waterline);
  }

  drawWater(width, height, waterline) {
    const water = this.ctx.createLinearGradient(0, waterline, 0, height);
    water.addColorStop(0, "#2a6168");
    water.addColorStop(1, "#081416");
    this.ctx.fillStyle = water;
    this.ctx.fillRect(0, waterline, width, height - waterline);
  }

  drawShore(width, height, waterline) {
    const shore = this.ctx.createLinearGradient(0, waterline - 14, 0, waterline + 18);
    shore.addColorStop(0, "#7a7551");
    shore.addColorStop(1, "#51472c");
    this.ctx.fillStyle = shore;
    this.ctx.fillRect(0, waterline - 12, width, 20);
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    this.ctx.fillRect(0, waterline - 2, width, 2);
  }

  drawWaves(width, waterline, time) {
    this.ctx.save();
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    this.ctx.lineWidth = 2;

    for (let band = 0; band < this.config.backgroundWaveBands; band += 1) {
      const yBase = waterline + band * 22;
      this.ctx.beginPath();
      this.ctx.moveTo(0, yBase);

      for (let x = 0; x <= width; x += 24) {
        const wave = Math.sin(x * 0.012 + time * 0.002 + band) * 5;
        this.ctx.lineTo(x, yBase + wave);
      }

      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  drawFish(fish, time) {
    for (const swimmer of fish) {
      this.ctx.save();
      this.ctx.translate(
        swimmer.x,
        swimmer.y + Math.sin(time * 0.002 + swimmer.sineOffset) * 2
      );
      this.ctx.scale(swimmer.direction, 1);
      this.ctx.fillStyle = swimmer.focused
        ? "rgba(31, 79, 85, 0.56)"
        : "rgba(9, 36, 40, 0.34)";

      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, swimmer.size, swimmer.size * 0.44, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(-swimmer.size + 4, 0);
      this.ctx.lineTo(-swimmer.size - 12, -8);
      this.ctx.lineTo(-swimmer.size - 12, 8);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  drawRod(rod) {
    this.ctx.save();
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = "#5a3725";
    this.ctx.lineWidth = 8;
    this.ctx.beginPath();
    this.ctx.moveTo(rod.baseX, rod.baseY);
    this.ctx.lineTo(rod.tipX, rod.tipY);
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawLine(rod, bobber, stateMachine) {
    if (!bobber.isActive) {
      return;
    }

    const tension = stateMachine.is("BITE") || stateMachine.is("CAUGHT");
    const controlX = (rod.tipX + bobber.x) * 0.5;
    const controlY =
      (rod.tipY + bobber.y) * 0.5 + (tension ? -8 : 42);

    this.ctx.save();
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
    this.ctx.lineWidth = 1.4;
    this.ctx.setLineDash([3, 3]);
    this.ctx.beginPath();
    this.ctx.moveTo(rod.tipX, rod.tipY);
    this.ctx.quadraticCurveTo(controlX, controlY, bobber.x, bobber.y);
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawBobberRipples(bobber, stateMachine, time) {
    if (!bobber.isActive || stateMachine.is("CASTING")) {
      return;
    }

    let rippleStrength = 0.35;
    let radiusBoost = 0;

    if (stateMachine.is("NIBBLE")) {
      rippleStrength = 0.65;
      radiusBoost = 6;
    } else if (stateMachine.is("BITE")) {
      rippleStrength = 0.9;
      radiusBoost = 12;
    } else if (stateMachine.is("CAUGHT")) {
      rippleStrength = 0.7;
      radiusBoost = 8;
    }

    this.ctx.save();
    this.ctx.lineWidth = 2;

    for (let ring = 0; ring < 3; ring += 1) {
      const pulse = ((time * 0.03 + ring * 18) % 36) / 36;
      const radius = 12 + pulse * 18 + ring * 6 + radiusBoost;
      const alpha = (1 - pulse) * rippleStrength * (0.32 - ring * 0.06);
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(alpha, 0.05)})`;
      this.ctx.beginPath();
      this.ctx.ellipse(
        bobber.x,
        bobber.targetY + 4,
        radius,
        Math.max(4, radius * 0.33),
        0,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  drawBobber(bobber) {
    if (!bobber.isActive) {
      return;
    }

    this.ctx.save();
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
    this.ctx.beginPath();
    this.ctx.ellipse(bobber.x, bobber.targetY + 5, 13, 5, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = "#ff5d3d";
    this.ctx.beginPath();
    this.ctx.arc(bobber.x, bobber.y - 6, 8, Math.PI, 0);
    this.ctx.fill();

    this.ctx.fillStyle = "#ffffff";
    this.ctx.beginPath();
    this.ctx.arc(bobber.x, bobber.y - 6, 8, 0, Math.PI);
    this.ctx.fill();

    this.ctx.strokeStyle = "#262626";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(bobber.x, bobber.y - 14);
    this.ctx.lineTo(bobber.x, bobber.y - 24);
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawCatchCounter(caughtCount) {
    this.ctx.save();
    this.ctx.fillStyle = "rgba(7, 17, 20, 0.38)";
    this.ctx.fillRect(20, 20, 140, 48);
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    this.ctx.strokeRect(20, 20, 140, 48);
    this.ctx.fillStyle = "#f4f8f8";
    this.ctx.font = "16px Segoe UI";
    this.ctx.fillText(`Caught: ${caughtCount}`, 34, 50);
    this.ctx.restore();
  }
}
