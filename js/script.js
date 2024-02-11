const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const color1 = "#484848"
const color2 = "#b9b9b9"

let numCols = 10;
let numRows = 12;

let blockHeight = canvas.height / numRows;
let blockWidth = canvas.width / numCols;

let ballSpeed = 12

let Ball1 = {
  x: canvas.width / 4,
  y: canvas.height / 2,
  direction: Math.random() * Math.PI * 2,
  speed: ballSpeed,
  radius: 12,
  color: color1
}

let Ball2 = {
  x: (canvas.width * 3) / 4,
  y: canvas.height / 2,
  direction: Math.random() * Math.PI * 2,
  speed: ballSpeed,
  radius: 12,
  color: color2
}

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

let blocks = []
function drawBlocks() {
  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      ctx.beginPath();
      ctx.rect(i * blockWidth, j * blockHeight, blockWidth, blockHeight);
      ctx.fillStyle = blocks[i][j];
      ctx.fill();
      ctx.closePath();
    }
  }
}

function oppositeColor(ball) {
  let color;
  if (ball.color === color1) {
    color = color2;
  } else {
    color = color1;
  }
  return color;
}

function updateBall(ball) {
  // Add slight randomness to the ball's direction
  let randomAngle = (Math.random() - 0.5) * 0.1; // Adjust the range and magnitude as needed

  ball.x += Math.cos(ball.direction + randomAngle) * ball.speed;
  ball.y += Math.sin(ball.direction + randomAngle) * ball.speed;

  let col = Math.floor(ball.x / blockWidth);
  let row = Math.floor(ball.y / blockHeight);

  // Adjusting for the ball's radius
  let ballLeft = ball.x - ball.radius;
  let ballRight = ball.x + ball.radius;
  let ballTop = ball.y - ball.radius;
  let ballBottom = ball.y + ball.radius;

  // Bounce off walls
  if (ballRight > canvas.width || ballLeft < 0) {
    // Reverse the horizontal direction
    ball.direction = Math.PI - ball.direction + randomAngle;
  }
  if (ballBottom > canvas.height || ballTop < 0) {
    // Reverse the vertical direction
    ball.direction = -ball.direction + randomAngle;
  }
  if (col >= 0 && col < numCols && row >= 0 && row < numRows) {
    // Check collision with the block
    if (blocks[col][row] === ball.color) {
      let blockLeft = col * blockWidth;
      let blockRight = blockLeft + blockWidth;
      let blockTop = row * blockHeight;
      let blockBottom = blockTop + blockHeight;

      // Check collision with block sides
      let horizontalIntersection = ballRight >= blockLeft && ballLeft <= blockRight;
      let verticalIntersection = ballBottom >= blockTop && ballTop <= blockBottom;

      if (horizontalIntersection && verticalIntersection) {
        // Both horizontal and vertical intersections, need to determine which side to bounce off

        let horizontalDistance = Math.min(ballRight - blockLeft, blockRight - ballLeft);
        let verticalDistance = Math.min(ballBottom - blockTop, blockBottom - ballTop);

        if (horizontalDistance < verticalDistance) {
          ball.direction = Math.PI - ball.direction + randomAngle; // Reverse horizontal direction
        } else {
          ball.direction = -ball.direction + randomAngle; // Reverse vertical direction
        }
      } else if (horizontalIntersection) {
        ball.direction = Math.PI - ball.direction + randomAngle; // Reverse horizontal direction
      } else if (verticalIntersection) {
        ball.direction = -ball.direction + randomAngle; // Reverse vertical direction
      }

      // Change block color and any other actions
      blocks[col][row] = oppositeColor(ball)
    }
  }
}


function init() {
  // Determine squares
  for (let i = 0; i < numCols; i++) {
    blocks[i] = [];
    for (let j = 0; j < numRows; j++) {
      if (i < numCols / 2) {
        blocks[i][j] = color2;
      } else {
        blocks[i][j] = color1;
      }
    }
  }
}

function gameLoop() {
  drawBlocks();
  drawBall(Ball1);
  drawBall(Ball2);
  updateBall(Ball1);
  updateBall(Ball2);
  requestAnimationFrame(gameLoop);
}

init()
gameLoop();

