// Collision helpers for ball vs walls, paddle, and bricks
export function handleWallCollision(ball) {
  // left/right
  if (ball.x - ball.radius <= 0) {
    ball.x = ball.radius;
    ball.vx *= -1;
  }
  if (ball.x + ball.radius >= ball.canvasWidth) {
    ball.x = ball.canvasWidth - ball.radius;
    ball.vx *= -1;
  }
  // top
  if (ball.y - ball.radius <= 0) {
    ball.y = ball.radius;
    ball.vy *= -1;
  }
}

export function handlePaddleCollision(ball, paddle) {
  // AABB circle collision approx
  if (
    ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height
  ) {
    // Move ball above paddle
    ball.y = paddle.y - ball.radius - 0.1;
    // Reflect Y
    ball.vy *= -1;

    // adjust X velocity based on where it hit the paddle
    const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    ball.vx += hitPos * 2; // add some control
    // clamp speed
    const maxSpeed = 12;
    const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    if (speed > maxSpeed) {
      ball.vx = (ball.vx / speed) * maxSpeed;
      ball.vy = (ball.vy / speed) * maxSpeed;
    }
  }
}

export function handleBrickCollision(ball, brickField) {
  for (const brick of brickField.bricks) {
    // simple AABB collision for circle vs rect
    const distX = Math.abs(ball.x - (brick.x + brick.width / 2));
    const distY = Math.abs(ball.y - (brick.y + brick.height / 2));

    if (distX > brick.width / 2 + ball.radius) continue;
    if (distY > brick.height / 2 + ball.radius) continue;

    // collision detected: apply damage but never remove the brick
    const points = brick.hit(10);

    // reflect ball based on side
    if (distX <= brick.width / 2) {
      ball.vy *= -1;
    } else if (distY <= brick.height / 2) {
      ball.vx *= -1;
    } else {
      ball.vx *= -1;
      ball.vy *= -1;
    }

    return points;
  }
  return 0;
}
