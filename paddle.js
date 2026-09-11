// Paddle module: handles paddle state, input, movement, and rendering
export class Paddle {
  constructor(canvasWidth, canvasHeight) {
    this.width = 120;
    this.height = 14;
    this.x = (canvasWidth - this.width) / 2;
    this.y = canvasHeight - this.height - 30;
    this.speed = 8; // pixels per frame when key held
    this.vx = 0;
    this.canvasWidth = canvasWidth;

    this.keys = { left: false, right: false };
    this._bindEvents();
  }

  _bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowLeft') this.keys.left = true;
      if (e.code === 'ArrowRight') this.keys.right = true;
    });
    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft') this.keys.left = false;
      if (e.code === 'ArrowRight') this.keys.right = false;
    });
  }

  update() {
    if (this.keys.left && !this.keys.right) this.vx = -this.speed;
    else if (this.keys.right && !this.keys.left) this.vx = this.speed;
    else this.vx = 0;

    this.x += this.vx;
    // Constrain inside canvas
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > this.canvasWidth) this.x = this.canvasWidth - this.width;
  }

  draw(ctx) {
    ctx.fillStyle = '#1e90ff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // subtle border
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  reset() {
    this.x = (this.canvasWidth - this.width) / 2;
    this.vx = 0;
    this.keys.left = this.keys.right = false;
  }
}
