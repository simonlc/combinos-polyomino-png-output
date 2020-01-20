const fs = require('fs');
const R = require('ramda');
const { createCanvas } = require('canvas');
const data = require('./data');

const width = 40;

const canvasWidth = width * 10;
const canvasHeight = (data.length / width) * 10 + 1;
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');
console.log(`creating ${canvasWidth}x${canvasHeight} canvas`);

// Create background
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

function draw(polyomino, color, i) {
  ctx.fillStyle = 'black';
  for (let mino = 0; mino < polyomino.length; mino++) {
    ctx.fillRect(
      (i % width) * 10 + polyomino[mino][0],
      Math.floor(i / width) * 10 + polyomino[mino][1],
      1,
      1,
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
