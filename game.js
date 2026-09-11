import { Paddle } from './paddle.js';
import { Ball } from './ball.js';
import { BrickField } from './bricks.js';
import { handleWallCollision, handlePaddleCollision, handleBrickCollision } from './collision.js';
import { UI } from './ui.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const GAME = {
  screen: 'start', // start, playing, gameover
  score: 0,
  lives: 3,
};

let paddle, ball, bricks, ui;
let particles = [];
let shakeTime = 0;

function init() {
  paddle = new Paddle(canvas.width, canvas.height);
  ball = new Ball(canvas.width, canvas.height);
  bricks = new BrickField(10, 5, canvas.width);
  ui = new UI(ctx, canvas);
  ui.setScore(GAME.score);
  ui.setLives(GAME.lives);

  window.addEventListener('keydown', onKeyDown);
}

function onKeyDown(e) {
  if (GAME.screen === 'start' && e.code === 'Space') {
    GAME.screen = 'playing';
  } else if (GAME.screen === 'gameover' && e.code === 'Space') {
    restartGame();
  }
}

function restartGame() {
  GAME.score = 0;
  GAME.lives = 3;
  ui.setScore(GAME.score);
  ui.setLives(GAME.lives);
  bricks = new BrickField(10, 5, canvas.width);
  paddle.reset();
  ball.reset();
  ui.progress = 0;
  GAME.screen = 'start';
}

function update() {
  if (GAME.screen !== 'playing') return;

  paddle.update();
  ball.update();

  handleWallCollision(ball);
  handlePaddleCollision(ball, paddle);

  const points = handleBrickCollision(ball, bricks);
  if (points > 0) {
    GAME.score += points;
    ui.setScore(GAME.score);
    ui.addProgress(0.2);

    spawnParticles(ball.x, ball.y);
    shakeTime = 6;
    const snd = document.getElementById('hit-sound');
    if (snd && snd.play) {
      try { snd.currentTime = 0; snd.play(); } catch (e) {}
    }
  }

  if (ball.y - ball.radius > canvas.height) {
    GAME.lives -= 1;
    ui.setLives(GAME.lives);
    if (GAME.lives <= 0) {
      GAME.screen = 'gameover';
    } else {
      paddle.reset();
      ball.reset();
      GAME.screen = 'start';
    }
  }

  // No victory: bricks never fully removed
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let shakeX = 0, shakeY = 0;
  if (shakeTime > 0) {
    shakeX = (Math.random() - 0.5) * 8;
    shakeY = (Math.random() - 0.5) * 6;
    shakeTime -= 1;
  }
  ctx.save();
  ctx.translate(shakeX, shakeY);

  try {
    bricks.draw(ctx);
    paddle.draw(ctx);
    ball.draw(ctx);
    drawParticles(ctx);
  } catch (err) {
    console.error('Render error', err);
    // show an in-canvas error so user sees something
    ctx.fillStyle = 'rgba(255,0,0,0.9)';
    ctx.fillRect(20, 20, 300, 60);
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('Render error — check console', 30, 50);
  }

  ctx.restore();

  if (GAME.screen === 'start') ui.drawStart();
  else if (GAME.screen === 'gameover') ui.drawGameOver();
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

init();
requestAnimationFrame(loop);

function spawnParticles(x, y) {
  const count = 12;
  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 1.5) * 4,
      life: 40 + Math.random() * 20,
      size: 2 + Math.random() * 3,
      color: `hsl(${Math.random() * 60 + 30}, 80%, 50%)`,
    });
  }
}

function drawParticles(ctx) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    p.life -= 1;
    if (p.life <= 0) particles.splice(i, 1);
  }
}
