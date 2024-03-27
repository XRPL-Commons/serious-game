// assets/sketch.js

export default function sketch(p) {
  p.setup = function () {
    p.createCanvas(400, 400);
    p.background(100);
  };

  p.draw = function () {
    p.fill(255);
    p.ellipse(p.width / 2, p.height / 2, 50, 50);
  };
}
