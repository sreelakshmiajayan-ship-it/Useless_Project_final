// Bricks module: generate bricks grid, render, and removal
export class Brick {
  constructor(x, y, width, height, points = 10) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.points = points;
    this.health = 100; // never reaches 0
  }

  // apply damage but never allow health to reach 0
  hit(damage = 10) {
    this.health -= damage;
    if (this.health < 1) this.health = 1; // critical rule: never zero
    return this.points;
  }

  draw(ctx) {
    // Visual appearance changes per health stage
    const h = this.health;
    // base color
    let color = '#ff6b6b';
    if (h < 80) color = '#ff7f7f';
    if (h < 60) color = '#ff9a9a';
    if (h < 40) color = '#ffb3b3';
    if (h < 20) color = '#ffdede';

    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // draw cracks / fragments based on stage
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    ctx.lineWidth = 1;
    if (h < 80 && h >= 60) {
      // small crack
      ctx.beginPath();
      ctx.moveTo(this.width * 0.2, this.height * 0.3);
      ctx.lineTo(this.width * 0.5, this.height * 0.5);
      ctx.lineTo(this.width * 0.3, this.height * 0.7);
      ctx.stroke();
    } else if (h < 60 && h >= 40) {
      // multiple cracks
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(this.width * (0.2 + i * 0.2), this.height * 0.2 + i);
        ctx.lineTo(this.width * (0.5 - i * 0.05), this.height * (0.4 + i * 0.1));
        ctx.lineTo(this.width * (0.3 + i * 0.05), this.height * (0.7 - i * 0.05));
        ctx.stroke();
      }
    } else if (h < 40 && h >= 20) {
      // heavy damage, missing corners
      ctx.clearRect(0, 0, this.width * 0.15, this.height * 0.2);
      ctx.clearRect(this.width * 0.85, this.height * 0.75, this.width * 0.15, this.height * 0.25);
      // darker cracks
      ctx.beginPath();
      ctx.moveTo(this.width * 0.15, this.height * 0.3);
      ctx.lineTo(this.width * 0.5, this.height * 0.5);
      ctx.lineTo(this.width * 0.35, this.height * 0.8);
      ctx.stroke();
    } else if (h < 20) {
      // nearly destroyed: draw small fragments
      const fragCount = 6;
      for (let i = 0; i < fragCount; i++) {
        const fx = Math.random() * this.width;
        const fy = Math.random() * this.height;
        const fw = Math.random() * (this.width * 0.15) + 2;
        const fh = Math.random() * (this.height * 0.15) + 2;
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(fx, fy, fw, fh);
      }
    }
    ctx.restore();
  }
}

export class BrickField {
  constructor(cols = 10, rows = 5, canvasWidth = 800) {
    this.cols = cols;
    this.rows = rows;
    this.canvasWidth = canvasWidth;
    this.bricks = [];
    this.padding = 8;
    this.offsetTop = 60;
    this.offsetLeft = 40;
    this._generate();
  }

  _generate() {
    this.bricks = [];
    const totalPaddingX = this.padding * (this.cols - 1);
    const availableWidth = this.canvasWidth - this.offsetLeft * 2 - totalPaddingX;
    const brickWidth = Math.floor(availableWidth / this.cols);
    const brickHeight = 20;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = this.offsetLeft + c * (brickWidth + this.padding);
        const y = this.offsetTop + r * (brickHeight + this.padding);
        this.bricks.push(new Brick(x, y, brickWidth, brickHeight, 10));
      }
    }
  }

  draw(ctx) {
    this.bricks.forEach((b) => b.draw(ctx));
  }

  // count bricks that are at minimal health (fragments)
  getFragmentCount() {
    return this.bricks.filter((b) => b.health <= 1).length;
  }
}
