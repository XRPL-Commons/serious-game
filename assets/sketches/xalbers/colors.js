
// TODO : ADD XRPL COMMONS COLORS
// TODO : ADD GRADIENTS

let monoChrome = false;
let camaieux = false;

let colGreen = "#19FF83",
  colBlue = "#19A3FF",
  colPurple = "#791AFF",
  colRedPurple = "#D91AFF",
  colMagenta = "#FF1A8B",
  colOrange = "#FF671A",
  colYellow = "#FAFF1A",
  colBlack = "#111112",
  colWhite = "#F5F5F",
  colGray = "#39383A";
colMarine = "#000837"

// XRPL COLORS

let palettes = [

  ["#19FF83", "#19A3FF", "#791AFF", "#D91AFF", "#FF1A8B", "#FF671A", "#FAFF1A", "#111112", "#F5F5F", "#39383A"],

  ["#9DB4C0", "#c2dfe3", "#EFA00B", "#5c6b73", "#253237"],
  ["#1C110A", "#E9B44C", "#50A2A7", "#9B2915", "#E4D6A7"],
  ["#F2D492", "#F29559", "#B8B08D", "#283845", "#202C39"],
  ["#F9DBBD", "#FCA17D", "#DA627D", "#9A348E", "#0D0628"],
  ["#EEF0F2", "#EEC643", "#011638", "#0D21A1", "#141414"],
  ["#D1D1D1", "#EAD94C", "#DD7373", "#51A3A3", "#3B3561"],
  ["#DDE8B9", "#E8D2AE", "#D7B29D", "#CB8589", "#796465"],
  ["#FFFFFF", "#588B8B", "#F28F3B", "#C8553D", "#FFD5C2"],
  ["#E1CA96", "#ACA885", "#918B76", "#626C66", "#434A42"],
  ["#A29C9B", "#A62639", "#DB324D", "#56494E", "#511C29"],
  ["#FFD9CE", "#DB5461", "#593C8F", "#8AE1FC", "#171738"],
  ["#D0DB97", "#69B578", "#3A7D44", "#254D32", "#181D27"],
  ["#393E46", "#D65A31", "#AFA98D", "#E2C2C6", "#222831"],
  ["#EEF7FB", "#A3B4A2", "#CDC6AE", "#99CEEB", "#152728"],
  ["#F4F4F4", "#F0A500", "#CF7500", "#666666", "#1A1C20"],
  ["#d8cbc7", "#856084", "#f55d3e", "#077187", "#161925"],
  ["#d8e2dc", "#ffffff", "#546A7B", "#F57266", "#050B10"],
  ["#D8C8E5", "#F46036", "#414770", "#5B85AA", "#120D1C"],
  ["#FBFEF9", "#E1A3AD", "#ED7B84", "#A6BEC9", "#000000"],
  ["#505050", "#363636", "#292929", "#282828", "#080808"],
  ["#E8DDCB", "#036564", "#033649", "#CDB380", "#021027"],
  ["#D5DED9", "#948C75", "#99B2B7", "#D9CEB2", "#251F18"],
  ["#FCF6BD", "#F68787", "#FFB6B9", "#D67373", "#162C3B"],
  ["#FFEBA1", "#FFC857", "#DB3A34", "#08415C", "#071013"],
  ["#E6EBE0", "#F4F1BB", "#9BC1BC", "#EF7B6C", "#1E1C22"],
  ["#CAD2C5", "#52796F", "#354F52", "#84A98C", "#182025"],
  ["#F5E0E7", "#F55D3E", "#D8CBC7", "#077187", "#161925"],
  ["#F6F0ED", "#C2948A", "#7EA8BE", "#BBB193", "#11232D"],
  ["#FEEFDD", "#FAAA8D", "#FF571F", "#50B2C0", "#201E1F"],
  ["#F7E092", "#FDBD28", "#F04848", "#37AD86", "#14142A"],
  ["#E7EFC5", "#BFD7B5", "#A3C4BC", "#F2DDA4", "#2D293D"],
  ["#b9d6f2", "#0353a4", "#006daa", "#003559", "#061a40"],
  ["#f4effa", "#c8b1e4", "#9b72cf", "#532b88", "#2f184b"],
  ["#e5e9f0", "#d8dee9", "#4c566a", "#434c5e", "#2e3440"],
  ["#562C2C", "#F2542D", "#0E9594", "#127475", "#F5DFBB"],
  ["#F1E9DA", "#541388", "#D90368", "#FFD400", "#2E294E"],
  ["#E6F2DA", "#A2D7C2", "#FF9B6A", "#8E5252", "#260B1A"],
  ["#443850", "#E4F58C", "#E87058", "#A3E7E4", "#10141C"],
  ["#040F0F", "#8A2BE2", "#20B2AA", "#FF6347", "#FCFFFC"],
  ["#EEEEFF", "#00CED1", "#FF69B4", "#FFD700", "#191919"],
  ["#FEFFEA", "#FCFC62", "#C9C9C9", "#A3A3A3", "#424242"],
  ["#F0E7D8", "#477998", "#F64740", "#A3333D", "#291F1E"],
  ["#fffcf2", "#ccc5b9", "#403d39", "#eb5e28", "#252422"],
  ["#faf3dd", "#ffa69e", "#b8f2e6", "#aed9e0", "#5e6472"],
  ["#ece2d0", "#cebebe", "#d5b9b2", "#a26769", "#6d2e46"],
  ["#bfc3ba", "#a9aca9", "#60495a", "#3f3244", "#2f2235"],
  ["#B5E48C", "#76C893", "#34A0A4", "#1A759F", "#184E77"],
  ["#FEFAE0", "#606C38", "#DDA15E", "#BC6C25", "#283618"],
  ["#EA8C55", "#C75146", "#AD2E24", "#81171B", "#540804"],
  ["#F9C784", "#FCAF58", "#74C69D", "#40916C", "#1B4332"],
  ["#423E3B", "#FF2E00", "#FEA82F", "#5448C8", "#FFFECB"],
  ["#331832", "#D81E5B", "#F0544F", "#C6D8D3", "#FDF0D5"],
  ["#011627", "#FF3366", "#2EC4B6", "#20A4F3", "#F6F7F8"],
  ["#3A2E39", "#1E555C", "#EDB183", "#F15152", "#F4D8CD"],
  ["#0B090B", "#141414", "#000000", "#D80032", "#0A0A0A"],
  ["#1A535C", "#4ECDC4", "#FF6B6B", "#FFE66D", "#F7FFF7"],
  ["#4B3F48", "#807B67", "#8F8D89", "#BEB2A7", "#C5BEBC"],

];


