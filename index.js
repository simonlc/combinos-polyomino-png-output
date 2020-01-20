const fs = require('fs');
const R = require('ramda');
const { createCanvas } = require('canvas');
const data = require('./data');

const width = 84;
const cellSize = 5;
const padding = 5 * cellSize;
const boxWidth = 9;
const boxHeight = 16;

const canvasWidth = width * boxWidth * cellSize;
const canvasHeight = Math.ceil(data.length / width) * boxHeight * cellSize;
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');
console.log(`creating ${canvasWidth}x${canvasHeight} canvas`);

ctx.font = 'bold 13px monospace';

// Create background
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

function draw(polyomino, color, i) {
  // Box bg
  ctx.fillStyle =
    i % 2 === Number(Math.floor(i / width) % 2 === 0) ? 'black' : '#454545';
  ctx.fillRect(
    (i % width) * cellSize * boxWidth,
    Math.floor(i / width) * cellSize * boxHeight,
    boxWidth * cellSize,
    boxHeight * cellSize,
  );

  ctx.fillStyle = '#242424';

  ctx.fillText(
    (i + 1).toString().padStart(5, '0'),
    cellSize / 2 + (i % width) * cellSize * boxWidth,
    cellSize * 3 + Math.floor(i / width) * cellSize * boxHeight,
  );

  for (let mino = 0; mino < polyomino.length; mino++) {
    ctx.fillRect(
      padding +
        (i % width) * cellSize * boxWidth +
        polyomino[mino][0] * cellSize,
      cellSize * 9 +
        Math.floor(i / width) * cellSize * boxHeight +
        polyomino[mino][1] * cellSize,
      cellSize,
      cellSize,
    );
  }
}

function main() {
  for (let i = 0; i < data.length; i++) {
    const color = data[i].pop();
    const result = R.splitEvery(2, data[i].slice(3));
    draw(result, color, i);
  }

  // Save file
  const out = fs.createWriteStream(__dirname + '/test.png');
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log('The PNG file was created.'));
  return;
}

main();
