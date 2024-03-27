export default function sketch(p) {
  const WH_RATIO = 1.4142; // Poster ratio
  const DEBUG = false;

  let xrplAddress;
  let shapes = [
    "rectangle", "square", "circle", "disc", "cup", "arc", "linesH", "triangle", "bracket"
  ];

  let w, h, frameSize, xrplLogo;
  let rng;

  p.preload = function () {
    // Note: Adjust the loadImage path as necessary
    xrplLogo = p.loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAtwAAAC2CAMAAADdh6pOAAADAFBMVEUAAAD/...");
  };

  p.setup = function () {
    // Parse URL parameters for xrplAddress
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('xrplAddress')) {
      xrplAddress = urlParams.get('xrplAddress');
    } else {
      xrplAddress = "rwtBc9qqMHwfaYhfEq6Eek7fnR2x4qc2VK"; // Default Genesis account
    }

    rng = new SeededRandom(xrplAddress);

    p.noLoop();
    p.pixelDensity(1);
    p.colorMode(p.HSB);
    p.strokeCap(p.ROUND);

    w = 1200;
    h = (w * 4) / 3;
    frameSize = w / 30;

    loadPalette();
    p.createCanvas(w, h);
  };

  p.draw = function () {
    // Your drawing logic here
    // Remember to use `p.` prefix for all p5 functions and variables, e.g., p.background(), p.fill(), etc.
  };

  function SeededRandom(xrplAddress) {
    // rng initialization and methods
  }

  function myRandom(min, max) {
    // Utility function using rng
  }

  function randomInt(min, max) {
    // Another utility function
  }

  function keyPressed() {
    // Key pressed logic
  }

  function drawShape(shape, color, x, y, size) {
    // Shape drawing logic
  }

  function drawFrame(frameWidth, color) {
    // Frame drawing logic
  }

  // Other functions as needed, adapted to instance mode

  // Initialize your RNG, shapes, and any other variables or functions here
  // Make sure to use `p.functionName` or `p.variableName` for all p5 related calls
}
