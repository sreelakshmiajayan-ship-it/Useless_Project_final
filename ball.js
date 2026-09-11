// Ball module: ball state, movement, rendering, and reset
export class Ball {
  constructor(canvasWidth, canvasHeight) {
    this.radius = 8;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.reset();
  }

  reset() {
    this.x = this.canvasWidth / 2;
    this.y = this.canvasHeight / 2;
    // initial velocity
    this.speed = 5;
    // set to a slight upward-left or upward-right
    const angle = (Math.random() * Math.PI) / 3 + Math.PI / 6; // 30-90 degrees
    const dir = Math.random() < 0.5 ? 1 : -1;
    this.vx = Math.cos(angle) * this.speed * dir;
    this.vy = -Math.abs(Math.sin(angle) * this.speed);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = '#ffd166';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}
