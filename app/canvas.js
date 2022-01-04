var canvas;
var penColor = "#2d3436";

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  background(220, 220, 220);

  socket.emit("init-vectors", roomID, (response) => {
    console.log("Init Vectors", response);
    _vectors = response;
    _vectors.forEach((path) => {
      noFill();
      beginShape();
      path.forEach((point) => {
        stroke(point.color);
        strokeWeight(point.weight);
        vertex(point.x, point.y);
      });
      endShape();
    });
  });
}
const paths = [];
let currentPath = [];

function draw() {
  var userIsDrawing = sessionStorage.getItem(username);
  if (userIsDrawing === "isDrawing") {
    noFill();
    if (mouseIsPressed) {
      const point = {
        x: mouseX,
        y: mouseY,
        color: penColor,
        weight: 2,
      };
      currentPath.push(point);
    }
    paths.forEach((path) => {
      beginShape();
      path.forEach((point) => {
        stroke(point.color);
        strokeWeight(point.weight);
        vertex(point.x, point.y);
      });
      endShape();
    });
  } else {
    noFill();
    beginShape();
    _path.forEach((_point) => {
      stroke(_point.color);
      strokeWeight(_point.weight);
      vertex(_point.x, _point.y);
    });
    endShape();
  }
}

function mousePressed() {
  currentPath = [];
  paths.push(currentPath);
}

function mouseReleased() {
  socket.emit("drawing-event", roomID, currentPath);
}
function changeColor(e) {
  penColor = "#" + e.id;
}