let colors = [colGreen, colBlue, colPurple, colRedPurple, colMagenta, colOrange, colYellow, colBlack];
let bgColors = [colBlack, colGray, colMarine]
let bgColor = "";


function loadPalette() {
  if (DEBUG) console.log("MONO = " + monoChrome + "CAMAIEU = " + camaieux)

  if (monoChrome) {
    colors = []
    randz = Math.floor(rng.random() * palettes.length)
    colors = palettes[randz]
    randz = Math.floor(rng.random() * colors.length)
    let temp = []
    temp[0] = colors[randz]
    colors = temp
  } else if (camaieux) {
    colors = []
    baseColor = colMagenta //palettes[randz][0]
    for (let i = 0; i < 15; i++) {
      colors.push(color(hue(baseColor), map(i, 0, 14, saturation(baseColor), 0), map(i, 0, 14, brightness(baseColor), 100)));
    }
  } else {
    randz = Math.floor(myRandom(0, 1) * palettes.length)
    colors = palettes[randz]
  }




}

/* COLOR UTILS */
// ------------------------------------------
//               COLOR UTILS
// ------------------------------------------

// convert rgb color to normalized hsl values
function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
}

// hsl to rgb, takes normalized hsl values
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


// hsl to hex, takes normalized hsl values
function hslToHex(h, s, l) {
  h *= 360;
  s *= 100;

  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// get normalized hsl values from hex color
function hexToHsl(hex) {
  let rgb = [
    parseInt(hex.substr(1, 2), 16), // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
    parseInt(hex.substr(3, 2), 16),
    parseInt(hex.substr(5, 2), 16)
  ];
  return rgbToHsl(rgb[0], rgb[1], rgb[2]);
}

// used in rgb to hex function
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

// rgb to hex
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// hex to rgb
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

/**
 * CREATE A GRADIENT FROM 2 COLORS
 */

function linearGradientFill(x1, y1, x2, y2, color1, color2) {
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.strokeStyle = gradient;
}


function paperTexture() {
  noFill()
  textureNum = (width * height) / 40
  colorMode(RGB)
  for (i = 0; i < textureNum; i++) {
    stroke(myRandom(100, 150), myRandom(100, 150), myRandom(100, 150), 10) //12
    x = myRandom(-width * 0.2, width * 1.2)
    y = myRandom(-height * 0.2, height * 1.2)
    push()
    translate(x, y)
    strokeWeight(0.6)
    point(0, 0)
    strokeWeight(0.5)
    rotate(myRandom(0, PI * 2))
    curve(
      myRandom(60, 220),
      0,
      0,
      myRandom(-50, 50),
      myRandom(-50, 50),
      myRandom(60, 120),
      myRandom(60, 120),
      myRandom(60, 120)
    )
    pop()
  }
}

export default {
  loadPalette,
  rgbToHsl,
  hslToRgb,
  hue2rgb,
  hslToHex,
  hexToHsl,
  componentToHex,
  rgbToHex,
  hexToRgb,
  linearGradientFill,
  paperTexture
}