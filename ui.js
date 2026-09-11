// UI module: score, lives, and menu screens
export class UI {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.score = 0;
    this.lives = 3;
    this.activeScreen = 'start'; // start, playing, gameover, victory
    this.progress = 0; // 0-99
  }

  setScore(s) { this.score = s; this._updateDom(); }
  setLives(l) { this.lives = l; this._updateDom(); }

  addProgress(p) { this.progress = Math.min(99, this.progress + p); this._updateDom(); }

  _updateDom() {
    const s = document.getElementById('score');
    const l = document.getElementById('lives');
    if (s) s.textContent = `Score: ${this.score}`;
    if (l) l.textContent = `Lives: ${this.lives}`;
    const pBar = document.getElementById('progress-bar');
    if (pBar) pBar.style.width = `${this.progress}%`;
  }

  drawStart() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(120, 120, this.canvas.width - 240, 240);
    ctx.fillStyle = '#fff';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BreakPoint', this.canvas.width / 2, 200);
    ctx.font = '18px Arial';
    ctx.fillText('Arrow keys to move — Press Space to Start', this.canvas.width / 2, 260);
    ctx.restore();
  }

  drawGameOver() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(120, 120, this.canvas.width - 240, 200);
    ctx.fillStyle = '#fff';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', this.canvas.width / 2, 220);
    ctx.font = '18px Arial';
    ctx.fillText('Press Space to Restart', this.canvas.width / 2, 260);
    ctx.restore();
  }
  // Victory screen intentionally omitted for impossible-win mechanics
}
